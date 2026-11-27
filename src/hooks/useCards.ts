import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/schema';
import { calculateNextReview, type ReviewRating } from '../core/fsrs';
import { DICTIONARY, getWordsByHsk } from '../data/dictionary';
import { speakHanzi } from '../lib/speech';

const DEFAULT_SETTINGS = {
  dailyGoal: 10,
  newCardsPerDay: 5,
  currentHsk: 1 as const,
  autoSpeak: true,
};

/** Добавляет новые карточки из словаря, если ещё не введены */
async function ensureNewCards(hskLevel: 1 | 2 | 3 | 4, newPerDay: number) {
  const words = getWordsByHsk(hskLevel);
  const existingIds = new Set((await db.cardStates.toArray()).map((s) => s.id));

  // Слова, которые ещё не введены в обучение
  const unseen = words.filter((w) => !existingIds.has(w.id));
  const toAdd = unseen.slice(0, newPerDay);

  if (toAdd.length === 0) return;

  await db.transaction('rw', db.cardStates, async () => {
    for (const word of toAdd) {
      await db.cardStates.add({
        id: word.id,
        due: new Date(),
        stability: 0,
        difficulty: 0,
        reviews: 0,
        lapses: 0,
        updatedAt: new Date(),
        deleted: false,
      });
    }
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
  example?: string;
  examplePinyin?: string;
  exampleRu?: string;
  mnemonic?: string;
  stateId: string;
  isNew: boolean;
}

export function useCards() {
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDone, setTodayDone] = useState(0);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await db.settings.get('main');
      const hskLevel = (settings?.currentHsk ?? DEFAULT_SETTINGS.currentHsk) as 1 | 2 | 3 | 4;
      const newPerDay = settings?.newCardsPerDay ?? DEFAULT_SETTINGS.newCardsPerDay;
      const speak = settings?.autoSpeak ?? DEFAULT_SETTINGS.autoSpeak;
      setAutoSpeak(speak);

      await ensureNewCards(hskLevel, newPerDay);

      const allStates = await db.cardStates.toArray();
      const now = new Date();

      // Due-карточки: просроченные или новые (reviews === 0)
      const due = allStates.filter(
        (s) => !s.deleted && (new Date(s.due) <= now || s.reviews === 0)
      );

      // Собираем сессию (не больше dailyGoal)
      const dailyGoal = settings?.dailyGoal ?? DEFAULT_SETTINGS.dailyGoal;

      const cards: SessionCard[] = [];
      for (const state of due.slice(0, dailyGoal * 3)) {
        const word = DICTIONARY.find((w) => w.id === state.id);
        if (!word) continue;
        cards.push({
          wordId: word.id,
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          tones: word.tones,
          translation: word.translation,
          hsk: word.hsk,
          tags: word.tags,
          example: word.example,
          examplePinyin: word.examplePinyin,
          exampleRu: word.exampleRu,
          mnemonic: word.mnemonic,
          stateId: state.id,
          isNew: state.reviews === 0,
        });
        if (cards.length >= dailyGoal) break;
      }

      // Подсчёт сделанного сегодня
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayReviews = await db.reviews
        .where('timestamp')
        .above(startOfToday)
        .count();
      setTodayDone(todayReviews);

      setSessionCards(cards);
      setCurrentIndex(0);
    } catch (err) {
      console.error('useCards error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
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
        const state = await db.cardStates.get(card.stateId);
        if (!state) return;

        const result = calculateNextReview(state, rating);

        await db.reviews.add({
          id: crypto.randomUUID(),
          cardId: card.wordId,
          rating,
          timestamp: new Date(),
          timeSpent,
        });

        await db.cardStates.update(card.stateId, {
          ...result.state,
          updatedAt: new Date(),
        });

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
    totalInSession: sessionCards.length,
    submitReview,
    reload: loadSession,
  };
}
