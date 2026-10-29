import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Subject, 
  StudyTask, 
  Mistake, 
  Flashcard, 
  FocusSession, 
  PracticeAttempt, 
  BACExamResource, 
  NoteItem, 
  Language, 
  ThemeId, 
  BacStreamId, 
  FlashcardRating,
  TopicStatus
} from '../types';
import { getInitialSubjectsForStream, BAC_STREAMS } from '../utils/curriculumData';
import { translations } from '../utils/translations';
import { applyThemeTokens } from '../utils/themes';
import { calculateSM2 } from '../utils/spacedRepetition';
import { rebalanceStudyPlan } from '../utils/adaptiveScheduler';
import { addDaysToDateKey, daysBetweenDateKeys, toLocalDateKey } from '../utils/dateUtils';

interface AppContextType {
  // Profile & settings
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (themeId: ThemeId) => void;
  toggleDarkMode: () => void;
  setCustomAccent: (color: string) => void;
  completeOnboarding: (streamId: BacStreamId, targetAverage: number, name?: string) => void;

  // Subjects & Curriculum
  subjects: Subject[];
  setStreamAndReloadSubjects: (streamId: BacStreamId) => void;
  updateTopicStatus: (subjectId: string, topicId: string, status: TopicStatus) => void;
  updateTopicDifficulty: (subjectId: string, topicId: string, difficulty: 1 | 2 | 3 | 4 | 5, isDifficult: boolean) => void;
  addCustomTopic: (subjectId: string, chapterId: string, title: string) => void;
  updateSubjectCoefficient: (subjectId: string, coeff: number) => void;

  // Tasks & Planner
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  rebalanceTasks: () => void;

  // Mistake Vault
  mistakes: Mistake[];
  addMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'attemptsCount' | 'isResolved'>) => void;
  updateMistake: (id: string, updates: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;
  markMistakeResolved: (id: string, resolved: boolean) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'intervalDays' | 'repetitionCount' | 'easeFactor' | 'nextReviewDate' | 'masteryLevel'>) => void;
  reviewFlashcard: (id: string, rating: FlashcardRating) => void;
  deleteFlashcard: (id: string) => void;

  // Focus Sessions
  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, 'id'>) => void;

  // Practice Lab
  practiceAttempts: PracticeAttempt[];
  logPracticeAttempt: (attempt: Omit<PracticeAttempt, 'id'>) => void;
  examResources: BACExamResource[];
  addExamResource: (resource: Omit<BACExamResource, 'id'>) => void;

  // Notes
  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rescuePrefillSubjectId?: string;
  setRescuePrefillSubjectId: (id?: string) => void;

  // Utilities
  t: (key: string) => string;
  exportAllData: () => void;
  importAllData: (jsonData: string) => Promise<boolean>;
  resetAllData: () => void;
}

const STORAGE_KEY = 'focus_force_v2_state';

const initialProfile: UserProfile = {
  name: '',
  streamId: 'sciences_exp',
  targetAverage: 16.50,
  examDate: '',
  availableHoursByDay: {
    sunday: 4,
    monday: 3.5,
    tuesday: 3.5,
    wednesday: 4,
    thursday: 4,
    friday: 6,
    saturday: 6
  },
  preferredLanguage: 'ar',
  preferredTheme: 'cherry-cream',
  isDarkMode: false,
  hasCompletedOnboarding: false,
  gamificationEnabled: true,
  quotesEnabled: true,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  longBreakMinutes: 15,
  streakCount: 0,
  lastActiveDate: '',
  streakFreezeAvailable: 0
};

