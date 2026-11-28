import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { DICTIONARY, type DictWord } from '../data/dictionary';

// ── Типы игр ──────────────────────────────────────────────────────────────
type GameType = 'menu' | 'match' | 'toneSelect' | 'translate' | 'result';
type MatchItem = { id: string; text: string; type: 'hanzi' | 'ru'; matched: boolean; selected: boolean; pairId: string };

// ── Утилиты ──────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(hskMax: 1 | 2 | 3 | 4, count: number): DictWord[] {
  const pool = DICTIONARY.filter((w) => w.hsk <= hskMax);
  return shuffle(pool).slice(0, count);
}

// ── ИГРА 1: Сопоставление (ханзи ↔ перевод) ─────────────────────────────
const TONE_SYMBOLS: Record<number, string> = { 1: '— (1-й)', 2: '/ (2-й)', 3: '∨ (3-й)', 4: '\\ (4-й)', 0: '· (нейтр.)' };
const TONE_NAMES: Record<number, string> = { 1: 'Ровный', 2: 'Восходящий', 3: 'Падающий-восходящий', 4: 'Нисходящий', 0: 'Нейтральный' };
const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)', 2: 'var(--tone-2)', 3: 'var(--tone-3)', 4: 'var(--tone-4)', 0: 'var(--tone-0)',
};

interface MatchGameProps {
  words: DictWord[];
  onFinish: (score: number, total: number) => void;
}

