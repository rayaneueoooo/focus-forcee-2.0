import { z } from 'zod';
import type {
  BACExamResource,
  Flashcard,
  FocusSession,
  Mistake,
  NoteItem,
  PracticeAttempt,
  StudyTask,
  Subject,
  UserProfile
} from '../types';
import { daysBetweenDateKeys } from './dateUtils';

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(value => daysBetweenDateKeys(value, value) !== null);
const optionalDateKey = dateKey.optional();
const difficulty = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5)
]);
const streamId = z.enum([
  'sciences_exp',
  'mathematiques',
  'technique_math_meca',
  'technique_math_civil',
  'technique_math_elec',
  'technique_math_procedes',
  'gestion_economie',
  'lettres_philo',
  'langues_etrangeres'
]);

const topicSchema = z.object({
  id: z.string().min(1),
  titleAr: z.string(),
  titleFr: z.string(),
  titleEn: z.string(),
  status: z.enum(['not_started', 'learning', 'practising', 'revising', 'tested', 'confident']),
  difficulty,
  isDifficult: z.boolean(),
  lastRevisedDate: optionalDateKey,
  notes: z.string().optional()
});

const backupSchema = z.object({
  version: z.literal('2.0.0'),
  exportedAt: z.string().datetime({ offset: true }),
  profile: z.object({
    name: z.string().max(120),
    streamId,
    targetAverage: z.number().min(0).max(20),
    examDate: dateKey.or(z.literal('')),
    availableHoursByDay: z.object({
      sunday: z.number().min(0).max(24),
      monday: z.number().min(0).max(24),
      tuesday: z.number().min(0).max(24),
      wednesday: z.number().min(0).max(24),
      thursday: z.number().min(0).max(24),
      friday: z.number().min(0).max(24),
      saturday: z.number().min(0).max(24)
    }),
    preferredLanguage: z.enum(['ar', 'fr', 'en']),
    preferredTheme: z.enum([
      'cherry-cream',
      'burgundy-prestige',
      'pink-cloud',
      'lavender-dream',
      'matcha-study',
      'ocean-calm',
      'midnight-focus',
      'minimal-ivory'
    ]),
    isDarkMode: z.boolean(),
    customAccentColor: z.string().regex(/^$|^#[\da-fA-F]{6}$/).optional(),
    hasCompletedOnboarding: z.boolean(),
    gamificationEnabled: z.boolean(),
    quotesEnabled: z.boolean(),
    pomodoroWorkMinutes: z.number().int().min(1).max(120),
    pomodoroBreakMinutes: z.number().int().min(1).max(30),
    longBreakMinutes: z.number().int().min(1).max(60),
    streakCount: z.number().int().min(0),
    lastActiveDate: dateKey.or(z.literal('')),
    streakFreezeAvailable: z.number().int().min(0)
  }),
  subjects: z.array(z.object({
    id: z.string().min(1),
    nameAr: z.string(),
    nameFr: z.string(),
    nameEn: z.string(),
    streamId,
    coefficient: z.number().positive(),
    icon: z.string(),
    color: z.string(),
    confidence: z.number().min(0).max(100),
    targetScore: z.number().min(0).max(20).optional(),
    chapters: z.array(z.object({
      id: z.string().min(1),
      titleAr: z.string(),
      titleFr: z.string(),
      titleEn: z.string(),
      order: z.number().int(),
      topics: z.array(topicSchema)
    }))
  })),
  tasks: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(200),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    type: z.enum(['lesson', 'exercise', 'memorization', 'revision', 'mock_exam', 'mistake_review']),
    priority: z.enum(['high', 'medium', 'low']),
    estimatedMinutes: z.number().int().positive(),
    scheduledDate: dateKey,
    scheduledTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    deadline: optionalDateKey,
    status: z.enum(['pending', 'in_progress', 'completed', 'postponed']),
    difficulty,
    notes: z.string().optional(),
    recommendedReason: z.string().optional(),
    completedAt: z.string().datetime({ offset: true }).optional()
  })),
  mistakes: z.array(z.object({
    id: z.string().min(1),
    question: z.string(),
    attemptedAnswer: z.string(),
    correctAnswer: z.string(),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    chapterTitle: z.string().optional(),
    category: z.enum(['concept', 'formula', 'calc_error', 'misread', 'memorization', 'time_management', 'careless']),
    explanation: z.string(),
    difficulty,
    nextReviewDate: dateKey,
    isResolved: z.boolean(),
    attemptsCount: z.number().int().min(0),
    createdAt: z.string().datetime({ offset: true }),
    lastReviewedAt: z.string().datetime({ offset: true }).optional()
  })),
  flashcards: z.array(z.object({
    id: z.string().min(1),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    type: z.enum(['qa', 'definition', 'formula', 'vocab', 'date_fact']),
    front: z.string().min(1),
    back: z.string().min(1),
    intervalDays: z.number().int().min(0),
    repetitionCount: z.number().int().min(0),
    easeFactor: z.number().min(1.3),
    nextReviewDate: dateKey,
    lastReviewedDate: optionalDateKey,
    masteryLevel: z.enum(['new', 'learning', 'review', 'mastered'])
  })),
  focusSessions: z.array(z.object({
    id: z.string().min(1),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    durationMinutes: z.number().int().positive(),
    actualMinutes: z.number().int().min(0),
    type: z.enum(['pomodoro', 'custom', 'rescue']),
    completedAt: z.string().datetime({ offset: true }),
    reflectionNote: z.string().optional(),
    rating: difficulty.optional()
  })),
  practiceAttempts: z.array(z.object({
    id: z.string().min(1),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    title: z.string().min(1),
    totalQuestions: z.number().int().positive(),
    correctQuestions: z.number().int().min(0),
    scoreOutOf20: z.number().min(0).max(20),
    timeSpentMinutes: z.number().int().min(0),
    date: dateKey,
    notes: z.string().optional(),
    mistakesLoggedCount: z.number().int().min(0)
  }).refine(attempt => attempt.correctQuestions <= attempt.totalQuestions)),
  examResources: z.array(z.object({
    id: z.string().min(1),
    year: z.number().int().min(1900).max(2200),
    streamId,
    subjectId: z.string().min(1),
    session: z.enum(['principal', 'rattrapage']),
    title: z.string(),
    description: z.string(),
    linkOrFile: z.string(),
    solutionNotes: z.string(),
    isOfficialVerified: z.boolean(),
    isDemoSample: z.boolean()
  })),
  notes: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    content: z.string(),
    tags: z.array(z.string()),
    isPinned: z.boolean(),
    updatedAt: z.string().datetime({ offset: true })
  }))
});

export interface AppBackup {
  version: '2.0.0';
  exportedAt: string;
  profile: UserProfile;
  subjects: Subject[];
  tasks: StudyTask[];
  mistakes: Mistake[];
  flashcards: Flashcard[];
  focusSessions: FocusSession[];
  practiceAttempts: PracticeAttempt[];
  examResources: BACExamResource[];
  notes: NoteItem[];
}

export function parseBackup(jsonData: string): AppBackup | null {
  try {
    const result = backupSchema.safeParse(JSON.parse(jsonData));
    return result.success ? result.data as AppBackup : null;
  } catch {
    return null;
  }
}
