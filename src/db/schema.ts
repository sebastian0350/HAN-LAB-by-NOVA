// Схема IndexedDB с Dexie (local-first) — поддержка программ HSK 2.0 / 3.0 и расширенного словаря

import Dexie, { type Table } from 'dexie';
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
  id: string;
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
  id: string;
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
  autoSpeak: boolean;
  mascotEnabled: boolean;
  dailyGoal: number;
  newCardsPerDay: number;
  currentHsk: 1 | 2 | 3 | 4 | 5 | 6;
  learningProgram: 'hsk-2.0' | 'hsk-3.0' | 'from-scratch';
  startingLevel: 1 | 2 | 3 | 4 | 5 | 6;
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
  dailyGoal: 15,
  newCardsPerDay: 15,
  currentHsk: 1,
  learningProgram: 'hsk-3.0',
  startingLevel: 1,
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
      });

    this.version(4)
      .stores({
        cards: 'id, hanzi, level, category, updatedAt',
        cardStates: 'id, due, updatedAt, deleted',
        favorites: 'id, addedAt',
        reviews: 'id, cardId, timestamp',
        toneAttempts: 'id, hanzi, timestamp',
        settings: 'id',
        notes: 'id, cardId, createdAt, updatedAt, deleted',
      });
  }
}

export const db = new HanLabDatabase();

let initPromise: Promise<void> | null = null;

export function initializeDatabase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await db.open();

      await db.transaction('rw', [db.cards, db.cardStates, db.settings], async () => {
        let settings = await db.settings.get('main');
        if (!settings) {
          settings = { ...DEFAULT_APP_SETTINGS, updatedAt: new Date() };
          await db.settings.put(settings);
        } else {
          if (!(settings as any).learningProgram) {
            (settings as any).learningProgram = 'hsk-3.0';
            (settings as any).startingLevel = (settings as any).currentHsk || 1;
            await db.settings.put(settings as Settings);
          }
        }

        // Загружаем HSK 1–3 по умолчанию (гораздо больше слов)
        const maxLevel = Math.max(3, settings.currentHsk || 1);

        const existingCards = await db.cards.toArray();
        const existingCardIds = new Set(existingCards.map((c) => c.id));
        const now = new Date();

        const wordsToLoad = DICTIONARY.filter((w) => w.hsk <= maxLevel);

        const newCards: Card[] = [];
        for (const w of wordsToLoad) {
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

        const existingStates = await db.cardStates.toArray();
        const existingStateIds = new Set(existingStates.map((s) => s.id));

        const statesToAdd: CardState[] = [];
        for (const w of wordsToLoad) {
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

export async function resetAllProgress(): Promise<void> {
  const now = new Date();
  const settings = await db.settings.get('main');
  const maxLevel = Math.max(3, settings?.currentHsk || 1);
  const wordsToLoad = DICTIONARY.filter((w) => w.hsk <= maxLevel);

  await db.transaction('rw', [db.cardStates, db.reviews, db.toneAttempts, db.notes], async () => {
    await db.reviews.clear();
    await db.toneAttempts.clear();
    await db.notes.clear();
    await db.cardStates.clear();

    const initialStates: CardState[] = wordsToLoad.map((w) => ({
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
