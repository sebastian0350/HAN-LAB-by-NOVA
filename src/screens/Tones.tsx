import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Mascot } from '../components/Mascot';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { detectTone, computeF0, ToneAnalysisResult } from '../core/toneDetection';
import { ru } from '../config/i18n';

const TONE_EXAMPLES = [
  { hanzi: '妈', pinyin: 'mā', tone: 1, translation: 'мама' },
  { hanzi: '麻', pinyin: 'má', tone: 2, translation: 'конопля' },
  { hanzi: '马', pinyin: 'mǎ', tone: 3, translation: 'лошадь' },
  { hanzi: '骂', pinyin: 'mà', tone: 4, translation: 'ругать' },
];

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-neutral)',
};

export const Tones: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<ToneAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const { isRecording, audioBlob, error, startRecording, stopRecording, reset } = useAudioRecorder();
  
  const currentWord = TONE_EXAMPLES[currentIndex];

  const handleStop = async () => {
    stopRecording();
    setIsAnalyzing(true);
  };

  useEffect(() => {
    const analyzeAudio = async () => {
      if (!audioBlob || !audioContextRef.current) return;

      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
        const f0Trace = computeF0(audioBuffer, audioBuffer.sampleRate);
        const analysis = detectTone(f0Trace);
        setResult(analysis);
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (audioBlob && !isRecording) {
      analyzeAudio();
    }
  }, [audioBlob, isRecording]);

  const handleNext = () => {
    reset();
    setResult(null);
    setCurrentIndex((prev) => (prev + 1) % TONE_EXAMPLES.length);
  };

  const handleRetry = () => {
    reset();
    setResult(null);
  };

  // Инициализируем AudioContext при первом рендере
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      <h1>{ru.nav.tones}</h1>
      
      <Card style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Mascot state={isRecording ? 'listen' : 'think'} size={80} />
        </div>
        
        <div
          style={{
            fontSize: 'var(--hanzi-size)',
            fontFamily: 'var(--font-hanzi-serif)',
            fontWeight: 'bold',
            marginBottom: 'var(--space-sm)',
            color: TONE_COLORS[currentWord.tone],
          }}
        >
          {currentWord.hanzi}
        </div>
        
        <div style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-xs)', color: TONE_COLORS[currentWord.tone] }}>
          {currentWord.pinyin}
        </div>
        
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-2)', marginBottom: 'var(--space-lg)' }}>
          {currentWord.translation}
        </div>

        {error && (
          <p style={{ color: 'var(--seal)', marginBottom: 'var(--space-md)' }}>
            {error}
          </p>
        )}

        {!result && !isAnalyzing && (
          <Button
            fullWidth
            onClick={isRecording ? handleStop : startRecording}
            style={{ backgroundColor: isRecording ? 'var(--seal)' : undefined }}
          >
            {isRecording ? ru.tones.stop : ru.tones.record}
          </Button>
        )}

        {isAnalyzing && (
          <p style={{ color: 'var(--ink-2)' }}>Анализ...</p>
        )}

        {result && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div
              style={{
                padding: 'var(--space-md)',
                backgroundColor: result.detectedTone === currentWord.tone ? 'var(--bamboo)' : 'var(--seal)',
                color: 'white',
                borderRadius: 'var(--radius-card)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
                {result.detectedTone === currentWord.tone ? 'Верно!' : 'Попробуйте ещё раз'}
              </p>
              <p style={{ fontSize: 'var(--text-sm)' }}>
                Определено: {result.detectedTone}-й тон (уверенность: {Math.round(result.confidence * 100)}%)
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button variant="secondary" fullWidth onClick={handleRetry}>
                Повторить
              </Button>
              <Button fullWidth onClick={handleNext}>
                Далее
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--text-lg)' }}>Справка по тонам</h3>
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {TONE_EXAMPLES.map((example) => (
            <div
              key={example.tone}
              style={{
                padding: 'var(--space-sm)',
                backgroundColor: 'var(--paper-2)',
                borderRadius: 'var(--radius-small)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: TONE_COLORS[example.tone],
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {example.tone}
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-hanzi-serif)' }}>
                  {example.hanzi}
                </span>
                <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--ink-2)' }}>
                  {example.pinyin} — {example.translation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
