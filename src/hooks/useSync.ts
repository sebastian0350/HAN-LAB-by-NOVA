// Синхронизация с Supabase — упрощённая версия
// Синхронизирует cardStates и favorites

import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../db/schema';
import type { User } from '@supabase/supabase-js';

export function useSync(user: User | null) {
  const syncDown = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      // Скачиваем избранное с сервера
      const { data: favs } = await supabase
        .from('favorites')
        .select('word_id, added_at')
        .eq('user_id', user.id);

      if (favs) {
        await db.transaction('rw', db.favorites, async () => {
          for (const f of favs) {
            await db.favorites.put({ id: f.word_id, addedAt: new Date(f.added_at) });
          }
        });
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) void syncDown();
  }, [user, syncDown]);

  return { syncDown };
}