const initialSampleTasks: StudyTask[] = [
  {
    id: 't-1',
    title: 'حل التمرينين 3 و 4 في تركيب البروتين واستخراج الآليات',
    subjectId: 'snv_sci',
    topicId: 'snv_t1',
    type: 'exercise',
    priority: 'high',
    estimatedMinutes: 45,
    scheduledDate: toLocalDateKey(),
    scheduledTime: '17:00',
    deadline: toLocalDateKey(),
    status: 'pending',
    difficulty: 4,
    notes: 'التركيز على مرحلة الترجمة ودور ARNt',
    recommendedReason: 'معامل المادة 6 وموضوع مهم في البكالوريا'
  },
  {
    id: 't-2',
    title: 'مراجعة اشتقاقية الدوال الأسية وتطبيقات المماس',
    subjectId: 'math_sci',
    topicId: 'm_t3',
    type: 'lesson',
    priority: 'high',
    estimatedMinutes: 50,
    scheduledDate: toLocalDateKey(),
    scheduledTime: '18:30',
    status: 'pending',
    difficulty: 3,
    recommendedReason: 'مدرج في أولويات جدول اليوم'
  },
  {
    id: 't-3',
    title: 'حفظ تواريخ الوحدة الأولى في التاريخ ومصطلحات الحرب الباردة',
    subjectId: 'hg_sci',
    topicId: 'hg_t1',
    type: 'memorization',
    priority: 'medium',
    estimatedMinutes: 30,
    scheduledDate: toLocalDateKey(),
    scheduledTime: '20:00',
    status: 'pending',
    difficulty: 2,
    recommendedReason: 'مراجعة متباعدة دورية لتثبيت الذاكرة'
  }
];

const initialSampleMistakes: Mistake[] = [
  {
    id: 'm-1',
    question: 'في المتتاليات: حساب المجموع S = u0 + u1 + ... + un لمتتالية هندسية أساسها q=1/2',
    attemptedAnswer: 'طبقت القانون مباشرة ونسيت أن عدد الحدود هو (n + 1) وليس n وحدها',
    correctAnswer: 'القانون الصحيح: S = الحد الأول × [(1 - q^(n+1)) / (1 - q)]. عدد الحدود هو (دليل النهاية - دليل البداية + 1)',
    subjectId: 'math_sci',
    topicId: 'm_t6',
    chapterTitle: 'المتتاليات العددية',
    category: 'calc_error',
    explanation: 'تنبيه دائم في ورقة المسودة: تحقق فوراً من عدد الحدود قبل تعويض الأس في قانون المجموع.',
    difficulty: 3,
    nextReviewDate: toLocalDateKey(),
    isResolved: false,
    attemptsCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'm-2',
    question: 'في المناعة: ما الفرق الجوهري بين استجابة الـ LB والـ LTc؟',
    attemptedAnswer: 'خلطت بين آلية عمل الأجسام المضادة المفرزة وبين السمية الخلوية المباشرة للبيرفورين والغرانزيم',
    correctAnswer: 'الـ LB تنتج أجساماً مضادة نوعية تبطل مفعول المستضد وتشكل معقداً مناعياً، بينما الـ LTc تفرز البيرفورين والإنزيمات لحل غشاء الخلية المصابة مباشرة',
    subjectId: 'snv_sci',
    topicId: 'snv_t8',
    chapterTitle: 'المناعة والدفاع عن الذات',
    category: 'concept',
    explanation: 'رسم مخطط مقارنة ثنائي يوضح مسار الإقصاء الخلطي مقابل المسار الخلوي.',
    difficulty: 4,
    nextReviewDate: toLocalDateKey(),
    isResolved: false,
    attemptsCount: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const initialSampleFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    subjectId: 'math_sci',
    topicId: 'm_t3',
    type: 'formula',
    front: 'مشتقة الدالة الأسية المركبة (e^u(x))’ تساوي؟',
    back: '(e^u(x))’ = u’(x) * e^u(x)',
    intervalDays: 1,
    repetitionCount: 1,
    easeFactor: 2.5,
    nextReviewDate: toLocalDateKey(),
    masteryLevel: 'learning'
  },
  {
    id: 'fc-2',
    subjectId: 'hg_sci',
    topicId: 'hg_t1',
    type: 'date_fact',
    front: 'ما تاريخ إعلان مبدأ ترومان ومضمونه المقتضب؟',
    back: '12 مارس 1947: مساعدة مالية وعسكرية أمريكية لليونان وتركيا لمحاصرة المد الشيوعي السوفياتي.',
    intervalDays: 1,
    repetitionCount: 2,
    easeFactor: 2.6,
    nextReviewDate: toLocalDateKey(),
    masteryLevel: 'review'
  },
  {
    id: 'fc-3',
    subjectId: 'snv_sci',
    topicId: 'snv_t1',
    type: 'definition',
    front: 'ما هو دور إنزيم ARN بوليميراز في عملية الاستنساخ؟',
    back: 'التعرف على إشارة بداية المورثة، كسر الروابط الهيدروجينية، وقراءة السلسلة الناسخة لتركيب سلسلة ARNm المتكاملة.',
    intervalDays: 3,
    repetitionCount: 3,
    easeFactor: 2.5,
    nextReviewDate: toLocalDateKey(),
    masteryLevel: 'review'
  }
];

