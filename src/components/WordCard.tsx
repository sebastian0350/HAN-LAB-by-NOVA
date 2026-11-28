import React, { useState } from 'react';
import { Volume2, Heart, ChevronRight, Lightbulb, RotateCcw } from 'lucide-react';
import { speakHanzi } from '../lib/speech';
import type { SessionCard } from '../hooks/useCards';
import type { ReviewRating } from '../core/fsrs';

interface WordCardProps {
  card: SessionCard;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAnswer: (rating: ReviewRating) => void;
}

const TONE_LABELS: Record<number, string> = {
  1: '¯ 1-й тон (ровный)',
  2: 'ˊ 2-й тон (восходящий)',
  3: 'ˇ 3-й тон (нисходящий-восходящий)',
  4: 'ˋ 4-й тон (нисходящий)',
  0: '· нейтральный тон',
};

const TONE_SVG: Record<number, string> = {
  1: 'M 12 24 L 88 24',
  2: 'M 12 46 Q 50 24 88 12',
  3: 'M 12 18 Q 34 48 52 50 Q 70 50 88 20',
  4: 'M 12 12 Q 52 30 88 50',
  0: 'M 38 30 A 5 5 0 1 1 62 30 A 5 5 0 1 1 38 30',
};

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-0)',
};

const STATUS_META = {
  new:      { label: 'Новое слово', color: 'var(--gold)', bg: 'var(--gold-soft)' },
  learning: { label: 'Изучается',   color: 'var(--tone-1)', bg: 'var(--tone-1-soft)' },
  mastered: { label: 'Изучено',     color: 'var(--bamboo)', bg: 'var(--bamboo-soft)' },
} as const;

