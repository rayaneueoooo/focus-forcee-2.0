import { StudyTask, Subject, UserProfile } from '../types';
import { addDaysToDateKey, toLocalDateKey } from './dateUtils';

export interface RescueMissionPlan {
  durationMinutes: number;
  subjectName: string;
  energyLevel: 'low' | 'normal' | 'high';
  activity: 'understand' | 'memorize' | 'practise' | 'mistakes';
  phase1: {
    title: string;
    durationMinutes: number;
    steps: string[];
  };
  phase2: {
    title: string;
    durationMinutes: number;
    steps: string[];
  };
  phase3: {
    title: string;
    durationMinutes: number;
    steps: string[];
  };
}

export function generateRescueMission(
  durationMinutes: number,
  subject: Subject,
  energy: 'low' | 'normal' | 'high',
  activity: 'understand' | 'memorize' | 'practise' | 'mistakes',
  lang: 'ar' | 'fr' | 'en' = 'ar'
): RescueMissionPlan {
  // Split time proportionally
  const p1Time = Math.max(2, Math.round(durationMinutes * 0.2));
  const p3Time = Math.max(3, Math.round(durationMinutes * 0.2));
  const p2Time = durationMinutes - p1Time - p3Time;

  const subjName = lang === 'ar' ? subject.nameAr : lang === 'fr' ? subject.nameFr : subject.nameEn;

  if (lang === 'fr') {
    return {
      durationMinutes,
      subjectName: subjName,
      energyLevel: energy,
      activity,
      phase1: {
        title: '1. Échauffement & Déclencheur',
        durationMinutes: p1Time,
        steps: [
          `Éloignez toute source de distraction et ouvrez votre support pour ${subjName}`,
          activity === 'mistakes' 
            ? 'Parcourez 2 ou 3 erreurs enregistrées sans regarder la solution immédiate'
            : 'Relisez attentivement la formule maîtresse ou le résumé clé du chapitre'
        ]
      },
      phase2: {
        title: '2. Cœur de Mission (Focus Profond)',
        durationMinutes: p2Time,
        steps: [
          activity === 'practise'
            ? 'Résolvez 1 ou 2 questions types chronométrées sans regarder la correction'
            : activity === 'memorize'
            ? 'Répétez activement à voix haute et transcrivez les définitions sur papier brouillon'
            : activity === 'mistakes'
            ? 'Refaites intégralement le calcul ou le raisonnement qui a causé l’erreur'
            : 'Décomposez le théorème ou le schéma fonctionnel étape par étape'
        ]
      },
      phase3: {
        title: '3. Rappel Actif & Clôture',
        durationMinutes: p3Time,
        steps: [
          'Fermez votre cours et notez 3 points essentiels retenus de mémoire',
          'Notez dans votre journal de bord ce que vous maîtrisez désormais'
        ]
      }
    };
  }

  if (lang === 'en') {
    return {
      durationMinutes,
      subjectName: subjName,
      energyLevel: energy,
      activity,
      phase1: {
        title: '1. Warm-up & Brain Primer',
        durationMinutes: p1Time,
        steps: [
          `Mute notifications and open your primary resource for ${subjName}`,
          activity === 'mistakes'
            ? 'Review the question prompt of 2 past mistakes without peeking at the answer'
            : 'Skim the core formula sheet or summary box of the target topic'
        ]
      },
      phase2: {
        title: '2. Core Sprint (Deep Work)',
        durationMinutes: p2Time,
        steps: [
          activity === 'practise'
            ? 'Solve 1-2 focused examination questions under strict time conditions'
            : activity === 'memorize'
            ? 'Active recall cycle: write definitions from memory on blank paper'
            : activity === 'mistakes'
            ? 'Re-attempt the exact exercise where you previously stumbled'
            : 'Deconstruct the tricky concept into elementary cause-and-effect rules'
        ]
      },
      phase3: {
        title: '3. Instant Active Recall & Reflection',
        durationMinutes: p3Time,
        steps: [
          'Close your notes: write down 3 key takeaways entirely from memory',
          'Log your progress and celebrate taking intentional action'
        ]
      }
    };
  }

  // Default Arabic
  return {
    durationMinutes,
    subjectName: subjName,
    energyLevel: energy,
    activity,
    phase1: {
      title: '1. التمهيد والتنشيط الذهني',
      durationMinutes: p1Time,
      steps: [
        `أغلق أي مشتتات وضع أمامك ملخص ${subjName} على مكتبك`,
        activity === 'mistakes'
          ? 'اقرأ نص سؤالين من بنك أخطائك دون النظر إلى الحل النموذجي'
          : 'اقرأ القوانين الأساسية أو التعريف المركزي للدرس لمدة وجيزة'
      ]
    },
    phase2: {
      title: '2. لب المهمة والتركيز التام',
      durationMinutes: p2Time,
      steps: [
        activity === 'practise'
          ? 'حل تمريناً نموذجياً واحداً أو مسألة مختارة بتركيز عالٍ مع ورقة وقلم'
          : activity === 'memorize'
          ? 'استرجاع نشط: اكتب المصطلحات والتواريخ غيباً على ورقة بيضاء'
          : activity === 'mistakes'
          ? 'أعد حل التمرين الذي أخطأت فيه سابقاً حتى الوصول للنتيجة الصحيحة'
          : 'فصل الفكرة المستعصية إلى خطوات منطقية مبسطة وافهم سبب كل خطوة'
      ]
    },
    phase3: {
      title: '3. اختبار الاسترجاع النشط الفوري',
      durationMinutes: p3Time,
      steps: [
        'أغلق الدفتر تماماً، واكتب 3 نقاط أو قوانين استوعبتها خلال الجلسة من ذاكرتك',
        'قيّم شعورك: لقد حولت وقتاً كان سيضيع إلى إنجاز أكاديمي ملموس!'
      ]
    }
  };
}

