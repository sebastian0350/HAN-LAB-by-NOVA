// FSRS (Free Spaced Repetition Scheduler) - алгоритм интервального повторения
// Реализация базовой версии

export interface CardState {
  id: string;
  due: Date;
  stability: number;
  difficulty: number;
  lastReview?: Date;
  reviews: number;
  lapses: number;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewResult {
  state: CardState;
  scheduledDays: number;
}

// Параметры FSRS (базовые значения)
const FSRS_PARAMS = {
  requestRetention: 0.9, // Желаемая сохранность (90%)
  maximumInterval: 36500, // Максимальный интервал (100 лет)
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
};

// Веса для оценки
const RATING_WEIGHTS = {
  again: 0,
  hard: 1,
  good: 2,
  easy: 3,
};

/**
 * Вычисляет следующий интервал повторения на основе текущего состояния и оценки
 */
export function calculateNextReview(
  state: CardState,
  rating: ReviewRating,
  now: Date = new Date()
): ReviewResult {
  const r = RATING_WEIGHTS[rating];
  
  // Новая карточка
  if (state.reviews === 0) {
    const stability = initStability(r);
    const difficulty = initDifficulty(r);
    
    return {
      state: {
        ...state,
        due: new Date(now.getTime() + getInitialInterval(r) * 24 * 60 * 60 * 1000),
        stability,
        difficulty,
        lastReview: now,
        reviews: 1,
        lapses: rating === 'again' ? 1 : 0,
      },
      scheduledDays: getInitialInterval(r),
    };
  }

  // Повторение
  let newStability = state.stability;
  let newDifficulty = state.difficulty;
  let lapses = state.lapses;

  if (rating === 'again') {
    // Карточка забыта - сброс
    newStability = initStability(r);
    newDifficulty = Math.min(10, state.difficulty + 2);
    lapses += 1;
  } else {
    // Карточка вспомнена - обновление стабильности
    newStability = nextStability(state.difficulty, state.stability, r);
    newDifficulty = nextDifficulty(state.difficulty, r);
  }

  const interval = nextInterval(newStability);
  const due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    state: {
      ...state,
      due,
      stability: newStability,
      difficulty: newDifficulty,
      lastReview: now,
      reviews: state.reviews + 1,
      lapses,
    },
    scheduledDays: interval,
  };
}

/**
 * Начальная стабильность для новой карточки
 */
function initStability(r: number): number {
  return Math.max(0.1, FSRS_PARAMS.w[r] - 0.5);
}

/**
 * Начальная сложность
 */
function initDifficulty(r: number): number {
  return Math.min(10, FSRS_PARAMS.w[4] - 0.5 + (r - 2) * 0.1);
}

/**
 * Следующая стабильность
 */
function nextStability(difficulty: number, stability: number, r: number): number {
  const hardPenalty = r === 1 ? 0.8 : 1;
  const easyBonus = r === 3 ? 1.3 : 1;
  const nextS = stability * (1 + FSRS_PARAMS.w[6] * (11 - difficulty) * FSRS_PARAMS.w[r] * hardPenalty * easyBonus);
  return Math.max(0.1, nextS);
}

/**
 * Следующая сложность
 */
function nextDifficulty(difficulty: number, r: number): number {
  const nextD = difficulty - FSRS_PARAMS.w[5] * (r - 2);
  return Math.min(10, Math.max(1, nextD));
}

/**
 * Следующий интервал в днях
 */
function nextInterval(stability: number): number {
  const newInterval = stability * 9 * (1 / FSRS_PARAMS.requestRetention - 1);
  return Math.min(FSRS_PARAMS.maximumInterval, Math.max(1, newInterval));
}

/**
 * Начальный интервал в днях
 */
function getInitialInterval(r: number): number {
  if (r === 0) return 1; // again
  if (r === 1) return 2; // hard
  if (r === 2) return 3; // good
  return 4; // easy
}

/**
 * Получает карточки, которые нужно повторить сейчас
 */
export function getDueCards(cards: CardState[], now: Date = new Date()): CardState[] {
  return cards.filter(card => card.due <= now);
}

/**
 * Пересчитывает состояние карточки из журнала отзывов
 * Используется для синхронизации и разрешения конфликтов
 */
export function recalculateCardFromReviews(
  reviews: Array<{ rating: ReviewRating; timestamp: Date }>
): CardState {
  const initialState: CardState = {
    id: '',
    due: new Date(),
    stability: 0,
    difficulty: 0,
    reviews: 0,
    lapses: 0,
  };

  // Сортируем отзывы по времени
  const sortedReviews = [...reviews].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  let state = initialState;
  for (const review of sortedReviews) {
    const result = calculateNextReview(state, review.rating, review.timestamp);
    state = result.state;
  }

  return state;
}
