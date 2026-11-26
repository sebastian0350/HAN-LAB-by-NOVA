import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../db/schema';
import { CardState, Review, Settings, Note, DiagnosticResult, ToneAttempt } from '../db/schema';

export function useSync(userId: string | null) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId || !supabase) {
      setSyncStatus('idle');
      return;
    }

    syncData();
  }, [userId]);

  const syncData = async () => {
    if (!userId || !supabase) return;

    setSyncStatus('syncing');

    try {
      // Получаем курсор последней синхронизации
      const cursor = await db.syncCursors.get('main');
      const lastServerUpdate = cursor?.serverUpdatedAt || new Date(0);

      // Загружаем изменения с сервера
      const { data: serverChanges, error } = await supabase
        .from('sync_records')
        .select('*')
        .eq('user_id', userId)
        .gt('server_updated_at', lastServerUpdate.toISOString())
        .order('server_updated_at', { ascending: true });

      if (error) throw error;

      // Применяем изменения с сервера
      if (serverChanges) {
        for (const record of serverChanges) {
          if (record.deleted) {
            // Мягкое удаление
            switch (record.kind) {
              case 'card':
                await db.cardStates.update(record.id, { deleted: true });
                break;
              case 'review':
                await db.reviews.delete(record.id);
                break;
              case 'settings':
                await db.settings.delete(record.id);
                break;
              case 'note':
                await db.notes.update(record.id, { deleted: true });
                break;
            }
          } else {
            // Upsert
            switch (record.kind) {
              case 'card':
                await db.cardStates.put({ ...record.data, id: record.id });
                break;
              case 'review':
                await db.reviews.put({ ...record.data, id: record.id });
                break;
              case 'settings':
                await db.settings.put({ ...record.data, id: record.id });
                break;
              case 'note':
                await db.notes.put({ ...record.data, id: record.id });
                break;
            }
          }
        }
      }

      // Отправляем локальные изменения на сервер
      await pushLocalChanges(userId);

      // Обновляем курсор
      const now = new Date();
      await db.syncCursors.put({
        id: 'main',
        lastSyncAt: now,
        serverUpdatedAt: now,
      });

      setLastSync(now);
      setSyncStatus('success');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const pushLocalChanges = async (userId: string) => {
    if (!supabase) return;

    const cursor = await db.syncCursors.get('main');
    const lastSync = cursor?.lastSyncAt || new Date(0);

    // Собираем локальные изменения
    const changes: any[] = [];

    // CardStates
    const changedCards = await db.cardStates
      .where('updatedAt')
      .above(lastSync)
      .toArray();
    for (const card of changedCards) {
      changes.push({
        user_id: userId,
        kind: 'card',
        id: card.id,
        data: card,
        updated_at: card.updatedAt.toISOString(),
        deleted: card.deleted,
      });
    }

    // Reviews
    const changedReviews = await db.reviews
      .where('timestamp')
      .above(lastSync)
      .toArray();
    for (const review of changedReviews) {
      changes.push({
        user_id: userId,
        kind: 'review',
        id: review.id,
        data: review,
        updated_at: review.timestamp.toISOString(),
        deleted: false,
      });
    }

    // Settings
    const changedSettings = await db.settings
      .where('updatedAt')
      .above(lastSync)
      .toArray();
    for (const setting of changedSettings) {
      changes.push({
        user_id: userId,
        kind: 'settings',
        id: setting.id,
        data: setting,
        updated_at: setting.updatedAt.toISOString(),
        deleted: false,
      });
    }

    // Отправляем пакетами до 200 записей
    const batchSize = 200;
    for (let i = 0; i < changes.length; i += batchSize) {
      const batch = changes.slice(i, i + batchSize);
      const { error } = await supabase.from('sync_records').upsert(batch);
      if (error) throw error;
    }
  };

  const exportData = async () => {
    const cards = await db.cards.toArray();
    const cardStates = await db.cardStates.toArray();
    const reviews = await db.reviews.toArray();
    const settings = await db.settings.toArray();
    const notes = await db.notes.toArray();

    return {
      cards,
      cardStates,
      reviews,
      settings,
      notes,
      exportedAt: new Date().toISOString(),
    };
  };

  return {
    syncStatus,
    lastSync,
    syncData,
    exportData,
  };
}
