import React, { useState } from 'react';
import { X, Calendar, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskType, TaskPriority } from '../../types';
import { toLocalDateKey } from '../../utils/dateUtils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addTask, t, profile } = useApp();
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topicId, setTopicId] = useState('');
  const [type, setType] = useState<TaskType>('exercise');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [scheduledDate, setScheduledDate] = useState(toLocalDateKey());
  const [scheduledTime, setScheduledTime] = useState('17:00');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentSubject = subjects.find(s => s.id === subjectId);
  const allTopics = currentSubject?.chapters.flatMap(ch => ch.topics) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    addTask({
      title: title.trim(),
      subjectId,
      topicId: topicId || undefined,
      type,
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      status: 'pending',
      difficulty,
      notes: notes.trim() || undefined,
      recommendedReason: 'مهمة مخصصة أضافها الطالب'
    });

    onClose();
    setTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-theme-primary" />
            {t('plannerAddTask')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('plannerTaskTitle')} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: حل مسائل الدوران والأعداد المركبة..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            />
          </div>

          {/* Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerSelectSubject')} *
              </label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setTopicId('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {profile.preferredLanguage === 'ar' ? s.nameAr : profile.preferredLanguage === 'fr' ? s.nameFr : s.nameEn} (معامل {s.coefficient})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerSelectTopic')}
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                <option value="">-- اختياري --</option>
                {allTopics.map(tp => (
                  <option key={tp.id} value={tp.id}>
                    {profile.preferredLanguage === 'ar' ? tp.titleAr : profile.preferredLanguage === 'fr' ? tp.titleFr : tp.titleEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerTaskType')}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                <option value="exercise">{t('plannerTypeExercise')}</option>
                <option value="lesson">{t('plannerTypeLesson')}</option>
                <option value="memorization">{t('plannerTypeMemorization')}</option>
                <option value="revision">{t('plannerTypeRevision')}</option>
                <option value="mock_exam">{t('plannerTypeMockExam')}</option>
                <option value="mistake_review">{t('plannerTypeMistakeReview')}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerPriority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                <option value="high">{t('plannerPriorityHigh')}</option>
                <option value="medium">{t('plannerPriorityMed')}</option>
                <option value="low">{t('plannerPriorityLow')}</option>
              </select>
            </div>
          </div>

          {/* Estimated duration & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerDuration')}
              </label>
              <input
                type="number"
                min="10"
                max="240"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 45)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerScheduledDate')}
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('plannerScheduledTime')}
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              />
            </div>
          </div>

          {/* Difficulty Rating */}
          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('plannerDifficulty')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setDifficulty(lvl as 1 | 2 | 3 | 4 | 5)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${difficulty === lvl ? 'bg-theme-primary text-white border-theme-primary' : 'bg-theme-card text-theme-muted border-theme-border hover:bg-theme-card-hover'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('plannerNotes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="روابط أو تنبيهات إضافية..."
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover text-xs font-semibold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover active:scale-95 transition"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