const initialSampleResources: BACExamResource[] = [
  {
    id: 'bac-2024-snv',
    year: 2024,
    streamId: 'sciences_exp',
    subjectId: 'snv_sci',
    session: 'principal',
    title: 'موضوع بكالوريا 2024 دورة جوان - علوم الطبيعة والحياة',
    description: 'الموضوع الأول: تركيب البروتين ودور الإنزيمات + الموضوع الثاني: المناعة والاتصال العصبي',
    linkOrFile: 'https://dzexams.com/bac/sciences-experimentales/sciences-naturelles',
    solutionNotes: 'مرفق بالتنقيط المفصل لشبكة التقييم وسلم العلامات الرسمي من وزارة التربية',
    isOfficialVerified: true,
    isDemoSample: false
  },
  {
    id: 'bac-2024-math',
    year: 2024,
    streamId: 'sciences_exp',
    subjectId: 'math_sci',
    session: 'principal',
    title: 'موضوع بكالوريا 2024 دورة جوان - الرياضيات',
    description: 'المسألة الشاملة في الدوال العددية، المتتاليات، والاحتمالات',
    linkOrFile: 'https://dzexams.com/bac/sciences-experimentales/mathematiques',
    solutionNotes: 'حل نموذجي كامل ومفصل مع الطرق البديلة المعتمدة',
    isOfficialVerified: true,
    isDemoSample: false
  },
  {
    id: 'bac-demo-sample',
    year: 2023,
    streamId: 'sciences_exp',
    subjectId: 'phys_sci',
    session: 'principal',
    title: '[نموذج توضيحي] بنك تمارين الفيزياء المجمعة لميكانيك نيوتن',
    description: 'تمارين مختارة من مختلف الدورات مع مراجعة حركة الأقمار والقذائف',
    linkOrFile: '#demo',
    solutionNotes: 'نموذج تجريبي مهيأ لتجربة منصة FOCUS & FORCE ويمكنك إضافة روابطك الخاصة',
    isOfficialVerified: false,
    isDemoSample: true
  }
];