/**
 * Intelligent Schedule Rebalancer
 * Takes pending/overdue tasks and safely distributes them across upcoming 7 days
 * based on the student's actual declared daily available hours.
 */
export function rebalanceStudyPlan(
  tasks: StudyTask[],
  availableHoursByDay: UserProfile['availableHoursByDay']
): StudyTask[] {
  const today = new Date();
  const todayStr = toLocalDateKey(today);

  // Identify uncompleted tasks scheduled before or on today
  const overdueOrPending = tasks.filter(
    t => t.status !== 'completed' && t.scheduledDate <= todayStr
  );
  const futureTasks = tasks.filter(
    t => t.status === 'completed' || t.scheduledDate > todayStr
  );

  // Day name index mapping (0=Sunday to 6=Saturday)
  const dayKeys: (keyof UserProfile['availableHoursByDay'])[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];

  // Sort tasks by priority (high first), difficulty, and duration
  const sortedTasks = [...overdueOrPending].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return b.difficulty - a.difficulty;
  });

  // Track daily assigned minutes for the next 7 days
  const dailyAssignedMinutes: Record<string, number> = {};
  const dayCapacities: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const dateStr = addDaysToDateKey(todayStr, i);
    const d = new Date(`${dateStr}T00:00:00`);
    const dayName = dayKeys[d.getDay()];
    const maxHours = availableHoursByDay[dayName] || 3;
    dayCapacities[dateStr] = maxHours * 60; // minutes
    dailyAssignedMinutes[dateStr] = 0;
  }

  // Also account for existing future uncompleted tasks
  futureTasks.forEach(t => {
    if (t.status !== 'completed' && dailyAssignedMinutes[t.scheduledDate] !== undefined) {
      dailyAssignedMinutes[t.scheduledDate] += t.estimatedMinutes || 45;
    }
  });

  const rebalancedPendingTasks = sortedTasks.map(task => {
    const taskMinutes = task.estimatedMinutes || 45;
    let chosenDate = todayStr;

    // Find the first day within the next 7 days that has room
    for (let i = 0; i < 7; i++) {
      const dateStr = addDaysToDateKey(todayStr, i);
      const capacity = dayCapacities[dateStr] || 180;
      const currentLoad = dailyAssignedMinutes[dateStr] || 0;

      if (currentLoad + taskMinutes <= capacity) {
        chosenDate = dateStr;
        dailyAssignedMinutes[dateStr] = currentLoad + taskMinutes;
        break;
      }
    }

    return {
      ...task,
      scheduledDate: chosenDate,
      recommendedReason: chosenDate !== task.scheduledDate 
        ? 'تمت إعادة جدولتها تلقائياً وفق وقتك المتاح لتجنب الإرهاق'
        : task.recommendedReason
    };
  });

  return [...futureTasks, ...rebalancedPendingTasks];
}
