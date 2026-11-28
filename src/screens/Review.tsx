import React from 'react';
import { CheckCircle, RefreshCw, BookOpen, History, Sparkles } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { WordCard } from '../components/WordCard';
import type { TabId } from '../context/AppContext';

interface ReviewProps {
  onTabChange?: (tab: TabId) => void;
}

const RATING_BADGES = {
  again: { label: 'Забыл',  color: 'var(--seal)',   bg: 'var(--seal-soft)' },
  hard:  { label: 'Трудно', color: 'var(--ink-2)',  bg: 'var(--paper-3)' },
  good:  { label: 'Хорошо', color: 'var(--bamboo)', bg: 'var(--bamboo-soft)' },
  easy:  { label: 'Легко',  color: 'var(--gold)',   bg: 'var(--gold-soft)' },
} as const;

export const Review: React.FC<ReviewProps> = ({ onTabChange }) => {
  const {
    currentCard,
    currentIndex,
    hasMore,
    progress,
    isLoading,
    todayDone,
    dailyGoal,
    totalInSession,
    sessionHistory,
    statsSummary,
    submitReview,
    reload,
    practiceMore,
  } = useCards();
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites(user?.id);

  if (isLoading) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🐼</div>
          <p style={{ color: 'var(--ink-2)' }}>Подготавливаем карточки FSRS...</p>
        </div>
      </div>
    );
  }

  // Пусто (все плановые карточки на сегодня повторены)
  if (totalInSession === 0) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎋</div>
        <div className="seal-stamp" style={{ marginBottom: 16 }}>通</div>
        <h2 style={{ marginBottom: 8 }}>Все карточки на сегодня повторены!</h2>
        <p style={{ color: 'var(--ink-2)', maxWidth: 320, marginBottom: 20, fontSize: 'var(--text-sm)' }}>
          Алгоритм FSRS запланировал следующие повторения. Вы уже выполнили {todayDone} повторений сегодня.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
          <button type="button" className="btn btn-primary btn-full" onClick={practiceMore}>
            <Sparkles size={16} /> Тренировать ещё слова
          </button>
          {onTabChange && (
            <button type="button" className="btn btn-secondary btn-full" onClick={() => onTabChange('path')}>
              <BookOpen size={16} /> Открыть словарь HSK 1
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={reload}>
            <RefreshCw size={14} /> Обновить очередь
          </button>
        </div>
      </div>
    );
  }

  // Завершено текущее занятие
  if (!hasMore) {
    return (
      <div className="screen">
        <div className="card-paper" style={{ textAlign: 'center', marginBottom: 'var(--sp-5)' }}>
          <CheckCircle size={52} color="var(--bamboo)" strokeWidth={1.8} style={{ margin: '0 auto 10px' }} />
          <div className="seal-stamp" style={{ marginBottom: 12 }}>成</div>
          <h1 style={{ marginBottom: 6 }}>Занятие завершено!</h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
            Пройдено карточек за сессию: <strong>{totalInSession}</strong> · Всего за сегодня: <strong>{todayDone}</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <button type="button" className="btn btn-primary btn-full" onClick={reload}>
              Следующая партия карточек
            </button>
            <button type="button" className="btn btn-secondary btn-full" onClick={practiceMore}>
              Дополнительная практика
            </button>
            {onTabChange && (
              <button type="button" className="btn btn-ghost btn-full" onClick={() => onTabChange('today')}>
                На главную
              </button>
            )}
          </div>
        </div>

        {/* История повторений за сессию */}
        {sessionHistory.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <History size={16} color="var(--bamboo)" />
              <h3 style={{ fontSize: 'var(--text-sm)' }}>История ответов в этом занятии</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessionHistory.map((item, idx) => {
                const badge = RATING_BADGES[item.rating];
                return (
                  <div
                    key={`${item.wordId}-${idx}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', background: 'var(--paper-2)', borderRadius: 'var(--r-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                        {item.hanzi}
                      </span>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)' }}>{item.pinyin}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>{item.translation}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 'var(--r-pill)', background: badge.bg, color: badge.color,
                      }}>
                        {badge.label}
                      </span>
                      <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                        через {item.scheduledDays} дн.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingTop: 'var(--sp-4)' }}>
      {/* Верхняя сводка по базе слов */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
        marginBottom: 12, textAlign: 'center',
      }}>
        {[
          { label: 'Новые', value: statsSummary.newCount, color: 'var(--gold)' },
          { label: 'Учатся', value: statsSummary.learningCount, color: 'var(--tone-1)' },
          { label: 'Изучено', value: statsSummary.masteredCount, color: 'var(--bamboo)' },
          { label: 'Сегодня', value: `${todayDone}/${dailyGoal}`, color: 'var(--seal)' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: 'var(--paper-2)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-sm)', padding: '6px 4px',
            }}
          >
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Прогресс текущей сессии */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 5 }}>
          <span>Карточка {currentIndex + 1} из {totalInSession}</span>
          <span>Сессия: {progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Карточка */}
      {currentCard && (
        <WordCard
          key={currentCard.wordId}
          card={currentCard}
          isFavorite={isFavorite(currentCard.wordId)}
          onToggleFavorite={() => toggle(currentCard.wordId)}
          onAnswer={(r) => submitReview(r)}
        />
      )}

      {/* История последних ответов в текущей сессии */}
      {sessionHistory.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--ink-3)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <History size={13} />
            <span>Ответы в текущей сессии ({sessionHistory.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {sessionHistory.slice(0, 8).map((item, idx) => {
              const badge = RATING_BADGES[item.rating];
              return (
                <div
                  key={`${item.wordId}-${idx}`}
                  style={{
                    flexShrink: 0,
                    padding: '6px 10px',
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--paper-2)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{item.hanzi}</span>
                  <span style={{ fontSize: 10, color: badge.color, fontWeight: 700 }}>{badge.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>+{item.scheduledDays}д</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
