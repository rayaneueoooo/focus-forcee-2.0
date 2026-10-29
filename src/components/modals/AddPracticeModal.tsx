import React, { useState } from 'react';
import { X, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toLocalDateKey } from '../../utils/dateUtils';

interface AddPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPracticeModal: React.FC<AddPracticeModalProps> = ({ isOpen, onClose }) => {
  const { subjects, logPracticeAttempt, t, profile } = useApp();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [correctQuestions, setCorrectQuestions] = useState(4);
  const [scoreOutOf20, setScoreOutOf20] = useState(16);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(45);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    logPracticeAttempt({
      subjectId,
      title: title.trim(),
      totalQuestions: Number(totalQuestions) || 1,
      correctQuestions: Number(correctQuestions) || 0,
      scoreOutOf20: Number(scoreOutOf20) || 10,
      timeSpentMinutes: Number(timeSpentMinutes) || 30,
      date: toLocalDateKey(),
      notes: notes.trim() || undefined,
      mistakesLoggedCount: 0
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
            <FlaskConical className="w-5 h-5 text-sky-500" />
            {t('practiceLogAttempt')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-theme-text mb-1">
              عنوان الاختبار / التمرين *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تمرين ميكانيك نيوتن - بكالوريا 2023 دورة جوان..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('plannerSelectSubject')} *
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {profile.preferredLanguage === 'ar' ? s.nameAr : profile.preferredLanguage === 'fr' ? s.nameFr : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('practiceScore')}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={scoreOutOf20}
                onChange={(e) => setScoreOutOf20(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('practiceTimeSpent')}
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                الأسئلة الصحيحة
              </label>
              <input
                type="number"
                min="0"
                value={correctQuestions}
                onChange={(e) => setCorrectQuestions(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-theme-text mb-1">
                إجمالي الأسئلة
              </label>
              <input
                type="number"
                min="1"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:border-theme-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-theme-text mb-1">
              ملاحظات التقييم الذاتي
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نقاط القوة، أو الأخطاء التي تم تسجيلها..."
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