const initialSampleNotes: NoteItem[] = [
  {
    id: 'n-1',
    title: 'خريطة ذهنية لقواعد إعراب إذا وحينئذ ولولا',
    subjectId: 'arab_sci',
    content: 'إذا الفجائية (حرف لا محل له)، إذا التفسيرية، إذا الظرفية الشرطية غير الجازمة.\nحينئذ: ظرف زمان مبني في محل نصب مضاف إلى جملة محذوفة عوض عنها بالتنوين.',
    tags: ['لغة عربية', 'قواعد', 'بكالوريا'],
    isPinned: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'n-2',
    title: 'ملخص ثوابت الميكانيك والسرعة الحدية Vl',
    subjectId: 'phys_sci',
    content: 'عند السقوط الشاقولي الحقيقي بوجود قوة الاحتكاك f = -kv:\nالمعادلة التفاضلية: dv/dt + (k/m)v = g(1 - ro_f/ro_s)\nفي النظام الدائم dv/dt = 0 ومنها Vl = (mg / k) * (1 - ro_f/ro_s)',
    tags: ['فيزياء', 'قوانين نيوتن'],
    isPinned: false,
    updatedAt: new Date().toISOString()
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_subjects');
      return saved ? JSON.parse(saved) : getInitialSubjectsForStream(initialProfile.streamId);
    } catch {
      return getInitialSubjectsForStream(initialProfile.streamId);
    }
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mistakes, setMistakes] = useState<Mistake[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_flashcards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_focus');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_practice');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [examResources, setExamResources] = useState<BACExamResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_resources');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTabState] = useState<string>('mission-control');
  const setActiveTab = (tab: string) => {
    if (tab === activeTab) return;
    const viewDocument = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };
    if (!viewDocument.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveTabState(tab);
      return;
    }
    try {
      const transition = viewDocument.startViewTransition(() => setActiveTabState(tab));
      void transition.finished.catch(error => console.warn('Page transition failed:', error));
    } catch (error) {
      console.warn('Page transition is unavailable:', error);
      setActiveTabState(tab);
    }
  };
  const [rescuePrefillSubjectId, setRescuePrefillSubjectId] = useState<string | undefined>(undefined);

  // Synchronize profile theme & language with HTML root
  useEffect(() => {
    applyThemeTokens(profile.preferredTheme, profile.isDarkMode, profile.customAccentColor);
    document.documentElement.lang = profile.preferredLanguage;
    document.documentElement.dir = profile.preferredLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [profile.preferredTheme, profile.isDarkMode, profile.preferredLanguage, profile.customAccentColor]);

  // Persist each collection on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_focus', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_practice', JSON.stringify(practiceAttempts));
  }, [practiceAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_resources', JSON.stringify(examResources));
  }, [examResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_notes', JSON.stringify(notes));
  }, [notes]);

  // Translation helper
  const t = (key: string): string => {
    const lang = profile.preferredLanguage || 'ar';
    const dict = translations[lang] as Record<string, string>;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English, then Arabic
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) return enDict[key];
    const arDict = translations.ar as Record<string, string>;
    return arDict[key] || key;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const recordStudyActivity = () => {
    const today = toLocalDateKey();
    setProfile(previous => {
      if (previous.lastActiveDate === today) return previous;
      const daysSincePreviousActivity = daysBetweenDateKeys(previous.lastActiveDate, today);
      return {
        ...previous,
        streakCount: daysSincePreviousActivity === 1 ? previous.streakCount + 1 : 1,
        lastActiveDate: today
      };
    });
  };

  const setLanguage = (lang: Language) => {
    updateProfile({ preferredLanguage: lang });
  };

  const setTheme = (themeId: ThemeId) => {
    updateProfile({ preferredTheme: themeId });
  };

  const toggleDarkMode = () => {
    updateProfile({ isDarkMode: !profile.isDarkMode });
  };

  const setCustomAccent = (color: string) => {
    updateProfile({ customAccentColor: color });
  };

  const completeOnboarding = (streamId: BacStreamId, targetAverage: number, name?: string) => {
    const newSubjects = getInitialSubjectsForStream(streamId);
    setSubjects(newSubjects);
    updateProfile({
      streamId,
      targetAverage,
      name: name?.trim() || profile.name,
      hasCompletedOnboarding: true
    });
  };

  const setStreamAndReloadSubjects = (streamId: BacStreamId) => {
    const newSubjects = getInitialSubjectsForStream(streamId);
    setSubjects(newSubjects);
    updateProfile({ streamId });
  };

  const updateTopicStatus = (subjectId: string, topicId: string, status: TopicStatus) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedChapters = s.chapters.map(ch => ({
        ...ch,
        topics: ch.topics.map(tp => tp.id === topicId ? { ...tp, status, lastRevisedDate: toLocalDateKey() } : tp)
      }));
      return { ...s, chapters: updatedChapters };
    }));
  };

  const updateTopicDifficulty = (subjectId: string, topicId: string, difficulty: 1 | 2 | 3 | 4 | 5, isDifficult: boolean) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedChapters = s.chapters.map(ch => ({
        ...ch,
        topics: ch.topics.map(tp => tp.id === topicId ? { ...tp, difficulty, isDifficult } : tp)
      }));
      return { ...s, chapters: updatedChapters };
    }));
  };

  const addCustomTopic = (subjectId: string, chapterId: string, title: string) => {
    const newTopic = {
      id: 'tp_' + Date.now(),
      titleAr: title,
      titleFr: title,
      titleEn: title,
      status: 'not_started' as TopicStatus,
      difficulty: 3 as const,
      isDifficult: false
    };
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedChapters = s.chapters.map(ch => {
        if (ch.id === chapterId) {
          return { ...ch, topics: [...ch.topics, newTopic] };
        }
        return ch;
      });
      return { ...s, chapters: updatedChapters };
    }));
  };

  const updateSubjectCoefficient = (subjectId: string, coeff: number) => {
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, coefficient: coeff } : s));
  };

  const addTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: 'task_' + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<StudyTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(item => item.id === id);
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
        return { ...t, status: nextStatus, completedAt };
      }
      return t;
    }));
    if (task && task.status !== 'completed') recordStudyActivity();
  };

  const rebalanceTasks = () => {
    const rebalanced = rebalanceStudyPlan(tasks, profile.availableHoursByDay);
    setTasks(rebalanced);
  };

  const addMistake = (mistake: Omit<Mistake, 'id' | 'createdAt' | 'attemptsCount' | 'isResolved'>) => {
    const newMistake: Mistake = {
      ...mistake,
      id: 'mst_' + Date.now(),
      createdAt: new Date().toISOString(),
      attemptsCount: 1,
      isResolved: false
    };
    setMistakes(prev => [newMistake, ...prev]);
  };

  const updateMistake = (id: string, updates: Partial<Mistake>) => {
    setMistakes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMistake = (id: string) => {
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const markMistakeResolved = (id: string, resolved: boolean) => {
    setMistakes(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          isResolved: resolved,
          attemptsCount: m.attemptsCount + 1,
          lastReviewedAt: new Date().toISOString()
        };
      }
      return m;
    }));
  };

  const addFlashcard = (card: Omit<Flashcard, 'id' | 'intervalDays' | 'repetitionCount' | 'easeFactor' | 'nextReviewDate' | 'masteryLevel'>) => {
    const newCard: Flashcard = {
      ...card,
      id: 'fc_' + Date.now(),
      intervalDays: 1,
      repetitionCount: 0,
      easeFactor: 2.5,
      nextReviewDate: toLocalDateKey(),
      masteryLevel: 'new'
    };
    setFlashcards(prev => [newCard, ...prev]);
  };

  const reviewFlashcard = (id: string, rating: FlashcardRating) => {
    setFlashcards(prev => prev.map(c => {
      if (c.id === id) {
        const sm2 = calculateSM2(c, rating);
        return {
          ...c,
          ...sm2,
          lastReviewedDate: toLocalDateKey()
        };
      }
      return c;
    }));
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  const logFocusSession = (session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: 'fcs_' + Date.now()
    };
    setFocusSessions(prev => [newSession, ...prev]);

    recordStudyActivity();
  };

  const logPracticeAttempt = (attempt: Omit<PracticeAttempt, 'id'>) => {
    const newAttempt: PracticeAttempt = {
      ...attempt,
      id: 'prc_' + Date.now()
    };
    setPracticeAttempts(prev => [newAttempt, ...prev]);
  };

  const addExamResource = (resource: Omit<BACExamResource, 'id'>) => {
    const newRes: BACExamResource = {
      ...resource,
      id: 'res_' + Date.now()
    };
    setExamResources(prev => [newRes, ...prev]);
  };

  const addNote = (note: Omit<NoteItem, 'id' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...note,
      id: 'not_' + Date.now(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<NoteItem>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const exportAllData = () => {
    const fullBackup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      subjects,
      tasks,
      mistakes,
      flashcards,
      focusSessions,
      practiceAttempts,
      examResources,
      notes
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus_force_bac_backup_${toLocalDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAllData = async (jsonData: string): Promise<boolean> => {
    const { parseBackup } = await import('../utils/backupValidation');
    const data = parseBackup(jsonData);
    if (!data) return false;
    setProfile(data.profile);
    setSubjects(data.subjects);
    setTasks(data.tasks);
    setMistakes(data.mistakes);
    setFlashcards(data.flashcards);
    setFocusSessions(data.focusSessions);
    setPracticeAttempts(data.practiceAttempts);
    setExamResources(data.examResources);
    setNotes(data.notes);
    return true;
  };

  const resetAllData = () => {
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (key?.startsWith(STORAGE_KEY) || key === 'focus_force_pro_timer') {
        localStorage.removeItem(key);
      }
    }
    setProfile(initialProfile);
    setSubjects(getInitialSubjectsForStream(initialProfile.streamId));
    setTasks([]);
    setMistakes([]);
    setFlashcards([]);
    setFocusSessions([]);
    setPracticeAttempts([]);
    setExamResources([]);
    setNotes([]);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        setLanguage,
        setTheme,
        toggleDarkMode,
        setCustomAccent,
        completeOnboarding,
        subjects,
        setStreamAndReloadSubjects,
        updateTopicStatus,
        updateTopicDifficulty,
        addCustomTopic,
        updateSubjectCoefficient,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        rebalanceTasks,
        mistakes,
        addMistake,
        updateMistake,
        deleteMistake,
        markMistakeResolved,
        flashcards,
        addFlashcard,
        reviewFlashcard,
        deleteFlashcard,
        focusSessions,
        logFocusSession,
        practiceAttempts,
        logPracticeAttempt,
        examResources,
        addExamResource,
        notes,
        addNote,
        updateNote,
        deleteNote,
        activeTab,
        setActiveTab,
        rescuePrefillSubjectId,
        setRescuePrefillSubjectId,
        t,
        exportAllData,
        importAllData,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
