import { Flashcard, FlashcardRating } from '../types';
import { addDaysToDateKey, daysBetweenDateKeys, toLocalDateKey } from './dateUtils';

export interface SM2Result {
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  masteryLevel: Flashcard['masteryLevel'];
}

/**
 * SuperMemo SM-2 Spaced Repetition Scheduling Algorithm
 * Rate mapping:
 * Rating grades follow SM-2: again = 1, hard = 3, good = 4, easy = 5.
 * The first two successful reviews use one and six days respectively.
 */
export function calculateSM2(
  card: Pick<Flashcard, 'intervalDays' | 'repetitionCount' | 'easeFactor'>,
  rating: FlashcardRating,
  reviewedAt: Date = new Date()
): SM2Result {
  let { intervalDays, repetitionCount, easeFactor } = card;
  if (
    !Number.isInteger(intervalDays) || intervalDays < 0 ||
    !Number.isInteger(repetitionCount) || repetitionCount < 0 ||
    !Number.isFinite(easeFactor) || easeFactor < 1.3 ||
    Number.isNaN(reviewedAt.getTime())
  ) {
    throw new RangeError('Invalid flashcard review state.');
  }

  const gradeMap: Record<FlashcardRating, number> = {
    again: 1,
    hard: 3,
    good: 4,
    easy: 5
  };
  const q = gradeMap[rating];
  if (q === undefined) throw new RangeError('Unsupported flashcard rating.');

  if (q < 3) {
    // Failed recall
    repetitionCount = 0;
    intervalDays = 1;
  } else {
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionCount += 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewDate = addDaysToDateKey(toLocalDateKey(reviewedAt), intervalDays);

  // Derive mastery stage
  let masteryLevel: Flashcard['masteryLevel'] = 'learning';
  if (repetitionCount === 0) {
    masteryLevel = 'new';
  } else if (intervalDays >= 21) {
    masteryLevel = 'mastered';
  } else if (intervalDays >= 6) {
    masteryLevel = 'review';
  }

  return {
    intervalDays,
    repetitionCount,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate,
    masteryLevel
  };
}

export function isCardDueToday(nextReviewDate: string): boolean {
  return daysBetweenDateKeys(nextReviewDate, nextReviewDate) !== null
    && nextReviewDate <= toLocalDateKey();
}
