import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Volume2, Search, ChevronDown, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { DICTIONARY, getWordsByHsk, normalizePinyin } from '../data/dictionary';
import { db, initializeDatabase, getWordLearningStatus, type CardState, type WordLearningStatus } from '../db/schema';
import { calculateNextReview } from '../core/fsrs';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { speakHanzi } from '../lib/speech';
import type { TabId } from '../context/AppContext';

type FilterHsk = 1 | 'all' | 2 | 3 | 4;
type StatusFilter = 'all' | 'new' | 'learning' | 'mastered' | 'fav';

interface PathProps {
  onTabChange?: (tab: TabId) => void;
}

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-0)',
};

const STATUS_BADGE: Record<WordLearningStatus, { label: string; color: string; bg: string }> = {
  new:      { label: 'Новое',     color: 'var(--ink-3)',  bg: 'var(--paper-3)' },
  learning: { label: 'Изучается', color: 'var(--tone-1)', bg: 'var(--tone-1-soft)' },
  mastered: { label: 'Изучено',   color: 'var(--bamboo)', bg: 'var(--bamboo-soft)' },
};

export const Path: React.FC<PathProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites(user?.id);
  const [hskFilter, setHskFilter] = useState<FilterHsk>(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stateMap, setStateMap] = useState<Map<string, CardState>>(new Map());

  const loadStates = useCallback(async () => {
    try {
      await initializeDatabase();
      const states = await db.cardStates.toArray();
      const map = new Map<string, CardState>();
      for (const s of states) {
        if (!s.deleted) {
          map.set(s.id, s);
        }
      }
      setStateMap(map);
    } catch (err) {
      console.error('Path loadStates error:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => {
        if (mounted) return loadStates();
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [loadStates]);

  const handleQuickReview = async (wordId: string, rating: 'good' | 'again') => {
    try {
      const now = new Date();
      const existing = stateMap.get(wordId) ?? {
        id: wordId,
        cardId: wordId,
        due: now,
        stability: 0,
        difficulty: 0,
        reviews: 0,
        lapses: 0,
        updatedAt: now,
        deleted: false,
      };
      const result = calculateNextReview(existing, rating, now);
      await db.transaction('rw', [db.reviews, db.cardStates], async () => {
        await db.reviews.add({
          id: crypto.randomUUID(),
          cardId: wordId,
          rating,
          timestamp: now,
          timeSpent: 0,
        });
        await db.cardStates.put({
          ...existing,
          ...result.state,
          id: wordId,
          cardId: wordId,
          updatedAt: now,
          deleted: false,
        });
      });
      await loadStates();
    } catch (err) {
      console.error('Quick review error:', err);
    }
  };

  const baseWords = hskFilter === 'all' ? DICTIONARY : getWordsByHsk(hskFilter);

  // Статистика по выбранному набору слов (по умолчанию 80 слов HSK 1)
  let masteredCount = 0;
  let learningCount = 0;
  let newCount = 0;

  for (const w of baseWords) {
    const st = getWordLearningStatus(stateMap.get(w.id));
    if (st === 'mastered') masteredCount += 1;
    else if (st === 'learning') learningCount += 1;
    else newCount += 1;
  }

  const studiedCount = masteredCount + learningCount;
  const progressPct = baseWords.length > 0 ? Math.round((studiedCount / baseWords.length) * 100) : 0;

  const filtered = baseWords.filter((w) => {
    const st = getWordLearningStatus(stateMap.get(w.id));
    if (statusFilter === 'fav' && !isFavorite(w.id)) return false;
    if (statusFilter === 'new' && st !== 'new') return false;
    if (statusFilter === 'learning' && st !== 'learning') return false;
    if (statusFilter === 'mastered' && st !== 'mastered') return false;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const qNorm = normalizePinyin(q);
      const matchHanzi = w.hanzi.includes(q);
      const matchPinyin = w.pinyin.toLowerCase().includes(q) || (qNorm.length > 0 && normalizePinyin(w.pinyin).includes(qNorm));
      const matchRu = w.translation.toLowerCase().includes(q);
      return matchHanzi || matchPinyin || matchRu;
    }
    return true;
  });

  return (
    <div className="screen">
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
        <div>
          <div className="page-kicker">词汇与学习路径 · ПУТЬ HSK</div>
          <h1 className="page-title">Путь и словарь</h1>
          <p className="page-lead">Все 80 базовых слов HSK 1 и расширенная база</p>
        </div>
        {onTabChange && (
          <button
            type="button"
            onClick={() => onTabChange('review')}
            className="btn btn-primary btn-sm"
            style={{ flexShrink: 0 }}
          >
            <Layers size={14} /> Учить
          </button>
        )}
      </div>

      {/* Блок общего прогресса и количества изученных слов */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} color="var(--bamboo)" />
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              {hskFilter === 'all' ? 'Общий прогресс словаря' : `Прогресс курса HSK ${hskFilter}`}
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--bamboo)' }}>
            Изучено: {studiedCount} из {baseWords.length} ({progressPct}%)
          </span>
        </div>
        <div className="progress-track" style={{ height: 8, marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--ink-2)' }}>
          <span>🌱 Новые: <strong>{newCount}</strong></span>
          <span>📖 Изучаются: <strong>{learningCount}</strong></span>
          <span>🎋 Освоено: <strong>{masteredCount}</strong></span>
        </div>
      </div>

      {/* Поиск по иероглифам, Pinyin и русскому переводу */}
      <div style={{ position: 'relative', marginBottom: 'var(--sp-3)' }}>
        <Search size={16} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--ink-3)',
        }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск: иероглиф (你好), пиньинь (ni hao), перевод..."
          style={{ paddingLeft: 36 }}
          aria-label="Поиск слов"
        />
      </div>

      {/* Фильтр уровня HSK */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--sp-3)', overflowX: 'auto', paddingBottom: 2 }}>
        {([1, 'all', 2, 3, 4] as FilterHsk[]).map((f) => (
          <button
            key={String(f)}
            type="button"
            onClick={() => setHskFilter(f)}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 'var(--r-pill)',
              background: hskFilter === f ? 'var(--bamboo)' : 'var(--paper-2)',
              color: hskFilter === f ? 'white' : 'var(--ink-2)',
              border: hskFilter === f ? 'none' : '1px solid var(--line)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
              transition: 'background var(--t-fast)',
            }}
          >
            {f === 'all' ? `Все уровни (${DICTIONARY.length})` : `HSK ${f} (${getWordsByHsk(f).length})`}
          </button>
        ))}
      </div>

      {/* Фильтр по статусу изучения */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--sp-4)', overflowX: 'auto', paddingBottom: 2 }}>
        {([
          { id: 'all',      label: `Все (${baseWords.length})` },
          { id: 'new',      label: `Новые (${newCount})` },
          { id: 'learning', label: `Изучаются (${learningCount})` },
          { id: 'mastered', label: `Изучено (${masteredCount})` },
          { id: 'fav',      label: '❤️ Избранное' },
        ] as { id: StatusFilter; label: string }[]).map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setStatusFilter(st.id)}
            style={{
              flexShrink: 0,
              padding: '4px 11px',
              borderRadius: 'var(--r-pill)',
              background: statusFilter === st.id ? 'var(--gold)' : 'var(--paper)',
              color: statusFilter === st.id ? 'white' : 'var(--ink-2)',
              border: statusFilter === st.id ? 'none' : '1px solid var(--line)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Список слов */}
      {filtered.length === 0 ? (
        <div className="card-paper" style={{ textAlign: 'center', padding: 'var(--sp-10) var(--sp-4)', color: 'var(--ink-3)' }}>
          {statusFilter === 'fav' ? '❤️ Избранных слов пока нет' : '🔍 По вашему запросу ничего не найдено'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((word) => {
            const fav = isFavorite(word.id);
            const isOpen = expandedId === word.id;
            const mainTone = word.tones.find((t) => t > 0) ?? word.tones[0] ?? 0;
            const cardState = stateMap.get(word.id);
            const status = getWordLearningStatus(cardState);
            const badge = STATUS_BADGE[status];

            return (
              <div
                key={word.id}
                className="card-paper"
                style={{ padding: '14px 16px', cursor: 'pointer', transition: 'box-shadow var(--t-fast)' }}
              >
                {/* Строка слова */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  onClick={() => setExpandedId(isOpen ? null : word.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedId(isOpen ? null : word.id); }}
                  aria-expanded={isOpen}
                >
                  <div style={{
                    fontSize: 34,
                    fontFamily: 'var(--font-serif)',
                    color: TONE_COLORS[mainTone],
                    lineHeight: 1.1,
                    minWidth: 58,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>{word.hanzi}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ color: TONE_COLORS[mainTone], fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {word.pinyin}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: 'var(--r-pill)',
                        color: badge.color,
                        background: badge.bg,
                      }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {word.translation}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <button
                      type="button"
                      className={`fav-btn${fav ? ' active' : ''}`}
                      style={{ width: 30, height: 30, fontSize: 14 }}
                      onClick={(e) => { e.stopPropagation(); toggle(word.id); }}
                      aria-label="Избранное"
                    >
                      <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); speakHanzi(word.hanzi); }}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', border: 'none',
                        background: 'var(--paper-3)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--ink-2)',
                      }}
                      aria-label="Произнести"
                    >
                      <Volume2 size={14} />
                    </button>
                    <ChevronDown
                      size={16}
                      style={{ color: 'var(--ink-4)', transition: 'transform var(--t-fast)', transform: isOpen ? 'rotate(180deg)' : '' }}
                    />
                  </div>
                </div>

                {/* Раскрытая панель */}
                {isOpen && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line-2)' }} className="anim-fadein">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-3)' }}>
                      <span>Уровень: HSK {word.hsk} · Тоны: {word.tones.map((t) => (t === 0 ? 'нейтр.' : `${t}-й`)).join(', ')}</span>
                      <span>Повторений: {cardState?.reviews ?? 0}</span>
                    </div>

                    {word.example && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'var(--paper)',
                        borderRadius: 'var(--r-sm)',
                        borderLeft: '3px solid var(--bamboo)',
                        marginBottom: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-sm)', marginBottom: 2 }}>{word.example}</div>
                          {word.examplePinyin && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 2 }}>{word.examplePinyin}</div>}
                          {word.exampleRu && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', fontStyle: 'italic' }}>{word.exampleRu}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); speakHanzi(word.example!); }}
                          style={{
                            width: 28, height: 28, borderRadius: '50%', border: 'none',
                            background: 'var(--paper-3)', color: 'var(--bamboo)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}
                          aria-label="Озвучить пример"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                    )}

                    {(word.mnemonic || word.radical) && (
                      <div style={{
                        padding: '8px 12px', background: 'var(--gold-soft)', borderRadius: 'var(--r-sm)',
                        fontSize: 'var(--text-xs)', color: 'var(--gold)', marginBottom: 8,
                      }}>
                        💡 {word.radical ? `Ключ: ${word.radical}. ` : ''}{word.mnemonic ?? ''}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); void handleQuickReview(word.id, 'good'); }}
                        style={{
                          flex: 1, padding: '7px 10px', borderRadius: 'var(--r-sm)',
                          background: 'var(--bamboo-soft)', color: 'var(--bamboo)',
                          border: '1px solid rgba(61,107,72,0.25)', fontSize: 'var(--text-xs)', fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        }}
                      >
                        <CheckCircle2 size={13} /> Знаю слово
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); void handleQuickReview(word.id, 'again'); }}
                        style={{
                          padding: '7px 10px', borderRadius: 'var(--r-sm)',
                          background: 'var(--seal-soft)', color: 'var(--seal)',
                          border: '1px solid rgba(181,40,30,0.25)', fontSize: 'var(--text-xs)', fontWeight: 600,
                        }}
                      >
                        На повторение
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 'var(--sp-6)' }} />
    </div>
  );
};
