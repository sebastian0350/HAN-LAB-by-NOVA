import { useState, useEffect } from 'react';
import { db } from '../db/schema';
import type { Card, CardState } from '../db/schema';
import { calculateNextReview, type ReviewRating } from '../core/fsrs';

export function useCards() {
  const [dueCards, setDueCards] = useState<CardState[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем карточки к повторению
  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = async () => {
    try {
      const allStates = await db.cardStates.where('deleted').equals(0).toArray();
      const now = new Date();
      const due = allStates.filter(state => new Date(state.due) <= now);
      setDueCards(due);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (cardStateId: string, rating: ReviewRating) => {
    try {
      const cardState = await db.cardStates.get(cardStateId);
      if (!cardState) return;

      const result = calculateNextReview(cardState, rating);
      
      // Сохраняем отзыв
      await db.reviews.add({
        id: crypto.randomUUID(),
        cardId: cardState.cardId,
        rating,
        timestamp: new Date(),
        timeSpent: 0, // TODO: отслеживать время
      });

      // Обновляем состояние карточки
      await db.cardStates.update(cardStateId, {
        ...result.state,
        updatedAt: new Date(),
      });

      // Переходим к следующей карточке
      setCurrentCardIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const addCard = async (card: Card) => {
    try {
      await db.cards.add(card);
      
      // Создаём начальное состояние карточки
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

      await loadDueCards();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const currentCard = dueCards[currentCardIndex];
  const hasMoreCards = currentCardIndex < dueCards.length;
  const progress = dueCards.length > 0 ? (currentCardIndex / dueCards.length) * 100 : 0;

  return {
    dueCards,
    currentCard,
    hasMoreCards,
    progress,
    isLoading,
    submitReview,
    addCard,
    loadDueCards,
  };
}
