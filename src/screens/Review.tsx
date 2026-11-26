import React, { useState, useEffect } from 'react';
import { ru } from '../config/i18n';
import { useCards } from '../hooks/useCards';
import { WordCard } from '../components/WordCard';
import { db } from '../db/schema';
import { Card } from '../db/schema';

export const Review: React.FC = () => {
  const { dueCards, currentCard, hasMoreCards, progress, isLoading, submitReview } = useCards();
  const [currentWordData, setCurrentWordData] = useState<Card | null>(null);

  // Загружаем данные карточки
  useEffect(() => {
    const loadWordData = async () => {
      if (currentCard) {
        const card = await db.cards.get(currentCard.cardId);
        setCurrentWordData(card || null);
      }
    };
    loadWordData();
  }, [currentCard]);

  // Добавляем тестовые карточки если нет данных
  React.useEffect(() => {
    const addSampleCards = async () => {
      const existingCards = await db.cards.count();
      if (existingCards === 0) {
        const sampleCards: Card[] = [
          {
            id: crypto.randomUUID(),
            hanzi: '你好',
            pinyin: 'nǐ hǎo',
            tone: 3,
            translation: 'Привет',
            level: 1,
            tags: ['greeting'],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: crypto.randomUUID(),
            hanzi: '谢谢',
            pinyin: 'xiè xie',
            tone: 4,
            translation: 'Спасибо',
            level: 1,
            tags: ['greeting'],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: crypto.randomUUID(),
            hanzi: '再见',
            pinyin: 'zài jiàn',
            tone: 4,
            translation: 'До свидания',
            level: 1,
            tags: ['greeting'],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        for (const card of sampleCards) {
          await db.cards.add(card);
          await db.cardStates.add({
            id: crypto.randomUUID(),
            cardId: card.id,
            due: new Date(),
            stability: 0,
            difficulty: 0,
            reviews: 0,
            lapses: 0,
            updatedAt: new Date(),
            deleted: false,
          });
        }
        window.location.reload();
      }
    };
    addSampleCards();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px', textAlign: 'center' }}>
        <h1>{ru.nav.review}</h1>
        <p style={{ marginTop: 'var(--space-lg)', color: 'var(--ink-2)' }}>
          Нет карточек для повторения!
        </p>
      </div>
    );
  }

  if (!hasMoreCards) {
    return (
      <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px', textAlign: 'center' }}>
        <h1>{ru.nav.review}</h1>
        <p style={{ marginTop: 'var(--space-lg)', color: 'var(--ink-2)' }}>
          Занятие завершено! 🎉
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 'var(--space-lg)',
            padding: 'var(--space-md) var(--space-lg)',
            backgroundColor: 'var(--bamboo)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
          }}
        >
          Начать заново
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      {/* Прогресс */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div
          style={{
            height: '4px',
            backgroundColor: 'var(--line)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: 'var(--bamboo)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', marginTop: 'var(--space-sm)' }}>
          {currentCardIndex + 1} / {dueCards.length}
        </p>
      </div>

      {/* Карточка */}
      {currentWordData && currentCard && (
        <WordCard
          word={{
            id: currentWordData.id,
            hanzi: currentWordData.hanzi,
            pinyin: currentWordData.pinyin,
            tone: currentWordData.tone,
            translation: currentWordData.translation,
          }}
          onAnswer={(rating) => submitReview(currentCard.id, rating)}
        />
      )}
    </div>
  );
};