const MatchGame: React.FC<MatchGameProps> = ({ words, onFinish }) => {
  const [items, setItems] = useState<MatchItem[]>(() => {
    const hanzi: MatchItem[] = words.map((w) => ({ id: `h-${w.id}`, text: w.hanzi, type: 'hanzi', matched: false, selected: false, pairId: w.id }));
    const ru: MatchItem[] = words.map((w) => ({ id: `r-${w.id}`, text: w.translation, type: 'ru', matched: false, selected: false, pairId: w.id }));
    return shuffle([...hanzi, ...ru]);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);

  const matchedCount = items.filter((i) => i.matched).length;
  const total = words.length;

  useEffect(() => {
    if (matchedCount === items.length && items.length > 0) {
      setTimeout(() => onFinish(score, total), 500);
    }
  }, [matchedCount, items.length, score, total, onFinish]);

  const handleSelect = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.matched) return;

    if (!selected) {
      setSelected(id);
      return;
    }

    if (selected === id) {
      setSelected(null);
      return;
    }

    const sel = items.find((i) => i.id === selected);
    if (!sel) return;

    // Check pair
    if (sel.pairId === item.pairId && sel.type !== item.type) {
      // ✅ Match!
      setItems((prev) => prev.map((i) => i.id === id || i.id === selected ? { ...i, matched: true, selected: false } : i));
      setScore((s) => s + 1);
      setSelected(null);
    } else {
      // ❌ Wrong
      setWrong([id, selected]);
      setErrors((e) => e + 1);
      setTimeout(() => {
        setWrong([]);
        setSelected(null);
      }, 600);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}>
          Сопоставлено: <strong style={{ color: 'var(--bamboo)' }}>{matchedCount / 2}</strong> / {total}
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}>
          Ошибок: <strong style={{ color: errors > 0 ? 'var(--seal)' : 'var(--ink-3)' }}>{errors}</strong>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map((item) => {
          const isSelected = selected === item.id;
          const isWrong = wrong.includes(item.id);
          const isHanzi = item.type === 'hanzi';
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              disabled={item.matched}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--r-md)',
                border: `2px solid ${
                  isWrong ? 'var(--seal)' :
                  isSelected ? 'var(--bamboo)' :
                  item.matched ? 'var(--bamboo)' :
                  'var(--line)'
                }`,
                background: isWrong ? 'var(--seal-soft)' :
                  isSelected ? 'var(--bamboo-soft)' :
                  item.matched ? 'rgba(47,92,58,0.08)' :
                  'var(--card-bg)',
                color: item.matched ? 'var(--bamboo)' :
                  isSelected ? 'var(--bamboo)' :
                  isWrong ? 'var(--seal)' : 'var(--ink)',
                cursor: item.matched ? 'default' : 'pointer',
                fontFamily: isHanzi ? 'var(--font-serif)' : 'var(--font-ui)',
                fontSize: isHanzi ? 'var(--text-xl)' : 'var(--text-sm)',
                fontWeight: isHanzi ? 700 : 500,
                textAlign: 'center',
                transition: 'all var(--t-fast)',
                opacity: item.matched ? 0.6 : 1,
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 12px var(--bamboo-glow)' : 'var(--shadow-xs)',
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1.3,
              }}
            >
              {item.matched ? '✓ ' : ''}{item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── ИГРА 2: Угадай тон ────────────────────────────────────────────────────
interface ToneGameProps {
  words: DictWord[];
  onFinish: (score: number, total: number) => void;
}

const ToneGame: React.FC<ToneGameProps> = ({ words, onFinish }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const word = words[idx];
  const correctTone = word?.tones[0] ?? 1;

  const options = useMemo(() => {
    const all = [1, 2, 3, 4];
    if (!all.includes(correctTone)) return shuffle(all).slice(0, 4);
    const others = all.filter((t) => t !== correctTone);
    return shuffle([correctTone, ...shuffle(others).slice(0, 3)]);
  }, [idx, correctTone]);

  const handleAnswer = (tone: number) => {
    if (answered !== null) return;
    setAnswered(tone);
    setShowFeedback(true);
    if (tone === correctTone) setScore((s) => s + 1);
    setTimeout(() => {
      setShowFeedback(false);
      setAnswered(null);
      if (idx + 1 >= words.length) {
        onFinish(score + (tone === correctTone ? 1 : 0), words.length);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1000);
  };

  if (!word) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}>
          Слово {idx + 1} / {words.length}
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--bamboo)', fontWeight: 700 }}>
          ⭐ {score}
        </span>
      </div>

      <div className="card-paper" style={{ textAlign: 'center', marginBottom: 20, padding: 'var(--sp-6)' }}>
        <div style={{ fontSize: 'var(--text-hanzi-sm)', fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
          {word.hanzi}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', marginBottom: 4 }}>
          {word.pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (m) => m + '?')}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-3)' }}>{word.translation}</div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Выберите тон первого слога:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((tone) => {
          const isCorrect = tone === correctTone;
          const isSelected = answered === tone;
          return (
            <button
              key={tone}
              type="button"
              onClick={() => handleAnswer(tone)}
              disabled={answered !== null}
              style={{
                padding: '14px 12px',
                borderRadius: 'var(--r-md)',
                border: `2px solid ${
                  showFeedback && isCorrect ? 'var(--bamboo)' :
                  showFeedback && isSelected && !isCorrect ? 'var(--seal)' :
                  TONE_COLORS[tone]
                }`,
                background: showFeedback && isCorrect ? 'var(--bamboo-soft)' :
                  showFeedback && isSelected && !isCorrect ? 'var(--seal-soft)' :
                  'var(--card-bg)',
                color: TONE_COLORS[tone],
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                textAlign: 'center',
                cursor: answered !== null ? 'default' : 'pointer',
                transition: 'all var(--t-fast)',
                transform: showFeedback && isCorrect ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{TONE_SYMBOLS[tone]}</div>
              <div>{TONE_NAMES[tone]}</div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className="anim-fadein"
          style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 'var(--r-md)',
            background: answered === correctTone ? 'var(--bamboo-soft)' : 'var(--seal-soft)',
            color: answered === correctTone ? 'var(--bamboo)' : 'var(--seal)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
          }}
        >
          {answered === correctTone ? '✓ Правильно!' : `✗ Неверно. Верный тон: ${TONE_NAMES[correctTone]}`}
        </div>
      )}
    </div>
  );
};

// ── ИГРА 3: Переведи слово ────────────────────────────────────────────────
interface TranslateGameProps {
  words: DictWord[];
  onFinish: (score: number, total: number) => void;
}

