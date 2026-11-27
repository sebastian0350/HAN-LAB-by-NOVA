import React, { useState } from 'react';
import { Heart, Volume2, Search, ChevronDown } from 'lucide-react';
import { DICTIONARY, getWordsByHsk } from '../data/dictionary';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { speakHanzi } from '../lib/speech';

type FilterHsk = 'all' | 1 | 2 | 3 | 4;

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)', 2: 'var(--tone-2)', 3: 'var(--tone-3)',
  4: 'var(--tone-4)', 0: 'var(--tone-0)',
};

export const Path: React.FC = () => {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites(user?.id);
  const [hskFilter, setHskFilter] = useState<FilterHsk>('all');
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const words = hskFilter === 'all' ? DICTIONARY : getWordsByHsk(hskFilter);
  const filtered = words.filter((w) => {
    if (showFavsOnly && !isFavorite(w.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return w.hanzi.includes(q) || w.pinyin.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="screen">
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
        <div>
          <div className="page-kicker">词汇表</div>
          <h1 className="page-title">Словарь</h1>
        </div>
        <button
          onClick={() => setShowFavsOnly(!showFavsOnly)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 'var(--r-pill)',
            background: showFavsOnly ? 'var(--seal)' : 'var(--seal-soft)',
            color: showFavsOnly ? 'white' : 'var(--seal)',
            border: showFavsOnly ? 'none' : '1px solid rgba(181,40,30,0.25)',
            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
          }}
        >
          <Heart size={14} fill={showFavsOnly ? 'currentColor' : 'none'} />
          Избранное
        </button>
      </div>

      {/* Поиск */}
      <div style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
        <Search size={16} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--ink-3)',
        }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Иероглиф, пиньинь, перевод..."
          style={{ paddingLeft: 36 }}
          aria-label="Поиск слов"
        />
      </div>

      {/* Фильтр HSK */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--sp-5)', overflowX: 'auto', paddingBottom: 2 }}>
        {(['all', 1, 2, 3, 4] as FilterHsk[]).map((f) => (
          <button
            key={String(f)}
            onClick={() => setHskFilter(f)}
            style={{
              flexShrink: 0,
              padding: '5px 14px',
              borderRadius: 'var(--r-pill)',
              background: hskFilter === f ? 'var(--bamboo)' : 'var(--paper-2)',
              color: hskFilter === f ? 'white' : 'var(--ink-2)',
              border: hskFilter === f ? 'none' : '1px solid var(--line)',
              fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
              transition: 'background var(--t-fast)',
            }}
          >
            {f === 'all' ? `Все (${DICTIONARY.length})` : `HSK ${f} (${getWordsByHsk(f).length})`}
          </button>
        ))}
      </div>

      {/* Список слов */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0', color: 'var(--ink-3)' }}>
          {showFavsOnly ? '❤️ Избранных слов пока нет' : '🔍 Ничего не найдено'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((word) => {
            const fav = isFavorite(word.id);
            const isOpen = expandedId === word.id;
            const mainTone = word.tones.find(t => t > 0) ?? word.tones[0] ?? 0;

            return (
              <div
                key={word.id}
                className="card-paper"
                style={{ cursor: 'pointer', transition: 'box-shadow var(--t-fast)' }}
              >
                {/* Строка слова */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  onClick={() => setExpandedId(isOpen ? null : word.id)}
                  role="button"
                  aria-expanded={isOpen}
                >
                  <div style={{
                    fontSize: 'var(--text-hanzi-sm)',
                    fontFamily: 'var(--font-serif)',
                    color: TONE_COLORS[mainTone],
                    lineHeight: 1,
                    minWidth: 56,
                    textAlign: 'center',
                  }}>{word.hanzi}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ color: TONE_COLORS[mainTone], fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                      {word.pinyin}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                      {word.translation}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="hsk-badge" style={{ marginRight: 2 }}>HSK {word.hsk}</span>
                    <button
                      className={`fav-btn${fav ? ' active' : ''}`}
                      style={{ width: 30, height: 30, fontSize: 14 }}
                      onClick={(e) => { e.stopPropagation(); toggle(word.id); }}
                      aria-label="Избранное"
                    >
                      <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakHanzi(word.hanzi); }}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', border: 'none',
                        background: 'var(--paper-3)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--ink-3)',
                      }}
                      aria-label="Произнести"
                    >
                      <Volume2 size={13} />
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
                    {word.example && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'var(--paper)',
                        borderRadius: 'var(--r-sm)',
                        borderLeft: '3px solid var(--bamboo)',
                        marginBottom: 8,
                      }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-sm)', marginBottom: 2 }}>{word.example}</div>
                        {word.examplePinyin && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 2 }}>{word.examplePinyin}</div>}
                        {word.exampleRu && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontStyle: 'italic' }}>{word.exampleRu}</div>}
                      </div>
                    )}
                    {word.mnemonic && (
                      <div style={{
                        padding: '8px 12px', background: 'var(--gold-soft)', borderRadius: 'var(--r-sm)',
                        fontSize: 'var(--text-xs)', color: 'var(--gold)',
                      }}>
                        💡 {word.mnemonic}
                      </div>
                    )}
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
