import { useCallback, useEffect, useState } from 'react';
import { db, initializeDatabase, getWordLearningStatus, type WordLearningStatus } from '../db/schema';
import { calculateNextReview, type ReviewRating } from '../core/fsrs';
import { DICTIONARY, getWordsByHsk } from '../data/dictionary';
import { speakHanzi } from '../lib/speech';

const DEFAULT_SETTINGS = {
  dailyGoal: 10,
  newCardsPerDay: 10,
  currentHsk: 1 as const,
  autoSpeak: true,
};

/** Добавляет новые карточки из словаря для выбранного уровня HSK, если они ещё не в базе */
async function ensureLevelCards(hskLevel: 1 | 2 | 3 | 4) {
  const words = getWordsByHsk(hskLevel);
  const existingIds = new Set((await db.cardStates.toArray()).map((s) => s.id));
  const unseen = words.filter((w) => !existingIds.has(w.id));
  if (unseen.length === 0) return;

  const now = new Date();
  await db.transaction('rw', db.cardStates, async () => {
    await db.cardStates.bulkPut(
      unseen.map((word) => ({
        id: word.id,
        cardId: word.id,
        due: now,
        stability: 0,
        difficulty: 0,
        reviews: 0,
        lapses: 0,
        updatedAt: now,
        deleted: false,
      }))
    );
  });
}

export interface SessionCard {
  wordId: string;
  hanzi: string;
  pinyin: string;
  tones: number[];
  translation: string;
  hsk: 1 | 2 | 3 | 4;
  tags: string[];
  category?: string;
  example?: string;
  examplePinyin?: string;
  exampleRu?: string;
  radical?: string;
  mnemonic?: string;
  stateId: string;
  isNew: boolean;
  status: WordLearningStatus;
  reviews: number;
  stability: number;
  difficulty: number;
  intervals: Record<ReviewRating, number>;
}

export interface SessionHistoryItem {
  wordId: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  rating: ReviewRating;
  scheduledDays: number;
  timestamp: Date;
}

