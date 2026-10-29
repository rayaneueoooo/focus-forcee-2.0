export type Language = 'ar' | 'fr' | 'en';

export type ThemeId = 
  | 'cherry-cream'
  | 'burgundy-prestige'
  | 'pink-cloud'
  | 'lavender-dream'
  | 'matcha-study'
  | 'ocean-calm'
  | 'midnight-focus'
  | 'minimal-ivory';

export type BacStreamId =
  | 'sciences_exp'
  | 'mathematiques'
  | 'technique_math_meca'
  | 'technique_math_civil'
  | 'technique_math_elec'
  | 'technique_math_procedes'
  | 'gestion_economie'
  | 'lettres_philo'
  | 'langues_etrangeres';

export interface BacStream {
  id: BacStreamId;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  badge: string;
}

export type TopicStatus = 
  | 'not_started' 
  | 'learning' 
  | 'practising' 
  | 'revising' 
  | 'tested' 
  | 'confident';

export interface Topic {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  status: TopicStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isDifficult: boolean;
  lastRevisedDate?: string; // ISO date
  notes?: string;
}

export interface SubjectChapter {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  order: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  streamId: BacStreamId;
  coefficient: number;
  icon: string;
  color: string;
  chapters: SubjectChapter[];
  confidence: number; // 0 to 100
  targetScore?: number; // out of 20
}

export type TaskType = 
  | 'lesson' 
  | 'exercise' 
  | 'memorization' 
  | 'revision' 
  | 'mock_exam' 
  | 'mistake_review';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'postponed';

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  topicId?: string;
  type: TaskType;
  priority: TaskPriority;
  estimatedMinutes: number;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  deadline?: string; // YYYY-MM-DD
  status: TaskStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  recommendedReason?: string;
  completedAt?: string;
}

export type MistakeCategory = 
  | 'concept' 
  | 'formula' 
  | 'calc_error' 
  | 'misread' 
  | 'memorization' 
  | 'time_management' 
  | 'careless';

export interface Mistake {
  id: string;
  question: string;
  attemptedAnswer: string;
  correctAnswer: string;
  subjectId: string;
  topicId?: string;
  chapterTitle?: string;
  category: MistakeCategory;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  nextReviewDate: string; // YYYY-MM-DD
  isResolved: boolean;
  attemptsCount: number;
  createdAt: string;
  lastReviewedAt?: string;
}

export type FlashcardType = 
  | 'qa' 
  | 'definition' 
  | 'formula' 
  | 'vocab' 
  | 'date_fact';

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId?: string;
  type: FlashcardType;
  front: string;
  back: string;
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  masteryLevel: 'new' | 'learning' | 'review' | 'mastered';
}

export interface FocusSession {
  id: string;
  subjectId: string;
  topicId?: string;
  durationMinutes: number;
  actualMinutes: number;
  type: 'pomodoro' | 'custom' | 'rescue';
  completedAt: string; // ISO string
  reflectionNote?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface PracticeAttempt {
  id: string;
  subjectId: string;
  topicId?: string;
  title: string;
  totalQuestions: number;
  correctQuestions: number;
  scoreOutOf20: number;
  timeSpentMinutes: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  mistakesLoggedCount: number;
}

export interface BACExamResource {
  id: string;
  year: number;
  streamId: BacStreamId;
  subjectId: string;
  session: 'principal' | 'rattrapage';
  title: string;
  description: string;
  linkOrFile: string;
  solutionNotes: string;
  isOfficialVerified: boolean;
  isDemoSample: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  subjectId: string;
  topicId?: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  streamId: BacStreamId;
  targetAverage: number; // e.g. 16.50
  examDate: string; // YYYY-MM-DD (e.g. 2027-06-06)
  availableHoursByDay: {
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
  };
  preferredLanguage: Language;
  preferredTheme: ThemeId;
  isDarkMode: boolean;
  customAccentColor?: string;
  hasCompletedOnboarding: boolean;
  gamificationEnabled: boolean;
  quotesEnabled: boolean;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  longBreakMinutes: number;
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakFreezeAvailable: number;
}

