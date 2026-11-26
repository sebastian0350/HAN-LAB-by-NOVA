// Алгоритм определения тонов китайского языка через анализ F0 (fundamental frequency)
// Базовая реализация без внешних сервисов распознавания речи

export interface ToneAnalysisResult {
  detectedTone: number;
  confidence: number;
  f0Trace: number[]; // контур тона (нормализованные значения)
  averagePitch: number;
}

// Эталонные контуры тонов (нормализованные: 0 = низкий, 1 = высокий)
const TONE_PATTERNS: Record<number, number[]> = {
  1: [0.8, 0.85, 0.9, 0.9, 0.9], // высокий ровный
  2: [0.3, 0.5, 0.7, 0.85, 0.9], // восходящий
  3: [0.5, 0.3, 0.2, 0.3, 0.4], // низкий с падением и подъёмом
  4: [0.9, 0.7, 0.4, 0.2, 0.1], // резкий нисходящий
  0: [0.5, 0.5, 0.5, 0.5, 0.5], // нейтральный
};

/**
 * Вычисляет F0 (fundamental frequency) из аудио буфера
 * Использует автокорреляцию
 */
export function computeF0(audioBuffer: AudioBuffer, sampleRate: number): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const f0Trace: number[] = [];
  
  const windowSize = 2048; // размер окна для анализа
  const hopSize = 512; // шаг между окнами
  
  for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
    const window = channelData.slice(i, i + windowSize);
    const f0 = autocorrelate(window, sampleRate);
    if (f0 > 50 && f0 < 500) { // фильтр разумных частот для голоса
      f0Trace.push(f0);
    }
  }
  
  return f0Trace;
}

/**
 * Автокорреляция для определения основной частоты
 */
function autocorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;
  
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  
  if (rms < 0.01) return -1; // слишком тихо
  
  let r1 = 0, r2 = SIZE - 1;
  const threshold = 0.2;
  
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) { r2 = SIZE - i; break; }
  }
  
  const buf = buffer.slice(r1, r2);
  const c = new Array(buf.length).fill(0);
  
  for (let i = 0; i < buf.length; i++) {
    for (let j = 0; j < buf.length - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }
  
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxVal = -1, maxPos = -1;
  
  for (let i = d; i < buf.length; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }
  
  return sampleRate / maxPos;
}

/**
 * Нормализует контур F0 к диапазону [0, 1]
 */
export function normalizeF0Trace(f0Trace: number[]): number[] {
  if (f0Trace.length === 0) return [];
  
  const min = Math.min(...f0Trace);
  const max = Math.max(...f0Trace);
  const range = max - min;
  
  if (range === 0) return f0Trace.map(() => 0.5);
  
  return f0Trace.map(f => (f - min) / range);
}

/**
 * Ресемплирует контур к фиксированной длине (5 точек)
 */
export function resampleTrace(trace: number[], targetLength: number = 5): number[] {
  if (trace.length === 0) return new Array(targetLength).fill(0.5);
  if (trace.length <= targetLength) {
    // Если короче, дополняем последним значением
    const result = [...trace];
    while (result.length < targetLength) {
      result.push(trace[trace.length - 1]);
    }
    return result;
  }
  
  // Если длиннее, усредняем сегменты
  const result: number[] = [];
  const segmentSize = trace.length / targetLength;
  
  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * segmentSize);
    const end = Math.floor((i + 1) * segmentSize);
    const segment = trace.slice(start, end);
    const avg = segment.reduce((a, b) => a + b, 0) / segment.length;
    result.push(avg);
  }
  
  return result;
}

/**
 * Сравнивает контур с эталонными паттернами тонов
 * Возвращает детерминированный тон и уверенность
 */
export function detectTone(f0Trace: number[]): ToneAnalysisResult {
  if (f0Trace.length === 0) {
    return { detectedTone: 0, confidence: 0, f0Trace: [], averagePitch: 0 };
  }
  
  const normalized = normalizeF0Trace(f0Trace);
  const resampled = resampleTrace(normalized, 5);
  const avgPitch = f0Trace.reduce((a, b) => a + b, 0) / f0Trace.length;
  
  // Сравниваем с каждым эталонным паттерном
  let bestTone = 0;
  let bestScore = Infinity;
  
  for (const [tone, pattern] of Object.entries(TONE_PATTERNS)) {
    const score = computeDTW(resampled, pattern);
    if (score < bestScore) {
      bestScore = score;
      bestTone = parseInt(tone);
    }
  }
  
  // Конвертируем расстояние в уверенность (0-1)
  const confidence = Math.max(0, 1 - bestScore / 2);
  
  return {
    detectedTone: bestTone,
    confidence,
    f0Trace: resampled,
    averagePitch: avgPitch,
  };
}

/**
 * Dynamic Time Warping (DTW) для сравнения последовательностей
 */
function computeDTW(seq1: number[], seq2: number[]): number {
  const n = seq1.length;
  const m = seq2.length;
  const dtw: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(Infinity));
  
  dtw[0][0] = 0;
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = Math.abs(seq1[i - 1] - seq2[j - 1]);
      dtw[i][j] = cost + Math.min(
        dtw[i - 1][j],     // вставка
        dtw[i][j - 1],     // удаление
        dtw[i - 1][j - 1]  // соответствие
      );
    }
  }
  
  return dtw[n][m] / Math.max(n, m);
}
