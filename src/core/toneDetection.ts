// Улучшенный алгоритм определения тонов китайского языка через анализ F0
// Более устойчивый к шуму, с сглаживанием и калибровкой уверенности

export interface ToneAnalysisResult {
  detectedTone: number;
  confidence: number;
  f0Trace: number[];
  averagePitch: number;
  debug?: {
    rawF0Count: number;
    scores: Record<number, number>;
  };
}

// Эталонные контуры тонов (нормализованные: 0 = низкий, 1 = высокий)
// Более детальные паттерны для лучшего DTW
const TONE_PATTERNS: Record<number, number[]> = {
  1: [0.82, 0.85, 0.88, 0.90, 0.90, 0.89, 0.88], // высокий ровный
  2: [0.25, 0.35, 0.50, 0.65, 0.78, 0.88, 0.92], // восходящий
  3: [0.55, 0.40, 0.25, 0.20, 0.28, 0.42, 0.55], // низкий с падением и подъёмом
  4: [0.92, 0.80, 0.60, 0.40, 0.25, 0.15, 0.10], // резкий нисходящий
  0: [0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50], // нейтральный
};

/**
 * Вычисляет F0 (fundamental frequency) из аудио буфера с помощью автокорреляции
 */
export function computeF0(audioBuffer: AudioBuffer, sampleRate: number): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const f0Trace: number[] = [];

  const windowSize = 2048;
  const hopSize = 256; // меньший hop для более плотного контура

  for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
    const window = channelData.slice(i, i + windowSize);
    const f0 = autocorrelate(window, sampleRate);
    if (f0 > 70 && f0 < 450) {
      // более узкий диапазон для человеческого голоса
      f0Trace.push(f0);
    }
  }

  return f0Trace;
}

function autocorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  if (rms < 0.008) return -1; // слишком тихо

  // Простая автокорреляция с поиском первого значимого пика
  const maxLag = Math.floor(sampleRate / 70);  // мин. 70 Hz
  const minLag = Math.floor(sampleRate / 450); // макс. 450 Hz

  let bestCorr = 0;
  let bestLag = -1;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    let norm1 = 0;
    let norm2 = 0;
    const len = SIZE - lag;

    for (let i = 0; i < len; i++) {
      corr += buffer[i] * buffer[i + lag];
      norm1 += buffer[i] * buffer[i];
      norm2 += buffer[i + lag] * buffer[i + lag];
    }

    const denom = Math.sqrt(norm1 * norm2);
    if (denom < 1e-6) continue;

    const normalized = corr / denom;
    if (normalized > bestCorr) {
      bestCorr = normalized;
      bestLag = lag;
    }
  }

  if (bestLag === -1 || bestCorr < 0.3) return -1;
  return sampleRate / bestLag;
}

/** Сглаживание контура (moving average) */
function smoothTrace(trace: number[], window = 3): number[] {
  if (trace.length < window) return trace;
  const result: number[] = [];
  const half = Math.floor(window / 2);

  for (let i = 0; i < trace.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = -half; j <= half; j++) {
      const idx = i + j;
      if (idx >= 0 && idx < trace.length) {
        sum += trace[idx];
        count++;
      }
    }
    result.push(sum / count);
  }
  return result;
}

/** Нормализация контура F0 к [0, 1] */
export function normalizeF0Trace(f0Trace: number[]): number[] {
  if (f0Trace.length === 0) return [];

  const min = Math.min(...f0Trace);
  const max = Math.max(...f0Trace);
  const range = max - min;

  if (range < 15) {
    // почти плоский — скорее всего 1-й тон или нейтральный
    return f0Trace.map(() => 0.75);
  }

  return f0Trace.map((f) => (f - min) / range);
}

/** Ресемплирование к фиксированной длине */
export function resampleTrace(trace: number[], targetLength: number = 7): number[] {
  if (trace.length === 0) return new Array(targetLength).fill(0.5);
  if (trace.length === targetLength) return [...trace];

  const result: number[] = [];
  for (let i = 0; i < targetLength; i++) {
    const pos = (i / (targetLength - 1)) * (trace.length - 1);
    const left = Math.floor(pos);
    const right = Math.min(left + 1, trace.length - 1);
    const frac = pos - left;
    result.push(trace[left] * (1 - frac) + trace[right] * frac);
  }
  return result;
}

/** Dynamic Time Warping */
function computeDTW(seq1: number[], seq2: number[]): number {
  const n = seq1.length;
  const m = seq2.length;
  const dtw: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(Infinity));

  dtw[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = Math.abs(seq1[i - 1] - seq2[j - 1]);
      dtw[i][j] =
        cost +
        Math.min(
          dtw[i - 1][j],     // insertion
          dtw[i][j - 1],     // deletion
          dtw[i - 1][j - 1]  // match
        );
    }
  }

  return dtw[n][m] / Math.max(n, m);
}

/**
 * Основная функция определения тона
 */
export function detectTone(f0Trace: number[]): ToneAnalysisResult {
  if (f0Trace.length < 4) {
    return {
      detectedTone: 0,
      confidence: 0,
      f0Trace: [],
      averagePitch: 0,
      debug: { rawF0Count: f0Trace.length, scores: {} },
    };
  }

  // Сглаживание
  const smoothed = smoothTrace(f0Trace, 3);
  const normalized = normalizeF0Trace(smoothed);
  const resampled = resampleTrace(normalized, 7);
  const avgPitch = f0Trace.reduce((a, b) => a + b, 0) / f0Trace.length;

  // Считаем расстояние до каждого эталона
  const scores: Record<number, number> = {};
  let bestTone = 0;
  let bestScore = Infinity;

  for (const [toneStr, pattern] of Object.entries(TONE_PATTERNS)) {
    const tone = parseInt(toneStr);
    const score = computeDTW(resampled, pattern);
    scores[tone] = score;

    if (score < bestScore) {
      bestScore = score;
      bestTone = tone;
    }
  }

  // Дополнительная эвристика для почти плоских контуров
  const variance =
    resampled.reduce((sum, v) => sum + Math.pow(v - 0.5, 2), 0) / resampled.length;
  if (variance < 0.015 && bestTone !== 1) {
    // очень плоский — скорее 1-й тон
    if (scores[1] < bestScore * 1.3) {
      bestTone = 1;
      bestScore = scores[1];
    }
  }

  // Калибровка уверенности
  // Чем меньше bestScore, тем выше confidence
  let confidence = Math.max(0, Math.min(1, 1 - bestScore / 1.6));

  // Штраф, если второй лучший результат очень близко
  const sortedScores = Object.values(scores).sort((a, b) => a - b);
  if (sortedScores.length >= 2) {
    const margin = sortedScores[1] - sortedScores[0];
    if (margin < 0.12) {
      confidence *= 0.7; // неоднозначный результат
    }
  }

  // Если слишком мало точек F0 — снижаем уверенность
  if (f0Trace.length < 8) {
    confidence *= 0.75;
  }

  return {
    detectedTone: bestTone,
    confidence: Math.round(confidence * 100) / 100,
    f0Trace: resampled,
    averagePitch: avgPitch,
    debug: {
      rawF0Count: f0Trace.length,
      scores,
    },
  };
}
