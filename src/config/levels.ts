// Конфигурация уровней HSK и программ обучения
// Базовая версия без точных дат из официальных материалов CTI

export interface HSKLevel {
  id: number;
  name: string;
  description: string;
  wordsCount: number;
  grammarTopics: string[];
}

export interface LearningProgram {
  id: string;
  name: string;
  description: string;
  levels: number[];
  year?: number;
}

export const HSK_LEVELS: HSKLevel[] = [
  {
    id: 1,
    name: 'HSK 1',
    description: 'Базовый уровень: 150 слов',
    wordsCount: 150,
    grammarTopics: ['Простые предложения', 'Вопросы', 'Числительные', 'Время'],
  },
  {
    id: 2,
    name: 'HSK 2',
    description: 'Элементарный уровень: 300 слов',
    wordsCount: 300,
    grammarTopics: ['Сложные предложения', 'Модальные глаголы', 'Направления'],
  },
  {
    id: 3,
    name: 'HSK 3',
    description: 'Средний уровень: 600 слов',
    wordsCount: 600,
    grammarTopics: ['Сравнения', 'Пассивный залог', 'Условные предложения'],
  },
  {
    id: 4,
    name: 'HSK 4',
    description: 'Средне-продвинутый: 1200 слов',
    wordsCount: 1200,
    grammarTopics: ['Причинно-следственные связи', 'Эмфатические конструкции'],
  },
  {
    id: 5,
    name: 'HSK 5',
    description: 'Продвинутый уровень: 2500 слов',
    wordsCount: 2500,
    grammarTopics: ['Сложные союзы', 'Идиоматические выражения'],
  },
  {
    id: 6,
    name: 'HSK 6',
    description: 'Высокий уровень: 5000+ слов',
    wordsCount: 5000,
    grammarTopics: ['Официальный стиль', 'Абстрактные понятия'],
  },
  {
    id: 7,
    name: 'HSK 7-9 (Advanced)',
    description: 'Профессиональный уровень: 11000+ слов',
    wordsCount: 11000,
    grammarTopics: ['Академический язык', 'Специализированная лексика'],
  },
  {
    id: 8,
    name: 'HSK 7-9 (Proficient)',
    description: 'Свободное владение',
    wordsCount: 11000,
    grammarTopics: ['Литературный язык', 'Классические конструкции'],
  },
  {
    id: 9,
    name: 'HSK 7-9 (Near-native)',
    description: 'Близкий к носителю',
    wordsCount: 11000,
    grammarTopics: ['Разговорные диалекты', 'Культурный контекст'],
  },
];

export const LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: 'hsk-2.0',
    name: 'HSK 2.0 (классический)',
    description: 'Классическая программа HSK до 2021 года (6 уровней)',
    levels: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'hsk-3.0-2021',
    name: 'HSK 3.0 (2021)',
    description: 'Обновлённая программа HSK 3.0 (9 уровней)',
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    year: 2021,
  },
  {
    id: 'hsk-3.0-2026',
    name: 'HSK 3.0 (2026)',
    description: 'Актуальная программа HSK 3.0 (9 уровней)',
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    year: 2026,
  },
];

export const SKILL_CATEGORIES = {
  VOCABULARY: 'vocabulary',
  GRAMMAR: 'grammar',
  TONES: 'tones',
  LISTENING: 'listening',
  READING: 'reading',
} as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];