export function useCards() {
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDone, setTodayDone] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_SETTINGS.dailyGoal);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  const [statsSummary, setStatsSummary] = useState({
    totalInDb: 80,
    dueCount: 0,
    newCount: 0,
    learningCount: 0,
    masteredCount: 0,
  });

  const loadSession = useCallback(async (forcePracticeAll = false) => {
    setIsLoading(true);
    try {
      await initializeDatabase();

      const settings = await db.settings.get('main');
      const hskLevel = (settings?.currentHsk ?? DEFAULT_SETTINGS.currentHsk) as 1 | 2 | 3 | 4;
      const goal = settings?.dailyGoal ?? DEFAULT_SETTINGS.dailyGoal;
      const speak = settings?.autoSpeak ?? DEFAULT_SETTINGS.autoSpeak;

      setDailyGoal(goal);
      setAutoSpeak(speak);

      await ensureLevelCards(hskLevel);

      const allStates = (await db.cardStates.toArray()).filter((s) => !s.deleted);
      const now = new Date();

      let dueCount = 0;
      let newCount = 0;
      let learningCount = 0;
      let masteredCount = 0;

      for (const s of allStates) {
        const st = getWordLearningStatus(s);
        if (st === 'new') newCount += 1;
        else if (st === 'learning') learningCount += 1;
        else masteredCount += 1;

        if (new Date(s.due) <= now || s.reviews === 0) {
          dueCount += 1;
        }
      }

      setStatsSummary({
        totalInDb: allStates.length,
        dueCount,
        newCount,
        learningCount,
        masteredCount,
      });

      const dueReviewStates = allStates
        .filter((s) => s.reviews > 0 && new Date(s.due) <= now)
        .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

      const newStates = allStates
        .filter((s) => s.reviews === 0)
        .sort((a, b) => a.id.localeCompare(b.id));

      let candidateStates = [...dueReviewStates, ...newStates];

      if (forcePracticeAll && candidateStates.length === 0) {
        candidateStates = [...allStates].sort(
          (a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()
        );
      }

      const wordMap = new Map(DICTIONARY.map((w) => [w.id, w]));
      const cards: SessionCard[] = [];

      for (const state of candidateStates) {
        const word = wordMap.get(state.id);
        if (!word) continue;

        const intervals: Record<ReviewRating, number> = {
          again: Math.round(calculateNextReview(state, 'again', now).scheduledDays),
          hard: Math.round(calculateNextReview(state, 'hard', now).scheduledDays),
          good: Math.round(calculateNextReview(state, 'good', now).scheduledDays),
          easy: Math.round(calculateNextReview(state, 'easy', now).scheduledDays),
        };

        cards.push({
          wordId: word.id,
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          tones: word.tones,
          translation: word.translation,
          hsk: word.hsk,
          tags: word.tags,
          category: word.category,
          example: word.example,
          examplePinyin: word.examplePinyin,
          exampleRu: word.exampleRu,
          radical: word.radical,
          mnemonic: word.mnemonic,
          stateId: state.id,
          isNew: state.reviews === 0,
          status: getWordLearningStatus(state),
          reviews: state.reviews,
          stability: state.stability,
          difficulty: state.difficulty,
          intervals,
        });

        if (cards.length >= goal) break;
      }

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayReviews = await db.reviews
        .where('timestamp')
        .aboveOrEqual(startOfToday)
        .count();
      setTodayDone(todayReviews);

      setSessionCards(cards);
      setCurrentIndex(0);
      setSessionHistory([]);
    } catch (err) {
      console.error('useCards error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => {
        if (mounted) return loadSession(false);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [loadSession]);

  // Авто-озвучка при смене карточки
  useEffect(() => {
    const card = sessionCards[currentIndex];
    if (card && autoSpeak) {
      speakHanzi(card.hanzi);
    }
  }, [currentIndex, sessionCards, autoSpeak]);

  const submitReview = useCallback(
    async (rating: ReviewRating, timeSpent = 0) => {
      const card = sessionCards[currentIndex];
      if (!card) return;

      try {
        const now = new Date();
        const existingState = await db.cardStates.get(card.stateId);
        const baseState = existingState ?? {
          id: card.stateId,
          cardId: card.wordId,
          due: now,
          stability: 0,
          difficulty: 0,
          reviews: 0,
          lapses: 0,
          updatedAt: now,
          deleted: false,
        };

        const result = calculateNextReview(baseState, rating, now);

        await db.transaction('rw', [db.reviews, db.cardStates], async () => {
          await db.reviews.add({
            id: crypto.randomUUID(),
            cardId: card.wordId,
            rating,
            timestamp: now,
            timeSpent,
          });

          await db.cardStates.put({
            ...baseState,
            ...result.state,
            id: card.stateId,
            cardId: card.wordId,
            updatedAt: now,
            deleted: false,
          });
        });

        setSessionHistory((prev) => [
          {
            wordId: card.wordId,
            hanzi: card.hanzi,
            pinyin: card.pinyin,
            translation: card.translation,
            rating,
            scheduledDays: Math.round(result.scheduledDays),
            timestamp: now,
          },
          ...prev,
        ]);

        setTodayDone((n) => n + 1);
        setCurrentIndex((i) => i + 1);
      } catch (err) {
        console.error('submitReview error:', err);
      }
    },
    [currentIndex, sessionCards]
  );

  const currentCard = sessionCards[currentIndex] ?? null;
  const hasMore = currentIndex < sessionCards.length;
  const progress = sessionCards.length > 0
    ? Math.round((currentIndex / sessionCards.length) * 100)
    : 0;

  return {
    sessionCards,
    currentCard,
    currentIndex,
    hasMore,
    progress,
    isLoading,
    todayDone,
    dailyGoal,
    totalInSession: sessionCards.length,
    sessionHistory,
    statsSummary,
    submitReview,
    reload: () => loadSession(false),
    practiceMore: () => loadSession(true),
  };
}

