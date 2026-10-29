import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  Calendar, 
  Layers, 
  Zap, 
  PlusCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isCardDueToday } from '../utils/spacedRepetition';
import { daysBetweenDateKeys, localDateKeyFromTimestamp, toLocalDateKey } from '../utils/dateUtils';

interface MissionControlPageProps {
  onOpenAddTask: () => void;
  onOpenAddMistake: () => void;
  onOpenAddCard: () => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({
  onOpenAddTask,
  onOpenAddMistake,
  onOpenAddCard
}) => {
  const { 
    profile, 
    tasks, 
    subjects, 
    mistakes, 
    flashcards, 
    focusSessions, 
    toggleTaskCompletion, 
    setActiveTab, 
    t 
  } = useApp();

  const todayStr = toLocalDateKey();

  // Derive today's tasks
  const todayTasks = tasks.filter(t => t.scheduledDate === todayStr);
  const pendingTodayTasks = todayTasks.filter(t => t.status !== 'completed');
  const completedTodayTasks = todayTasks.filter(t => t.status === 'completed');

  // Next recommended task
  const nextTask = pendingTodayTasks[0] || tasks.find(t => t.status !== 'completed');

  // Focus time today (minutes)
  const todayFocusMinutes = focusSessions
    .filter(fs => localDateKeyFromTimestamp(fs.completedAt) === todayStr)
    .reduce((acc, curr) => acc + (curr.actualMinutes || 0), 0);

  // Due flashcards count
  const dueCardsCount = flashcards.filter(c => isCardDueToday(c.nextReviewDate)).length;

  // Unresolved mistakes
  const unresolvedMistakes = mistakes.filter(m => !m.isResolved).slice(0, 3);

  // Subject performance calculation (sort by confidence or practice)
  const sortedSubjects = subjects
    .filter(subject => subject.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);
  const strongestSubject = sortedSubjects[0];
  const weakestSubject = sortedSubjects[sortedSubjects.length - 1];

  // Days to BAC
  const daysRemaining = profile.examDate
    ? Math.max(0, daysBetweenDateKeys(todayStr, profile.examDate) ?? 0)
    : null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Greeting */}
      <div className="rounded-2xl bg-gradient-to-r from-theme-primary/10 via-theme-accent/5 to-transparent border border-theme-primary/20 p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-theme-primary">
              {t('brandBadge')}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary font-bold">
              {profile.streamId.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-theme-text font-sans">
            {profile.name ? `${t('mcGreeting')}، ${profile.name} 👋` : `${t('mcGreeting')} 👋`}
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted max-w-xl">
            {t('mcSubGreeting')}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('rescue-mode')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{t('rescueTitle')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Next Action Hero & Daily Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Action Priority Card (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-32 h-32 bg-theme-primary/5 rounded-bl-full rtl:rounded-bl-none rtl:rounded-br-full -z-0 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {t('mcNextActionTitle')}
              </span>
              {nextTask && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-theme-primary-light text-theme-primary font-semibold">
                  {nextTask.estimatedMinutes} {t('minutes')}
                </span>
              )}
            </div>

            {nextTask ? (
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                  {nextTask.title}
                </h3>
                {nextTask.recommendedReason && (
                  <p className="text-xs text-theme-muted bg-theme-card-hover/80 px-3 py-1.5 rounded-xl border border-theme-border/60 inline-block">
                    💡 {nextTask.recommendedReason}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-theme-text">{t('mcNoPendingTasks')}</p>
              </div>
            )}
          </div>

          <div className="pt-6 mt-4 border-t border-theme-border flex flex-wrap items-center justify-between gap-3 relative z-10">
            {nextTask ? (
              <button
                onClick={() => setActiveTab('focus-room')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-lg shadow-theme-primary/30 hover:bg-theme-primary-hover active:scale-95 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t('mcStartNextSession')}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddTask}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow hover:bg-theme-primary-hover transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('plannerAddTask')}</span>
              </button>
            )}

            <div className="flex items-center gap-4 text-xs text-theme-muted">
              <span>{completedTodayTasks.length} {t('mcTasksCompletedToday')}</span>
              <span>&bull;</span>
              <span>{todayFocusMinutes} {t('mcTotalFocusToday')}</span>
            </div>
          </div>
        </div>

        {/* Strategic Countdown & Velocity Card */}
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-theme-primary" />
              {t('mcCountdownTitle')}
            </span>

            <div className="text-center py-2 space-y-1">
              <div className="text-5xl font-black text-theme-primary tracking-tight font-sans">
                {daysRemaining ?? '—'}
              </div>
              <p className="text-xs text-theme-muted font-medium">
                {daysRemaining === null ? t('examDateNotSet') : t('dayRemaining')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-theme-primary-light/40 border border-theme-primary/15 text-xs text-theme-text space-y-1">
              <div className="flex justify-between font-bold">
                <span>{t('targetAverageLabel')}:</span>
                <span className="text-theme-primary">{profile.targetAverage.toFixed(2)}/20</span>
              </div>
              <div className="flex justify-between text-theme-muted text-[11px]">
                <span>{t('mcExamDateLabel')}:</span>
                <span>{profile.examDate || '—'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('bac-journey')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-theme-border hover:border-theme-primary text-theme-text text-xs font-semibold hover:bg-theme-card-hover transition"
          >
            <span>{t('navBacJourney')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Middle Row: Daily Mission Panel & Due Cards / Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Mission Panel (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm sm:text-base text-theme-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-theme-primary" />
                {t('mcDailyMissionTitle')}
              </h3>
              <p className="text-[11px] text-theme-muted">{t('mcDailyMissionDesc')}</p>
            </div>

            <button
              onClick={onOpenAddTask}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-theme-primary hover:bg-theme-primary-light transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('add')}</span>
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => {
                const isDone = task.status === 'completed';
                const subj = subjects.find(s => s.id === task.subjectId);
                return (
                  <div
                    key={task.id}
                    className={`
                      flex items-center justify-between p-3.5 rounded-xl border transition-all
                      ${isDone 
                        ? 'bg-theme-card-hover/40 border-theme-border opacity-70' 
                        : 'bg-theme-card border-theme-border hover:border-theme-primary/40 shadow-subtle'}
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="text-theme-muted hover:text-theme-primary transition flex-shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <span className={`block text-xs font-bold truncate ${isDone ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-theme-muted mt-0.5">
                          {subj && (
                            <span className="font-semibold text-theme-primary">
                              {profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr}
                            </span>
                          )}
                          <span>&bull;</span>
                          <span>{task.estimatedMinutes} {t('minutes')}</span>
                          {task.priority === 'high' && (
                            <>
                              <span>&bull;</span>
                              <span className="text-rose-500 font-bold">{t('plannerPriorityHigh')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isDone && (
                      <button
                        onClick={() => setActiveTab('focus-room')}
                        className="p-2 rounded-lg text-theme-primary hover:bg-theme-primary-light transition flex-shrink-0"
                        title={t('navFocusRoom')}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-theme-muted text-xs space-y-2">
                <p>{t('plannerEmpty')}</p>
                <button
                  onClick={onOpenAddTask}
                  className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold"
                >
                  {t('plannerAddTask')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Strengths & Weaknesses / Mistakes Waiting */}
        <div className="space-y-6">
          {/* Strengths & High Priority Subjects */}
          <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-5 space-y-3">
            <span className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-theme-primary" />
              {t('mcStrengthsWeaknesses')}
            </span>

            <div className="space-y-2 text-xs">
              {strongestSubject && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">{t('mcStrongest')}</span>
                    <span className="font-bold text-theme-text">
                      {profile.preferredLanguage === 'ar' ? strongestSubject.nameAr : strongestSubject.nameFr}
                    </span>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{strongestSubject.confidence}%</span>
                </div>
              )}

              {weakestSubject && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">{t('mcNeedsFocus')}</span>
                    <span className="font-bold text-theme-text">
                      {profile.preferredLanguage === 'ar' ? weakestSubject.nameAr : weakestSubject.nameFr}
                    </span>
                  </div>
                  <span className="font-black text-rose-600 dark:text-rose-400">{weakestSubject.confidence}%</span>
                </div>
              )}
              {sortedSubjects.length === 0 && (
                <p className="rounded-xl border border-theme-border bg-theme-card-hover/50 p-3 text-theme-muted">
                  {t('mcNoPerformanceData')}
                </p>
              )}
            </div>
          </div>

          {/* Due Cards Shortcut */}
          <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                {t('flashcardsDueCount')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                {dueCardsCount}
              </span>
            </div>

            <p className="text-xs text-theme-muted">
              {dueCardsCount > 0 
                ? `لديك ${dueCardsCount} بطاقة حان موعد مراجعتها وفق منحنى النسيان لتثبيت المعلومات.`
                : 'رائع! لا توجد بطاقات مستحقة للمراجعة حالياً.'}
            </p>

            <button
              onClick={() => setActiveTab('spaced-repetition')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              {t('flashcardsStudyNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Mistakes Awaiting Review */}
      {unresolvedMistakes.length > 0 && (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm sm:text-base text-theme-text">
                {t('mcRecentMistakesToReview')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('mistake-vault')}
              className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
            >
              <span>{t('viewDetails')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unresolvedMistakes.map(m => {
              const subj = subjects.find(s => s.id === m.subjectId);
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('mistake-vault')}
                  className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 hover:border-rose-400 transition cursor-pointer space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 dark:text-rose-400 text-[11px]">
                      {subj ? (profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr) : ''}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
                      {m.category}
                    </span>
                  </div>
                  <p className="font-medium text-theme-text line-clamp-2">{m.question}</p>
                  <p className="text-[11px] text-theme-muted line-clamp-1 italic">
                    الدرس: {m.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