const TranslateGame: React.FC<TranslateGameProps> = ({ words, onFinish }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const word = words[idx];

  const options = useMemo(() => {
    if (!word) return [];
    const distractors = shuffle(DICTIONARY.filter((w) => w.id !== word.id)).slice(0, 3);
    return shuffle([word, ...distractors]);
  }, [idx, word?.id]);

  const handleAnswer = (chosen: DictWord) => {
    if (answered !== null) return;
    setAnswered(chosen.id);
    setShowFeedback(true);
    const isCorrect = chosen.id === word.id;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setShowFeedback(false);
      setAnswered(null);
      if (idx + 1 >= words.length) {
        onFinish(score + (isCorrect ? 1 : 0), words.length);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1000);
  };

  if (!word) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}>
          Слово {idx + 1} / {words.length}
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--bamboo)', fontWeight: 700 }}>⭐ {score}</span>
      </div>

      <div className="card-paper" style={{ textAlign: 'center', marginBottom: 20, padding: 'var(--sp-6)' }}>
        <div style={{ fontSize: 'var(--text-hanzi-sm)', fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
          {word.hanzi}
        </div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--seal)', fontWeight: 600 }}>{word.pinyin}</div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Выберите перевод:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt) => {
          const isCorrect = opt.id === word.id;
          const isSelected = answered === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleAnswer(opt)}
              disabled={answered !== null}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--r-md)',
                border: `2px solid ${
                  showFeedback && isCorrect ? 'var(--bamboo)' :
                  showFeedback && isSelected && !isCorrect ? 'var(--seal)' :
                  'var(--line)'
                }`,
                background: showFeedback && isCorrect ? 'var(--bamboo-soft)' :
                  showFeedback && isSelected && !isCorrect ? 'var(--seal-soft)' :
                  'var(--card-bg)',
                color: showFeedback && isCorrect ? 'var(--bamboo)' :
                  showFeedback && isSelected && !isCorrect ? 'var(--seal)' :
                  'var(--ink)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                textAlign: 'left',
                cursor: answered !== null ? 'default' : 'pointer',
                transition: 'all var(--t-fast)',
                transform: showFeedback && isCorrect ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {showFeedback && isCorrect ? '✓ ' : showFeedback && isSelected && !isCorrect ? '✗ ' : ''}{opt.translation}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Результаты ────────────────────────────────────────────────────────────
interface ResultProps {
  score: number;
  total: number;
  gameName: string;
  onReplay: () => void;
  onMenu: () => void;
}

