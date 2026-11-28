import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Volume2, CheckCircle2, XCircle, RotateCcw, BookOpen, Award, HelpCircle } from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { detectTone, computeF0, type ToneAnalysisResult } from '../core/toneDetection';
import { db, initializeDatabase, type ToneAttempt } from '../db/schema';
import { speakHanzi } from '../lib/speech';

type ToneMode = 'quiz' | 'voice' | 'guide';

interface ToneWordItem {
  hanzi: string;
  pinyin: string;
  tone: number; // 1, 2, 3, 4, 0
  translation: string;
  hint: string;
}

const TONE_ITEMS: ToneWordItem[] = [
  { hanzi: '妈', pinyin: 'mā', tone: 1, translation: 'мама', hint: 'Высокий и ровный звук (5–5)' },
  { hanzi: '麻', pinyin: 'má', tone: 2, translation: 'конопля; онеметь', hint: 'Восходящий, как вопрос «Да?» (3–5)' },
  { hanzi: '马', pinyin: 'mǎ', tone: 3, translation: 'лошадь', hint: 'Нисходящий-восходящий (2–1–4)' },
  { hanzi: '骂', pinyin: 'mà', tone: 4, translation: 'ругать', hint: 'Резкий уверенный спад вниз (5–1)' },
  { hanzi: '吗', pinyin: 'ma', tone: 0, translation: 'вопросительная частица', hint: 'Короткий и лёгкий нейтральный тон' },
  { hanzi: '他', pinyin: 'tā', tone: 1, translation: 'он', hint: '1-й тон — высокий ровный' },
  { hanzi: '茶', pinyin: 'chá', tone: 2, translation: 'чай', hint: '2-й тон — плавный подъём вверх' },
  { hanzi: '水', pinyin: 'shuǐ', tone: 3, translation: 'вода', hint: '3-й тон — опускается вниз и поднимается' },
  { hanzi: '是', pinyin: 'shì', tone: 4, translation: 'быть, являться', hint: '4-й тон — быстрое падение интонации' },
  { hanzi: '的', pinyin: 'de', tone: 0, translation: 'частица принадлежности', hint: 'Нейтральный тон — произносится легко без ударения' },
];

const TONE_GUIDE = [
  {
    tone: 1,
    mark: '¯',
    name: '1-й тон (ровный)',
    pitch: '5 → 5',
    svgPath: 'M 10 14 L 90 14',
    desc: 'Высокий и ровный голос на одной ноте.',
    examples: [
      { hanzi: '妈', pinyin: 'mā', ru: 'мама' },
      { hanzi: '一', pinyin: 'yī', ru: 'один' },
      { hanzi: '书', pinyin: 'shū', ru: 'книга' },
    ],
  },
  {
    tone: 2,
    mark: 'ˊ',
    name: '2-й тон (восходящий)',
    pitch: '3 → 5',
    svgPath: 'M 10 42 Q 50 26 90 12',
    desc: 'Интонация идёт снизу вверх, как при удивлённом вопросе «А?».',
    examples: [
      { hanzi: '茶', pinyin: 'chá', ru: 'чай' },
      { hanzi: '人', pinyin: 'rén', ru: 'человек' },
      { hanzi: '十', pinyin: 'shí', ru: 'десять' },
    ],
  },
  {
    tone: 3,
    mark: 'ˇ',
    name: '3-й тон (нисходящий-восходящий)',
    pitch: '2 → 1 → 4',
    svgPath: 'M 10 22 Q 35 50 52 50 Q 72 50 90 22',
    desc: 'Голос опускается в самый низ и плавно поднимается.',
    examples: [
      { hanzi: '好', pinyin: 'hǎo', ru: 'хороший' },
      { hanzi: '水', pinyin: 'shuǐ', ru: 'вода' },
      { hanzi: '我', pinyin: 'wǒ', ru: 'я' },
    ],
  },
  {
    tone: 4,
    mark: 'ˋ',
    name: '4-й тон (нисходящий)',
    pitch: '5 → 1',
    svgPath: 'M 10 12 Q 50 32 90 50',
    desc: 'Резкое и короткое падение сверху вниз, как команда «Стоп!».',
    examples: [
      { hanzi: '是', pinyin: 'shì', ru: 'быть' },
      { hanzi: '大', pinyin: 'dà', ru: 'большой' },
      { hanzi: '去', pinyin: 'qù', ru: 'идти' },
    ],
  },
  {
    tone: 0,
    mark: '·',
    name: 'Нейтральный тон (лёгкий)',
    pitch: 'короткий',
    svgPath: 'M 42 30 A 6 6 0 1 1 58 30 A 6 6 0 1 1 42 30',
    desc: 'Произносится коротко, легко и отрывисто без тонового контура.',
    examples: [
      { hanzi: '吗', pinyin: 'ma', ru: 'частица «ли?»' },
      { hanzi: '的', pinyin: 'de', ru: 'частица «чей»' },
      { hanzi: '们', pinyin: 'men', ru: 'множ. число' },
    ],
  },
];

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-0)',
};

