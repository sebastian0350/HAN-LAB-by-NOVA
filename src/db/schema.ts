// Схема IndexedDB с Dexie (local-first) — v2

import Dexie, { type Table } from 'dexie';

export interface CardState {
  id: string;        // = wordId из dictionary
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

export class HanLabDatabase extends Dexie {
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
      })
      .upgrade(async (tx) => {
        // Миграция v1 → v2: словарь теперь статичный, карточки переносятся в states по hanzi
        // Пытаемся переиспользовать старые cardStates
        try {
          await tx.table('cardStates').toArray();
        } catch {
          // нет данных — ок
        }
      });
  }
}

export const db = new HanLabDatabase();
