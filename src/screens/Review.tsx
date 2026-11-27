import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { WordCard } from '../components/WordCard';

export const Review: React.FC = () => {
  const { currentCard, currentIndex, hasMore, progress, isLoading, totalInSession, submitReview, reload } = useCards();
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites(user?.id);

  if (isLoading) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🐼</div>
          <p style={{ color: 'var(--ink-2)' }}>Загружаем карточки...</p>
        </div>
      </div>
    );
  }

  // Пусто
  if (totalInSession === 0) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎋</div>
        <div className="seal-stamp" style={{ marginBottom: 16 }}>通</div>
        <h2 style={{ marginBottom: 8 }}>Всё повторено!</h2>
        <p style={{ color: 'var(--ink-2)', maxWidth: 280, marginBottom: 24 }}>
          На сегодня карточек нет. Бао гордится — возвращайся завтра!
        </p>
        <button className="btn btn-secondary btn-sm" onClick={reload} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Проверить снова
        </button>
      </div>
    );
  }

  // Завершено
  if (!hasMore) {
    const pct = Math.round((currentIndex / totalInSession) * 100);
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <CheckCircle size={56} color="var(--bamboo)" strokeWidth={1.5} style={{ marginBottom: 12 }} />
        <div className="seal-stamp" style={{ marginBottom: 16 }}>成</div>
        <h1 style={{ marginBottom: 8 }}>Занятие завершено!</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 24 }}>
          Повторено {totalInSession} карточек · {pct}% готово
        </p>
        <button className="btn btn-primary btn-full" style={{ maxWidth: 300 }} onClick={reload}>
          Новое занятие
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingTop: 'var(--sp-5)' }}>
      {/* Прогресс */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 6 }}>
          <span>Карточка {currentIndex + 1} из {totalInSession}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Карточка */}
      {currentCard && (
        <WordCard
          card={currentCard}
          isFavorite={isFavorite(currentCard.wordId)}
          onToggleFavorite={() => toggle(currentCard.wordId)}
          onAnswer={(r) => submitReview(r)}
        />
      )}
    </div>
  );
};
