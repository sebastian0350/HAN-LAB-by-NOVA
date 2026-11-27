import React, { useState, useEffect } from 'react';
import { Volume2, Heart, ChevronRight, Lightbulb } from 'lucide-react';
import { speakHanzi } from '../lib/speech';
import type { SessionCard } from '../hooks/useCards';

interface WordCardProps {
  card: SessionCard;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAnswer: (rating: 'again' | 'hard' | 'good' | 'easy') => void;
  startTime?: number;
}

const TONE_LABELS: Record<number, string> = {
  1: '¯ 1-й тон (ровный)',
  2: 'ˊ 2-й тон (восходящий)',
  3: 'ˇ 3-й тон (ломаный)',
  4: 'ˋ 4-й тон (нисходящий)',
  0: '· нейтральный',
};

const TONE_SVG: Record<number, string> = {
  1: 'M 10 30 L 90 30',                   // го��изонталь
  2: 'M 10 50 Q 50 20 90 10',             // вверх
  3: 'M 10 20 Q 30 50 50 55 Q 70 60 90 25', // вниз-вверх
  4: 'M 10 10 Q 50 30 90 55',             // вниз
  0: 'M 40 35 Q 50 30 60 35',             // маленький
};

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-0)',
};

function ToneArc({ tones }: { tones: number[] }) {
  // Показываем контур тона главного слога
  const mainTone = tones.find(t => t > 0) ?? tones[0] ?? 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <svg width={100} height={60} viewBox="0 0 100 60" fill="none" aria-hidden="true">
        <path
          d={TONE_SVG[mainTone]}
          stroke={TONE_COLORS[mainTone]}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={`tone-badge tone-badge-${mainTone}`}>{TONE_LABELS[mainTone]}</span>
    </div>
  );
}

export const WordCard: React.FC<WordCardProps> = ({
  card,
  isFavorite,
  onToggleFavorite,
  onAnswer,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  // Сброс при смене карточки
  useEffect(() => {
    setFlipped(false);
    setShowMnemonic(false);
  }, [card.wordId]);

  const mainTone = card.tones.find(t => t > 0) ?? card.tones[0] ?? 0;

  return (
    <div className="flashcard-scene anim-fadein">
      <div className={`flashcard-inner${flipped ? ' flipped' : ''}`}>

        {/* ── ЛИЦЕВАЯ СТОРОНА ── */}
        <div className="flashcard-face" style={{ background: 'white', boxShadow: 'var(--shadow-card)' }}>
          {/* Шапка */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 0' }}>
            <span className="hsk-badge">HSK {card.hsk}</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {card.isNew && (
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--gold)',
                  background: 'var(--gold-soft)', padding: '2px 8px', borderRadius: 'var(--r-pill)',
                  border: '1px solid rgba(184,134,58,0.3)',
                }}>Новое</span>
              )}
              <button
                className={`fav-btn${isFavorite ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Иероглиф */}
          <div
            style={{ textAlign: 'center', padding: '24px 20px 12px', cursor: 'pointer' }}
            onClick={() => setFlipped(true)}
            role="button"
            aria-label="Показать перевод"
          >
            <div style={{
              fontSize: 'var(--text-hanzi)',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1,
              color: TONE_COLORS[mainTone],
              marginBottom: 12,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))',
            }}>
              {card.hanzi}
            </div>

            {/* Пиньинь с кнопкой озвучки */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); speakHanzi(card.hanzi); }}
                style={{
                  background: TONE_COLORS[mainTone] + '18',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: TONE_COLORS[mainTone], cursor: 'pointer',
                }}
                aria-label="Произнести"
              >
                <Volume2 size={15} />
              </button>
              <span style={{
                fontSize: 'var(--text-xl)',
                color: TONE_COLORS[mainTone],
                fontWeight: 500,
              }}>{card.pinyin}</span>
            </div>
          </div>

          {/* Визуализация тона */}
          <div style={{ padding: '0 20px 12px' }}>
            <ToneArc tones={card.tones} />
          </div>

          {/* Мнемоника */}
          {card.mnemonic && (
            <div style={{ padding: '0 20px 12px' }}>
              <button
                onClick={() => setShowMnemonic(!showMnemonic)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: showMnemonic ? 'var(--gold-soft)' : 'transparent',
                  border: '1px solid rgba(184,134,58,0.25)',
                  borderRadius: 'var(--r-sm)',
                  padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--gold)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                }}
              >
                <Lightbulb size={14} />
                {showMnemonic ? card.mnemonic : 'Показать подсказку'}
              </button>
            </div>
          )}

          {/* Нажми чтобы перевернуть */}
          <div
            style={{
              margin: '0 20px 20px',
              padding: '12px',
              background: 'var(--bamboo-soft)',
              borderRadius: 'var(--r-md)',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'var(--bamboo)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
            onClick={() => setFlipped(true)}
            role="button"
          >
            Показать перевод <ChevronRight size={15} />
          </div>
        </div>

        {/* ── ОБОРОТНАЯ СТОРОНА ── */}
        <div className="flashcard-face flashcard-back" style={{ background: 'white', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span className="hsk-badge">HSK {card.hsk}</span>
            <button
              className={`fav-btn${isFavorite ? ' active' : ''}`}
              onClick={onToggleFavorite}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Иероглиф (маленький) + перевод */}
          <div style={{ textAlign: 'center', padding: '16px 20px 8px' }}>
            <div style={{
              fontSize: 'var(--text-hanzi-sm)',
              fontFamily: 'var(--font-serif)',
              color: TONE_COLORS[mainTone],
              lineHeight: 1,
              marginBottom: 4,
            }}>{card.hanzi}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: TONE_COLORS[mainTone], marginBottom: 8 }}>{card.pinyin}</div>
            <div style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--ink)',
              fontFamily: 'var(--font-serif)',
              marginBottom: 12,
            }}>{card.translation}</div>
          </div>

          {/* Пример предложения */}
          {card.example && (
            <div style={{
              margin: '0 20px 12px',
              padding: '12px 14px',
              background: 'var(--paper-2)',
              borderRadius: 'var(--r-md)',
              borderLeft: '3px solid var(--bamboo)',
            }}>
              <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: 2 }}>
                {card.example}
              </div>
              {card.examplePinyin && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 2 }}>{card.examplePinyin}</div>
              )}
              {card.exampleRu && (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontStyle: 'italic' }}>{card.exampleRu}</div>
              )}
            </div>
          )}

          {/* Кнопки оценки */}
          <div style={{ padding: '0 16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            {([
              { r: 'again', label: 'Забыл', color: 'var(--seal)', bg: 'var(--seal-soft)' },
              { r: 'hard',  label: 'Сложно', color: 'var(--ink-2)', bg: 'var(--paper-3)' },
              { r: 'good',  label: 'Хорошо', color: 'var(--bamboo)', bg: 'var(--bamboo-soft)' },
              { r: 'easy',  label: 'Легко', color: 'var(--gold)', bg: 'var(--gold-soft)' },
            ] as const).map(({ r, label, color, bg }) => (
              <button
                key={r}
                onClick={() => onAnswer(r)}
                style={{
                  padding: '10px 4px',
                  borderRadius: 'var(--r-sm)',
                  background: bg,
                  color,
                  border: `1.5px solid ${color}30`,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform var(--t-fast)',
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
                onMouseUp={(e)   => { (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