function ToneArc({ tones }: { tones: number[] }) {
  const mainTone = tones.find((t) => t > 0) ?? tones[0] ?? 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
      <svg width={90} height={52} viewBox="0 0 100 60" fill="none" aria-hidden="true">
        <line x1="8" y1="12" x2="92" y2="12" stroke="var(--line-2)" strokeDasharray="3 3" />
        <line x1="8" y1="30" x2="92" y2="30" stroke="var(--line-2)" strokeDasharray="3 3" />
        <line x1="8" y1="48" x2="92" y2="48" stroke="var(--line-2)" strokeDasharray="3 3" />
        <path
          d={TONE_SVG[mainTone] ?? TONE_SVG[0]}
          stroke={TONE_COLORS[mainTone]}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
        <span className={`tone-badge tone-badge-${mainTone}`}>{TONE_LABELS[mainTone]}</span>
        {tones.length > 1 && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)', paddingLeft: 4 }}>
            Тоны по слогам: {tones.map((t) => (t === 0 ? 'нейтр.' : `${t}-й`)).join(' + ')}
          </span>
        )}
      </div>
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

  const mainTone = card.tones.find((t) => t > 0) ?? card.tones[0] ?? 0;
  const statusInfo = STATUS_META[card.status];

  return (
    <div className="flashcard-scene anim-fadein">
      <div className={`flashcard-inner${flipped ? ' flipped' : ''}`}>

        {/* ── ЛИЦЕВАЯ СТОРОНА ── */}
        <div className="flashcard-face" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div>
            {/* Шапка */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 0' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="hsk-badge">HSK {card.hsk}</span>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: statusInfo.color,
                  background: statusInfo.bg,
                  padding: '2px 9px',
                  borderRadius: 'var(--r-pill)',
                }}>
                  {statusInfo.label}
                </span>
              </div>
              <button
                type="button"
                className={`fav-btn${isFavorite ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Иероглиф */}
            <div
              style={{ textAlign: 'center', padding: '22px 20px 10px', cursor: 'pointer' }}
              onClick={() => setFlipped(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped(true); }}
              aria-label="Показать перевод"
            >
              <div style={{
                fontSize: 'var(--text-hanzi)',
                fontFamily: 'var(--font-serif)',
                lineHeight: 1.1,
                color: TONE_COLORS[mainTone],
                marginBottom: 10,
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))',
              }}>
                {card.hanzi}
              </div>

              {/* Пиньинь с кнопкой озвучки */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); speakHanzi(card.hanzi); }}
                  style={{
                    background: 'var(--paper-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '50%',
                    width: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: TONE_COLORS[mainTone], cursor: 'pointer',
                  }}
                  aria-label="Произнести слово"
                >
                  <Volume2 size={16} />
                </button>
                <span style={{
                  fontSize: 'var(--text-xl)',
                  color: TONE_COLORS[mainTone],
                  fontWeight: 600,
                }}>{card.pinyin}</span>
              </div>
            </div>

            {/* Визуализация тона */}
            <div style={{ padding: '4px 20px 12px' }}>
              <ToneArc tones={card.tones} />
            </div>

            {/* Мнемоника / подсказка */}
            {(card.mnemonic || card.radical) && (
              <div style={{ padding: '0 20px 12px' }}>
                <button
                  type="button"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: showMnemonic ? 'var(--gold-soft)' : 'transparent',
                    border: '1px solid rgba(184,134,58,0.28)',
                    borderRadius: 'var(--r-sm)',
                    padding: '8px 12px',
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'var(--gold)', fontSize: 'var(--text-xs)', cursor: 'pointer',
                  }}
                >
                  <Lightbulb size={14} style={{ flexShrink: 0 }} />
                  <span>
                    {showMnemonic
                      ? `${card.radical ? `Ключ: ${card.radical}. ` : ''}${card.mnemonic ?? ''}`
                      : 'Показать подсказку и разбор'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Нажми чтобы перевернуть */}
          <button
            type="button"
            style={{
              margin: '4px 20px 20px',
              padding: '13px',
              background: 'var(--bamboo)',
              borderRadius: 'var(--r-md)',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(61,107,72,0.25)',
            }}
            onClick={() => setFlipped(true)}
          >
            Показать ответ <ChevronRight size={16} />
          </button>
        </div>

        {/* ── ОБОРОТНАЯ СТОРОНА ── */}
        <div className="flashcard-face flashcard-back" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div>
            <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="hsk-badge">HSK {card.hsk}</span>
                <button
                  type="button"
                  onClick={() => setFlipped(false)}
                  style={{
                    background: 'var(--paper-2)', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-pill)', padding: '3px 10px',
                    fontSize: 'var(--text-xs)', color: 'var(--ink-2)',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <RotateCcw size={11} /> На лицевую
                </button>
              </div>
              <button
                type="button"
                className={`fav-btn${isFavorite ? ' active' : ''}`}
                onClick={onToggleFavorite}
                aria-label="Избранное"
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Иероглиф + пиньинь + перевод */}
            <div style={{ textAlign: 'center', padding: '12px 20px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{
                  fontSize: 'var(--text-hanzi-sm)',
                  fontFamily: 'var(--font-serif)',
                  color: TONE_COLORS[mainTone],
                  lineHeight: 1.05,
                }}>{card.hanzi}</div>
                <button
                  type="button"
                  onClick={() => speakHanzi(card.hanzi)}
                  style={{
                    background: 'var(--paper-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '50%',
                    width: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: TONE_COLORS[mainTone], cursor: 'pointer',
                  }}
                  aria-label="Произнести слово"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: TONE_COLORS[mainTone], fontWeight: 600, marginBottom: 6 }}>
                {card.pinyin}
              </div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: 'var(--ink)',
                fontFamily: 'var(--font-serif)',
                marginBottom: 8,
              }}>{card.translation}</div>
            </div>

            {/* Пример предложения */}
            {card.example && (
              <div style={{
                margin: '0 20px 12px',
                padding: '10px 14px',
                background: 'var(--paper-2)',
                borderRadius: 'var(--r-md)',
                borderLeft: '3px solid var(--bamboo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: 2 }}>
                    {card.example}
                  </div>
                  {card.examplePinyin && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 2 }}>{card.examplePinyin}</div>
                  )}
                  {card.exampleRu && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', fontStyle: 'italic' }}>{card.exampleRu}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => speakHanzi(card.example!)}
                  style={{
                    background: 'var(--paper-3)', border: 'none', borderRadius: '50%',
                    width: 30, height: 30, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--bamboo)', cursor: 'pointer',
                  }}
                  aria-label="Озвучить пример"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Кнопки оценки ответа FSRS */}
          <div style={{ padding: '4px 16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginBottom: 6 }}>
              Оцените ответ (интервал FSRS):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {([
                { r: 'again', label: 'Забыл',  color: 'var(--seal)',   bg: 'var(--seal-soft)' },
                { r: 'hard',  label: 'Трудно', color: 'var(--ink-2)',  bg: 'var(--paper-3)' },
                { r: 'good',  label: 'Хорошо', color: 'var(--bamboo)', bg: 'var(--bamboo-soft)' },
                { r: 'easy',  label: 'Легко',  color: 'var(--gold)',   bg: 'var(--gold-soft)' },
              ] as const).map(({ r, label, color, bg }) => {
                const days = card.intervals?.[r] ?? 1;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onAnswer(r)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 'var(--r-sm)',
                      background: bg,
                      color,
                      border: `1.5px solid ${color}35`,
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>
                      {days} дн.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
