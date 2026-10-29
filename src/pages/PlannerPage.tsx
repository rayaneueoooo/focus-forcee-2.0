import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Sparkles, 
  Play, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  CalendarDays,
  ListFilter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyTask, TaskType } from '../types';
import { addDaysToDateKey, toLocalDateKey } from '../utils/dateUtils';

interface PlannerPageProps {
  onOpenAddTask: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ onOpenAddTask }) => {
  const { 
    tasks, 
    subjects, 
    toggleTaskCompletion, 
    deleteTask, 
    updateTask, 
    rebalanceTasks, 
    setActiveTab, 
    t, 
    profile 
  } = useApp();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'all'>('daily');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + currentDateOffset);
  const targetDateStr = toLocalDateKey(targetDate);

  // Filter tasks based on view & filters
  const filteredTasks = tasks.filter(task => {
    if (selectedSubjectFilter !== 'all' && task.subjectId !== selectedSubjectFilter) return false;
    if (selectedTypeFilter !== 'all' && task.type !== selectedTypeFilter) return false;

    if (viewMode === 'daily') {
      return task.scheduledDate === targetDateStr;
    } else if (viewMode === 'weekly') {
      // Current week tasks (targetDate +/- 3 days)
      const taskD = new Date(task.scheduledDate).getTime();
      const currD = targetDate.getTime();
      const diffDays = Math.abs((taskD - currD) / (1000 * 3600 * 24));
      return diffDays <= 3;
    }
    return true; // 'all'
  });

  const handlePostpone = (taskId: string) => {
    updateTask(taskId, {
      scheduledDate: addDaysToDateKey(toLocalDateKey(), 1),
      recommendedReason: 'تم تأجيلها ليوم غد بناءً على رغبتك'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Rebalance Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-theme-primary" />
            {t('plannerTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('plannerSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Smart Rebalance Button */}
          <button
            onClick={() => {
              rebalanceTasks();
              alert('تمت إعادة موازنة جدولك الذكي بنجاح وفق ساعات فراغك الحقيقية!');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold transition"
            title={t('plannerRebalanceDesc')}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('plannerRebalance')}</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md shadow-theme-primary/20 hover:bg-theme-primary-hover active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('plannerAddTask')}</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-theme-card p-3 rounded-2xl border border-theme-border shadow-subtle">
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-theme-card-hover p-1 rounded-xl border border-theme-border/60">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'daily' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('plannerViewDaily')}
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'weekly' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('plannerViewWeekly')}
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'all' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('all')}
          </button>
        </div>

        {/* Date Navigator for Daily/Weekly */}
        {viewMode !== 'all' && (
          <div className="flex items-center gap-2 text-xs font-bold text-theme-text">
            <button
              onClick={() => setCurrentDateOffset(prev => prev - 1)}
              className="p-1.5 rounded-lg border border-theme-border hover:bg-theme-card-hover transition"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <span className="px-2">
              {currentDateOffset === 0 
                ? t('today') 
                : currentDateOffset === 1 
                ? t('tomorrow') 
                : currentDateOffset === -1 
                ? t('yesterday') 
                : targetDateStr}
            </span>

            <button
              onClick={() => setCurrentDateOffset(prev => prev + 1)}
              className="p-1.5 rounded-lg border border-theme-border hover:bg-theme-card-hover transition"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="all">كل المواد</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="all">كل الأنشطة</option>
            <option value="exercise">{t('plannerTypeExercise')}</option>
            <option value="lesson">{t('plannerTypeLesson')}</option>
            <option value="memorization">{t('plannerTypeMemorization')}</option>
            <option value="revision">{t('plannerTypeRevision')}</option>
            <option value="mock_exam">{t('plannerTypeMockExam')}</option>
            <option value="mistake_review">{t('plannerTypeMistakeReview')}</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isDone = task.status === 'completed';
            const subj = subjects.find(s => s.id === task.subjectId);
            return (
              <div
                key={task.id}
                className={`
                  p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                  ${isDone 
                    ? 'bg-theme-card-hover/40 border-theme-border opacity-70' 
                    : 'bg-theme-card border-theme-border hover:border-theme-primary/40 shadow-card'}
                `}
              >
                {/* Left Side: Checkbox & Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 text-theme-muted hover:text-theme-primary transition flex-shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {subj && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-primary/15">
                          {profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr}
                        </span>
                      )}

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-card-hover text-theme-muted border border-theme-border font-medium">
                        {task.type}
                      </span>

                      {task.priority === 'high' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                          {t('plannerPriorityHigh')}
                        </span>
                      )}

                      <span className="text-[10px] text-theme-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes} {t('minutes')}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-theme-muted line-clamp-2">
                        {task.notes}
                      </p>
                    )}

                    {task.recommendedReason && (
                      <p className="text-[11px] text-theme-primary/90 italic flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {task.recommendedReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-theme-border w-full sm:w-auto justify-end">
                  {!isDone && (
                    <>
                      <button
                        onClick={() => handlePostpone(task.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover text-[11px] font-semibold transition"
                        title="تأجيل إلى الغد"
                      >
                        تأجيل للغد
                      </button>

                      <button
                        onClick={() => setActiveTab('focus-room')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-sm hover:bg-theme-primary-hover active:scale-95 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{t('start')}</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-xl text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-theme-border p-12 text-center space-y-3 bg-theme-card/50">
            <CalendarDays className="w-10 h-10 text-theme-muted mx-auto opacity-50" />
            <p className="text-sm font-semibold text-theme-muted">{t('plannerEmpty')}</p>
            <button
              onClick={onOpenAddTask}
              className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow hover:bg-theme-primary-hover transition"
            >
              {t('plannerAddTask')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
