import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/schema';
import { DICTIONARY } from '../data/dictionary';

export function useProgress() {
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [reviewedWords, setReviewedWords] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [reviews, states, settings] = await Promise.all([
        db.reviews.toArray(),
        db.cardStates.toArray(),
        db.settings.get('main'),
      ]);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayReviews = reviews.filter((r) => new Date(r.timestamp) >= startOfToday);
      setTodayCount(todayReviews.length);
      setTotalWords(DICTIONARY.length);
      setReviewedWords(states.filter((s) => !s.deleted && s.reviews > 0).length);
      setDailyGoal(settings?.dailyGoal ?? 10);

      // Серия дней
      const days = new Set(
        reviews.map((r) => {
          const d = new Date(r.timestamp);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return { todayCount, streak, totalWords, reviewedWords, dailyGoal, loading, refresh };
}
