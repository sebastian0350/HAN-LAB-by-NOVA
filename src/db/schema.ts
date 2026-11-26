// Схема IndexedDB с Dexie (local-first)

import Dexie, { type Table } from 'dexie';

export interface Card {
  id: string;
  hanzi: string;
  pinyin: string;
  tone: number;
  translation: string;
  level: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardState {
  id: string;
  cardId: string;
  due: Date;
  stability: number;
  difficulty: number;
  lastReview?: Date;
  reviews: number;
  lapses: number;
  updatedAt: Date;
  deleted: boolean;
}

export interface Review {
  id: string;
  cardId: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  timestamp: Date;
  timeSpent: number; // в миллисекундах
}

export interface ToneAttempt {
  id: string;
  hanzi: string;
  targetTone: number;
  detectedTone: number;
  accuracy: number;
  f0Trace?: number[]; // контур тона (сворачивается через 30 дней)
  timestamp: Date;
}

export interface DiagnosticResult {
  id: string;
  vocabularyLevel: number;
  grammarLevel: number;
  toneAccuracy: number;
  overallLevel: number;
  timestamp: Date;
  answers: Array<{ question: string; correct: boolean; timeSpent: number }>;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  mascotEnabled: boolean;
  hanziFont: 'sans' | 'serif';
  dailyGoal: number;
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

export interface SyncCursor {
  id: string;
  lastSyncAt: Date;
  serverUpdatedAt: Date;
}

export class HanLabDatabase extends Dexie {
  cards!: Table<Card>;
  cardStates!: Table<CardState>;
  reviews!: Table<Review>;
  toneAttempts!: Table<ToneAttempt>;
  diagnosticResults!: Table<DiagnosticResult>;
  settings!: Table<Settings>;
  notes!: Table<Note>;
  syncCursors!: Table<SyncCursor>;

  constructor() {
    super('HanLabDB');
    this.version(1).stores({
      cards: 'id, hanzi, level, tags, createdAt, updatedAt',
      cardStates: 'id, cardId, due, updatedAt, deleted',
      reviews: 'id, cardId, timestamp',
      toneAttempts: 'id, hanzi, timestamp',
      diagnosticResults: 'id, timestamp',
      settings: 'id, updatedAt',
      notes: 'id, cardId, createdAt, updatedAt, deleted',
      syncCursors: 'id',
    });
  }
}

export const db = new HanLabDatabase();
