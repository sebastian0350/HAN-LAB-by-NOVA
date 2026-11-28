import { useCallback, useEffect, useState } from 'react';
import { db, initializeDatabase, getWordLearningStatus, type Review } from '../db/schema';
import { HSK1_WORDS } from '../data/hsk1';
import { DICTIONARY } from '../data/dictionary';

export interface RecentReviewItem {
  id: string;
  cardId: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  rating: Review['rating'];
  timestamp: Date;
}

export function useProgress() {
  const [todayCount, setTodayCount] = useState(0);
  const [dueTodayCount, setDueTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalWords, setTotalWords] = useState(HSK1_WORDS.length);
  const [totalDictionaryWords, setTotalDictionaryWords] = useState(DICTIONARY.length);
  const [reviewedWords, setReviewedWords] = useState(0);
  const [masteredWords, setMasteredWords] = useState(0);
  const [learningWords, setLearningWords] = useState(0);
  const [newWords, setNewWords] = useState(HSK1_WORDS.length);
  const [totalReviews, setTotalReviews] = useState(0);
  const [toneAttemptsCount, setToneAttemptsCount] = useState(0);
  const [toneAvgAccuracy, setToneAvgAccuracy] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [mascotEnabled, setMascotEnabled] = useState(true);
  const [recentReviews, setRecentReviews] = useState<RecentReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      await initializeDatabase();

      const [reviews, states, cardsCount, toneAttempts, settings] = await Promise.all([
        db.reviews.toArray(),
        db.cardStates.toArray(),
        db.cards.count(),
        db.toneAttempts.toArray(),
        db.settings.get('main'),
      ]);

      const now = new Date();
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const activeStates = states.filter((s) => !s.deleted);
      const hsk1Ids = new Set(HSK1_WORDS.map((w) => w.id));
      const hsk1States = activeStates.filter((s) => hsk1Ids.has(s.id));

      // Количество слов в базе (80 слов HSK1)
      const dbWordsCount = cardsCount > 0 ? cardsCount : HSK1_WORDS.length;
      setTotalWords(dbWordsCount);
      setTotalDictionaryWords(DICTIONARY.length);

      // Повторено за сегодня
      const todayReviews = reviews.filter((r) => new Date(r.timestamp) >= startOfToday);
      setTodayCount(todayReviews.length);
      setTotalReviews(reviews.length);

      // Статусы карточек HSK1
      let mastered = 0;
      let learning = 0;
      let unseen = 0;
      let dueNow = 0;

      for (const st of hsk1States) {
        const status = getWordLearningStatus(st);
        if (status === 'mastered') mastered += 1;
        else if (status === 'learning') learning += 1;
        else unseen += 1;

        if (new Date(st.due) <= now || st.reviews === 0) {
          dueNow += 1;
        }
      }

      setMasteredWords(mastered);
      setLearningWords(learning);
      setNewWords(unseen);
      setReviewedWords(mastered + learning);
      setDueTodayCount(dueNow);

      const goal = settings?.dailyGoal ?? 10;
      setDailyGoal(goal);
      setMascotEnabled(settings?.mascotEnabled ?? true);

      // Статистика тонов
      setToneAttemptsCount(toneAttempts.length);
      if (toneAttempts.length > 0) {
        const avgAcc = Math.round(
          (toneAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / toneAttempts.length) * 100
        );
        setToneAvgAccuracy(avgAcc);
      } else {
        setToneAvgAccuracy(0);
      }

      // Недавние повторения
      const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const wordMap = new Map(DICTIONARY.map((w) => [w.id, w]));
      const recent: RecentReviewItem[] = [];
      for (const r of sortedReviews.slice(0, 10)) {
        const word = wordMap.get(r.cardId);
        if (word) {
          recent.push({
            id: r.id,
            cardId: r.cardId,
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            translation: word.translation,
            rating: r.rating,
            timestamp: new Date(r.timestamp),
          });
        }
      }
      setRecentReviews(recent);

      // Серия дней (учитываем и повторения карточек, и тренировки тонов)
      const activityDates = [
        ...reviews.map((r) => new Date(r.timestamp)),
        ...toneAttempts.map((t) => new Date(t.timestamp)),
      ];
      const days = new Set(
        activityDates.map((d) => {
          const copy = new Date(d);
          copy.setHours(0, 0, 0, 0);
          return copy.getTime();
        })
      );

      let streakCount = 0;
      const cursor = new Date();
      cursor.setHours(0, 0, 0, 0);
      if (!days.has(cursor.getTime())) {
        cursor.setDate(cursor.getDate() - 1);
      }
      while (days.has(cursor.getTime())) {
        streakCount += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      setStreak(streakCount);
    } catch (err) {
      console.error('Ошибка загрузки прогресса:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => {
        if (mounted) return refresh();
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [refresh]);

  return {
    todayCount,
    dueTodayCount,
    streak,
    totalWords,
    totalDictionaryWords,
    reviewedWords,
    masteredWords,
    learningWords,
    newWords,
    totalReviews,
    toneAttemptsCount,
    toneAvgAccuracy,
    dailyGoal,
    mascotEnabled,
    recentReviews,
    loading,
    refresh,
  };
}

