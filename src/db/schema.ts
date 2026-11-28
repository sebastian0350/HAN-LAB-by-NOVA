// Схема IndexedDB с Dexie (local-first) — v2/v3 + инициализация 80 слов HSK1

import Dexie, { type Table } from 'dexie';
import { HSK1_WORDS } from '../data/hsk1';
import { DICTIONARY } from '../data/dictionary';

export interface Card {
  id: string;
  hanzi: string;
  pinyin: string;
  tone: number;
  tones: number[];
  translation: string;
  level: number;
  tags: string[];
  category?: string;
  example?: string;
  examplePinyin?: string;
  exampleRu?: string;
  mnemonic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardState {
  id: string;        // = wordId из dictionary / hsk1
  cardId?: string;
  due: Date;
  stability: number;
  difficulty: number;
  lastReview?: Date;
  reviews: number;
  lapses: number;
  updatedAt: Date;
  deleted: boolean;
}

export interface Favorite {
  id: string;        // = wordId
  addedAt: Date;
  note?: string;
}

export interface Review {
  id: string;
  cardId: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  timestamp: Date;
  timeSpent: number;
}

export interface ToneAttempt {
  id: string;
  hanzi: string;
  targetTone: number;
  detectedTone: number;
  accuracy: number;
  f0Trace?: number[];
  timestamp: Date;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  autoSpeak: boolean;       // авто-озвучка карточки
  mascotEnabled: boolean;
  dailyGoal: number;
  newCardsPerDay: number;
  currentHsk: 1 | 2 | 3 | 4;
  language: string;
  updatedAt: Date;
}

export interface Note {
  id: string;
  cardId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export type WordLearningStatus = 'new' | 'learning' | 'mastered';

/** Определяет статус изучения карточки на основе параметров FSRS */
export function getWordLearningStatus(state?: CardState | null): WordLearningStatus {
  if (!state || state.deleted || state.reviews === 0) {
    return 'new';
  }
  if (state.stability >= 1.8) {
    return 'mastered';
  }
  return 'learning';
}

export const DEFAULT_APP_SETTINGS: Settings = {
  id: 'main',
  theme: 'light',
  soundEnabled: true,
  autoSpeak: true,
  mascotEnabled: true,
  dailyGoal: 10,
  newCardsPerDay: 10,
  currentHsk: 1,
  language: 'ru',
  updatedAt: new Date(),
};

export class HanLabDatabase extends Dexie {
  cards!: Table<Card>;
  cardStates!: Table<CardState>;
  favorites!: Table<Favorite>;
  reviews!: Table<Review>;
  toneAttempts!: Table<ToneAttempt>;
  settings!: Table<Settings>;
  notes!: Table<Note>;

  constructor() {
    super('HanLabDB');
    this.version(2)
      .stores({
        cardStates: 'id, due, updatedAt, deleted',
        favorites: 'id, addedAt',
        reviews: 'id, cardId, timestamp',
        toneAttempts: 'id, hanzi, timestamp',
        settings: 'id',
        notes: 'id, cardId, createdAt, updatedAt, deleted',
      });

    this.version(3)
      .stores({
        cards: 'id, hanzi, level, category, updatedAt',
        cardStates: 'id, due, updatedAt, deleted',
        favorites: 'id, addedAt',
        reviews: 'id, cardId, timestamp',
        toneAttempts: 'id, hanzi, timestamp',
        settings: 'id',
        notes: 'id, cardId, createdAt, updatedAt, deleted',
      })
      .upgrade(async (tx) => {
        try {
          await tx.table('cardStates').toArray();
        } catch {
          // нет данных — ок
        }
      });
  }
}

export const db = new HanLabDatabase();

let initPromise: Promise<void> | null = null;

/**
 * Инициализирует IndexedDB при первом запуске:
 * - Загружает все 80 слов HSK1 в таблицу cards и создаёт начальные состояния cardStates.
 * - Гарантирует отсутствие повторной загрузки одинаковых слов и сохранение прогресса.
 * - Создаёт настройки по умолчанию.
 */
export function initializeDatabase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await db.open();

      const validDictIds = new Set(DICTIONARY.map((w) => w.id));

      await db.transaction('rw', [db.cards, db.cardStates, db.settings], async () => {
        // 1. Настройки по умолчанию
        const existingSettings = await db.settings.get('main');
        if (!existingSettings) {
          await db.settings.put({
            ...DEFAULT_APP_SETTINGS,
            updatedAt: new Date(),
          });
        }

        // 2. Синхронизируем 80 слов HSK1 в таблицу cards без дублирования
        const existingCards = await db.cards.toArray();
        const existingCardIds = new Set(existingCards.map((c) => c.id));
        const now = new Date();

        const newCards: Card[] = [];
        for (const w of HSK1_WORDS) {
          if (!existingCardIds.has(w.id)) {
            newCards.push({
              id: w.id,
              hanzi: w.hanzi,
              pinyin: w.pinyin,
              tone: w.tones[0] ?? 0,
              tones: w.tones,
              translation: w.translation,
              level: w.hsk,
              tags: w.tags,
              category: w.category,
              example: w.example,
              examplePinyin: w.examplePinyin,
              exampleRu: w.exampleRu,
              mnemonic: w.mnemonic,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
        if (newCards.length > 0) {
          await db.cards.bulkPut(newCards);
        }

        // 3. Проверяем cardStates: удаляем неактуальные ID и добавляем недостающие из 80 слов HSK1
        const existingStates = await db.cardStates.toArray();
        const existingStateIds = new Set<string>();
        const staleStateIds: string[] = [];

        for (const st of existingStates) {
          if (!validDictIds.has(st.id)) {
            staleStateIds.push(st.id);
          } else {
            existingStateIds.add(st.id);
          }
        }

        if (staleStateIds.length > 0) {
          await db.cardStates.bulkDelete(staleStateIds);
        }

        const statesToAdd: CardState[] = [];
        for (const w of HSK1_WORDS) {
          if (!existingStateIds.has(w.id)) {
            statesToAdd.push({
              id: w.id,
              cardId: w.id,
              due: now,
              stability: 0,
              difficulty: 0,
              reviews: 0,
              lapses: 0,
              updatedAt: now,
              deleted: false,
            });
          }
        }

        if (statesToAdd.length > 0) {
          await db.cardStates.bulkPut(statesToAdd);
        }
      });
    } catch (error) {
      console.error('Ошибка инициализации базы данных IndexedDB:', error);
      initPromise = null;
    }
  })();

  return initPromise;
}

/** Сбрасывает весь учебный прогресс пользователя и восстанавливает 80 начальных карточек HSK1 */
export async function resetAllProgress(): Promise<void> {
  const now = new Date();
  await db.transaction('rw', [db.cardStates, db.reviews, db.toneAttempts, db.notes], async () => {
    await db.reviews.clear();
    await db.toneAttempts.clear();
    await db.notes.clear();
    await db.cardStates.clear();

    const initialStates: CardState[] = HSK1_WORDS.map((w) => ({
      id: w.id,
      cardId: w.id,
      due: now,
      stability: 0,
      difficulty: 0,
      reviews: 0,
      lapses: 0,
      updatedAt: now,
      deleted: false,
    }));

    await db.cardStates.bulkPut(initialStates);
  });
}

