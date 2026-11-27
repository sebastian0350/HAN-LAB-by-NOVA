import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/schema';
import { supabase } from '../lib/supabase';

export function useFavorites(userId?: string) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const favs = await db.favorites.toArray();
    setFavoriteIds(new Set(favs.map((f) => f.id)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (wordId: string) => {
      const isFav = favoriteIds.has(wordId);
      if (isFav) {
        await db.favorites.delete(wordId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(wordId);
          return next;
        });
        // Sync to Supabase
        if (supabase && userId) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('word_id', wordId);
        }
      } else {
        await db.favorites.put({ id: wordId, addedAt: new Date() });
        setFavoriteIds((prev) => new Set([...prev, wordId]));
        // Sync to Supabase
        if (supabase && userId) {
          await supabase
            .from('favorites')
            .upsert({ user_id: userId, word_id: wordId, added_at: new Date().toISOString() });
        }
      }
    },
    [favoriteIds, userId]
  );

  const isFavorite = useCallback(
    (wordId: string) => favoriteIds.has(wordId),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggle, loading, refresh };
}