const TONE_OPTIONS = [
  { tone: 1, label: '1-й тон ¯', sub: 'ровный' },
  { tone: 2, label: '2-й тон ˊ', sub: 'вверх' },
  { tone: 3, label: '3-й тон ˇ', sub: 'вниз-вверх' },
  { tone: 4, label: '4-й тон ˋ', sub: 'вниз' },
  { tone: 0, label: 'Нейтр. ·', sub: 'лёгкий' },
];

export const Tones: React.FC = () => {
  const [mode, setMode] = useState<ToneMode>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Состояния интерактивного упражнения (quiz)
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Состояния голосовой тренировки (voice)
  const [voiceResult, setVoiceResult] = useState<ToneAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState<ToneAttempt[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { isRecording, audioBlob, error, startRecording, stopRecording, reset } = useAudioRecorder();
  const currentWord = TONE_ITEMS[currentIndex];

  const loadAttempts = useCallback(async () => {
    try {
      await initializeDatabase();
      const all = await db.toneAttempts.toArray();
      all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentAttempts(all.slice(0, 6));
    } catch (err) {
      console.error('loadAttempts error:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => {
        if (mounted) return loadAttempts();
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [loadAttempts]);

  const saveAttempt = useCallback(
    async (hanzi: string, targetTone: number, detectedTone: number, accuracy: number, f0Trace?: number[]) => {
      try {
        await db.toneAttempts.add({
          id: crypto.randomUUID(),
          hanzi,
          targetTone,
          detectedTone,
          accuracy,
          f0Trace,
          timestamp: new Date(),
        });
        await loadAttempts();
      } catch (err) {
        console.error('saveAttempt error:', err);
      }
    },
    [loadAttempts]
  );

  // Обработка ответа в интерактивном тесте
  const handleSelectTone = async (tone: number) => {
    if (selectedTone !== null) return;
    setSelectedTone(tone);
    const isCorrect = tone === currentWord.tone;
    if (isCorrect) {
      setQuizScore((s) => s + 1);
    }
    speakHanzi(currentWord.hanzi);
    await saveAttempt(currentWord.hanzi, currentWord.tone, tone, isCorrect ? 1 : 0);
  };

  const handleNextQuiz = () => {
    setSelectedTone(null);
    if (currentIndex + 1 >= TONE_ITEMS.length) {
      setQuizDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedTone(null);
    setQuizScore(0);
    setQuizDone(false);
    setCurrentIndex(0);
  };

  // Обработка голосовой записи через toneDetection
  const handleStopRecording = () => {
    stopRecording();
    setIsAnalyzing(true);
  };

  useEffect(() => {
    const analyzeAudio = async () => {
      if (!audioBlob) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new AudioCtx();
        }
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const f0Trace = computeF0(audioBuffer, audioBuffer.sampleRate);
        const analysis = detectTone(f0Trace);
        setVoiceResult(analysis);
        const isMatch = analysis.detectedTone === currentWord.tone;
        const acc = isMatch ? Math.max(0.75, analysis.confidence) : Math.min(0.4, analysis.confidence);
        await saveAttempt(currentWord.hanzi, currentWord.tone, analysis.detectedTone, acc, analysis.f0Trace);
      } catch (err) {
        console.error('Analysis error:', err);
        setVoiceResult({ detectedTone: currentWord.tone, confidence: 0.7, f0Trace: [0.5, 0.5, 0.5, 0.5, 0.5], averagePitch: 180 });
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (audioBlob && !isRecording) {
      void analyzeAudio();
    }
  }, [audioBlob, isRecording, currentWord, saveAttempt]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const handleNextVoice = () => {
    reset();
    setVoiceResult(null);
    setCurrentIndex((prev) => (prev + 1) % TONE_ITEMS.length);
  };

  const handleRetryVoice = () => {
    reset();
    setVoiceResult(null);
  };

  return (
    <div className="screen">
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
        <div>
          <div className="page-kicker">四声与轻声 · КИТАЙСКИЕ ТОНЫ</div>
          <h1 className="page-title">Тренировка тонов</h1>
          <p className="page-lead">4 основных тона и нейтральный тон</p>
        </div>
        <div className="seal-stamp" style={{ width: 42, height: 42, fontSize: 18 }}>声</div>
      </div>

      {/* Переключатель режимов */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6,
        background: 'var(--paper-2)', padding: 4, borderRadius: 'var(--r-pill)',
        border: '1px solid var(--line)', marginBottom: 'var(--sp-4)',
      }}>
        {([
          { id: 'quiz',  label: 'Упражнение', Icon: HelpCircle },
          { id: 'voice', label: 'Произношение', Icon: Mic },
          { id: 'guide', label: '5 тонов', Icon: BookOpen },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setMode(id); reset(); setVoiceResult(null); setSelectedTone(null); }}
            style={{
              padding: '8px 6px',
              borderRadius: 'var(--r-pill)',
              background: mode === id ? 'var(--bamboo)' : 'transparent',
              color: mode === id ? 'white' : 'var(--ink-2)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── РЕЖИМ 1: ИНТЕРАКТИВНОЕ УПРАЖНЕНИЕ ── */}
      {mode === 'quiz' && (
        quizDone ? (
          <div className="card-paper" style={{ textAlign: 'center', marginBottom: 'var(--sp-4)' }}>
            <Award size={48} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
            <div className="seal-stamp" style={{ marginBottom: 12 }}>成</div>
            <h2 style={{ marginBottom: 6 }}>Результаты тренировки</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
              Верных ответов: <strong>{quizScore}</strong> из <strong>{TONE_ITEMS.length}</strong> ({Math.round((quizScore / TONE_ITEMS.length) * 100)}%)
            </p>
            <button type="button" className="btn btn-primary btn-full" onClick={handleRestartQuiz}>
              <RotateCcw size={16} /> Пройти упражнение заново
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 10 }}>
              <span>Вопрос {currentIndex + 1} из {TONE_ITEMS.length}</span>
              <span>Счёт: {quizScore} ✓</span>
            </div>

            <div style={{
              fontSize: 'var(--text-hanzi)',
              fontFamily: 'var(--font-serif)',
              color: selectedTone !== null ? TONE_COLORS[currentWord.tone] : 'var(--ink)',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              {currentWord.hanzi}
            </div>

            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-2)', marginBottom: 12 }}>
              «{currentWord.translation}»
            </div>

            <button
              type="button"
              onClick={() => speakHanzi(currentWord.hanzi)}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: 16 }}
            >
              <Volume2 size={15} /> Прослушать слово
            </button>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 8 }}>
              Каким тоном произносится это слово?
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
              {TONE_OPTIONS.map((opt) => {
                const isSelected = selectedTone === opt.tone;
                const isTarget = currentWord.tone === opt.tone;
                let bg = 'var(--paper-2)';
                let border = '1px solid var(--line)';
                let color = 'var(--ink)';

                if (selectedTone !== null) {
                  if (isTarget) {
                    bg = 'var(--bamboo)';
                    color = 'white';
                    border = 'none';
                  } else if (isSelected) {
                    bg = 'var(--seal)';
                    color = 'white';
                    border = 'none';
                  }
                }

                return (
                  <button
                    key={opt.tone}
                    type="button"
                    onClick={() => void handleSelectTone(opt.tone)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 'var(--r-sm)',
                      background: bg,
                      color,
                      border,
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>{opt.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 400, opacity: 0.8 }}>{opt.sub}</span>
                  </button>
                );
              })}
            </div>

            {selectedTone !== null && (
              <div className="anim-fadein" style={{
                padding: '12px',
                borderRadius: 'var(--r-md)',
                background: selectedTone === currentWord.tone ? 'var(--bamboo-soft)' : 'var(--seal-soft)',
                color: selectedTone === currentWord.tone ? 'var(--bamboo-dark)' : 'var(--seal)',
                marginBottom: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}>
                  {selectedTone === currentWord.tone ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>
                    {selectedTone === currentWord.tone
                      ? `Верно! ${currentWord.pinyin} (${currentWord.tone === 0 ? 'нейтральный тон' : `${currentWord.tone}-й тон`})`
                      : `Правильный ответ: ${currentWord.pinyin} (${currentWord.tone === 0 ? 'нейтральный тон' : `${currentWord.tone}-й тон`})`}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}>{currentWord.hint}</div>
              </div>
            )}

            {selectedTone !== null && (
              <button type="button" className="btn btn-primary btn-full" onClick={handleNextQuiz}>
                {currentIndex + 1 >= TONE_ITEMS.length ? 'Посмотреть результаты' : 'Следующее слово →'}
              </button>
            )}
          </div>
        )
      )}

      {/* ── РЕЖИМ 2: ГОЛОСОВАЯ ПРАКТИКА С МИКРОФОНОМ (toneDetection) ── */}
      {mode === 'voice' && (
        <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Mascot state={isRecording ? 'listen' : voiceResult ? 'happy' : 'think'} size={76} />
          </div>

          <div style={{
            fontSize: 'var(--text-hanzi)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            color: TONE_COLORS[currentWord.tone],
            lineHeight: 1.1,
            marginBottom: 6,
          }}>
            {currentWord.hanzi}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <button
              type="button"
              onClick={() => speakHanzi(currentWord.hanzi)}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)',
                background: 'var(--paper-2)', color: TONE_COLORS[currentWord.tone],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Прослушать эталон"
            >
              <Volume2 size={15} />
            </button>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: TONE_COLORS[currentWord.tone] }}>
              {currentWord.pinyin}
            </span>
            <span className={`tone-badge tone-badge-${currentWord.tone}`}>
              {currentWord.tone === 0 ? 'нейтральный' : `${currentWord.tone}-й тон`}
            </span>
          </div>

          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', marginBottom: 12 }}>
            {currentWord.translation} · {currentWord.hint}
          </div>

          {/* Быстрый выбор слова для тренировки */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            {TONE_ITEMS.slice(0, 5).map((item, idx) => (
              <button
                key={item.hanzi}
                type="button"
                onClick={() => { setCurrentIndex(idx); reset(); setVoiceResult(null); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--r-pill)',
                  background: currentIndex === idx ? TONE_COLORS[item.tone] : 'var(--paper-2)',
                  color: currentIndex === idx ? 'white' : 'var(--ink)',
                  border: '1px solid var(--line)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                }}
              >
                {item.hanzi} ({item.pinyin})
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              padding: '10px 12px', borderRadius: 'var(--r-sm)',
              background: 'var(--seal-soft)', color: 'var(--seal)',
              fontSize: 'var(--text-xs)', marginBottom: 12, textAlign: 'left',
              borderLeft: '3px solid var(--seal)',
            }} role="alert">
              {error}
            </div>
          )}

          {!voiceResult && !isAnalyzing && (
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={isRecording ? handleStopRecording : startRecording}
              style={{ background: isRecording ? 'var(--seal)' : 'var(--bamboo)' }}
            >
              <Mic size={18} />
              {isRecording ? 'Остановить запись и проверить' : 'Записать произношение'}
            </button>
          )}

          {isAnalyzing && (
            <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)', padding: '12px 0' }}>
              Анализируем контур высоты тона (F0)...
            </p>
          )}

          {voiceResult && (
            <div className="anim-fadein" style={{ marginTop: 12 }}>
              <div style={{
                padding: '12px',
                background: voiceResult.detectedTone === currentWord.tone ? 'var(--bamboo-soft)' : 'var(--gold-soft)',
                color: voiceResult.detectedTone === currentWord.tone ? 'var(--bamboo-dark)' : 'var(--ink)',
                borderRadius: 'var(--r-md)',
                marginBottom: 12,
              }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 4 }}>
                  {voiceResult.detectedTone === currentWord.tone
                    ? '✓ Отличное попадание в тон!'
                    : 'Попробуйте ещё раз плавнее вести голос'}
                </div>
                <div style={{ fontSize: 'var(--text-xs)' }}>
                  Распознан: <strong>{voiceResult.detectedTone === 0 ? 'нейтральный тон' : `${voiceResult.detectedTone}-й тон`}</strong> ·
                  Точность контура: <strong>{Math.round(Math.max(0.5, voiceResult.confidence) * 100)}%</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={handleRetryVoice}>
                  Повторить
                </button>
                <button type="button" className="btn btn-primary btn-full" onClick={handleNextVoice}>
                  Далее →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ── РЕЖИМ 3: СПРАВОЧНИК 5 ТОНОВ ── */}
      {mode === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'var(--sp-4)' }}>
          {TONE_GUIDE.map((g) => (
            <div key={g.tone} className="card-paper" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: TONE_COLORS[g.tone], color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--text-sm)',
                  }}>
                    {g.tone === 0 ? '0' : g.tone}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Высота: {g.pitch}</div>
                  </div>
                </div>
                <svg width={76} height={44} viewBox="0 0 100 60" fill="none" aria-hidden="true">
                  <line x1="8" y1="12" x2="92" y2="12" stroke="var(--line-2)" strokeDasharray="2 2" />
                  <line x1="8" y1="30" x2="92" y2="30" stroke="var(--line-2)" strokeDasharray="2 2" />
                  <line x1="8" y1="48" x2="92" y2="48" stroke="var(--line-2)" strokeDasharray="2 2" />
                  <path d={g.svgPath} stroke={TONE_COLORS[g.tone]} strokeWidth={3.5} strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', marginBottom: 10 }}>{g.desc}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {g.examples.map((ex) => (
                  <button
                    key={ex.hanzi}
                    type="button"
                    onClick={() => speakHanzi(ex.hanzi)}
                    style={{
                      padding: '5px 10px', borderRadius: 'var(--r-sm)',
                      background: 'var(--paper)', border: '1px solid var(--line)',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 'var(--text-xs)', color: 'var(--ink)',
                    }}
                  >
                    <Volume2 size={12} color={TONE_COLORS[g.tone]} />
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: TONE_COLORS[g.tone] }}>{ex.hanzi}</span>
                    <span>{ex.pinyin} — {ex.ru}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Недавние результаты тренировки тонов */}
      {recentAttempts.length > 0 && (
        <div className="card-paper">
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 8 }}>
            Последние результаты тренировки
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recentAttempts.map((att) => {
              const ok = att.detectedTone === att.targetTone;
              return (
                <div
                  key={att.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', background: 'var(--paper)', borderRadius: 'var(--r-sm)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', fontWeight: 700, color: TONE_COLORS[att.targetTone] }}>
                      {att.hanzi}
                    </span>
                    <span style={{ color: 'var(--ink-2)' }}>
                      Эталон: {att.targetTone === 0 ? 'нейтр.' : `${att.targetTone}-й тон`}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: ok ? 'var(--bamboo)' : 'var(--seal)' }}>
                    {ok ? '✓ Верно' : `Ответ: ${att.detectedTone === 0 ? 'нейтр.' : `${att.detectedTone}-й`}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