const ResultScreen: React.FC<ResultProps> = ({ score, total, gameName, onReplay, onMenu }) => {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '🌱' : '📖';
  const msg = pct >= 80 ? 'Отлично! Ты настоящий знаток!' : pct >= 50 ? 'Хорошо! Продолжай практиковаться.' : 'Нужно ещё поучить. Не сдавайся!';

  return (
    <div className="anim-fadein" style={{ textAlign: 'center', paddingTop: 'var(--sp-5)' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
      <div className="seal-stamp" style={{ marginBottom: 16, margin: '0 auto 16px' }}>成</div>
      <h2 style={{ marginBottom: 8 }}>{gameName} — Результат</h2>
      <p style={{ color: 'var(--ink-2)', marginBottom: 20, fontSize: 'var(--text-sm)' }}>{msg}</p>

      <div className="card-paper" style={{ marginBottom: 20, padding: 'var(--sp-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Правильно', value: score, color: 'var(--bamboo)' },
            { label: 'Всего', value: total, color: 'var(--ink)' },
            { label: 'Результат', value: `${pct}%`, color: pct >= 80 ? 'var(--gold)' : 'var(--seal)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="progress-track" style={{ marginTop: 14 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" className="btn btn-primary btn-full" onClick={onReplay}>
          <RotateCcw size={16} /> Сыграть ещё раз
        </button>
        <button type="button" className="btn btn-secondary btn-full" onClick={onMenu}>
          В меню игр
        </button>
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────────────────────────
export const Games: React.FC = () => {
  const [game, setGame] = useState<GameType>('menu');
  const [result, setResult] = useState<{ score: number; total: number; name: string } | null>(null);
  const [gameKey, setGameKey] = useState(0); // force re-mount for replay
  const [words, setWords] = useState<DictWord[]>([]);

  const startGame = useCallback((type: GameType) => {
    const count = type === 'match' ? 6 : 10;
    setWords(pickWords(2, count));
    setGameKey((k) => k + 1);
    setGame(type);
  }, []);

  const handleFinish = useCallback((score: number, total: number) => {
    const names: Record<string, string> = {
      match: 'Сопоставление',
      toneSelect: 'Угадай тон',
      translate: 'Переведи слово',
    };
    setResult({ score, total, name: names[game] ?? 'Игра' });
    setGame('result');
  }, [game]);

  const GAMES = [
    {
      id: 'match' as GameType,
      title: 'Сопоставление',
      description: 'Соедини иероглифы с переводами на время',
      icon: '🀄',
      color: 'var(--seal)',
      bg: 'var(--seal-soft)',
    },
    {
      id: 'translate' as GameType,
      title: 'Переведи слово',
      description: 'Выбери правильный перевод иероглифа',
      icon: '🈷',
      color: 'var(--bamboo)',
      bg: 'var(--bamboo-soft)',
    },
    {
      id: 'toneSelect' as GameType,
      title: 'Угадай тон',
      description: 'Определи правильный тон для иероглифа',
      icon: '🎵',
      color: 'var(--gold)',
      bg: 'var(--gold-soft)',
    },
  ];

  if (game === 'menu') {
    return (
      <div className="screen">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
          <div>
            <div className="page-kicker">游戏练习 · МИНИ-ИГРЫ</div>
            <h1 className="page-title">Игры</h1>
            <p className="page-lead">Учи китайский в игровом формате</p>
          </div>
          <div className="seal-stamp" style={{ width: 44, height: 44, fontSize: 20 }}>玩</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => startGame(g.id)}
              className="card-paper"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 'var(--sp-5)',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                transition: 'transform var(--t-fast), box-shadow var(--t-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--r-md)',
                background: g.bg, border: `1.5px solid ${g.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0,
              }}>
                {g.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: g.color, marginBottom: 3 }}>{g.title}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', lineHeight: 1.4 }}>{g.description}</div>
              </div>
              <ChevronRight size={18} color="var(--ink-4)" />
            </button>
          ))}
        </div>

        {/* Советы */}
        <div className="card-paper" style={{ background: 'var(--gold-soft)', border: '1px solid rgba(196,146,46,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--gold)', marginBottom: 4 }}>Совет</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Игры используют слова HSK 1–2. Чем больше ты практикуешься в карточках,
                тем легче становятся игры!
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (game === 'result' && result) {
    return (
      <div className="screen">
        <ResultScreen
          score={result.score}
          total={result.total}
          gameName={result.name}
          onReplay={() => startGame(game === 'result' ? 'match' : game)}
          onMenu={() => setGame('menu')}
        />
      </div>
    );
  }

  const gameHeader = GAMES.find((g) => g.id === game);

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--sp-5)' }}>
        <button
          type="button"
          onClick={() => setGame('menu')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1.5px solid var(--line)', background: 'var(--paper-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-2)', cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div>
          <div className="page-kicker">游戏 · ИГРА</div>
          <h2 style={{ fontSize: 'var(--text-xl)' }}>{gameHeader?.title}</h2>
        </div>
      </div>

      {game === 'match' && (
        <MatchGame key={gameKey} words={words} onFinish={handleFinish} />
      )}
      {game === 'toneSelect' && (
        <ToneGame key={gameKey} words={words} onFinish={handleFinish} />
      )}
      {game === 'translate' && (
        <TranslateGame key={gameKey} words={words} onFinish={handleFinish} />
      )}
    </div>
  );
};
