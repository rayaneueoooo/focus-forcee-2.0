import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MistakeCategory } from '../../types';
import { addDaysToDateKey, toLocalDateKey } from '../../utils/dateUtils';

interface AddMistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMistakeModal: React.FC<AddMistakeModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addMistake, t, profile } = useApp();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topicId, setTopicId] = useState('');
  const [question, setQuestion] = useState('');
  const [attemptedAnswer, setAttemptedAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [category, setCategory] = useState<MistakeCategory>('calc_error');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);

  if (!isOpen) return null;

  const currentSubject = subjects.find(s => s.id === subjectId);
  const allTopics = currentSubject?.chapters.flatMap(ch => ch.topics) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !correctAnswer.trim() || !subjectId) return;

    // Review scheduled for tomorrow
    addMistake({
      subjectId,
      topicId: topicId || undefined,
      chapterTitle: currentSubject ? (profile.preferredLanguage === 'ar' ? currentSubject.nameAr : currentSubject.nameFr) : undefined,
      question: question.trim(),
      attemptedAnswer: attemptedAnswer.trim(),
      correctAnswer: correctAnswer.trim(),
      category,
      explanation: explanation.trim(),
      difficulty,
      nextReviewDate: addDaysToDateKey(toLocalDateKey(), 1)
    });

    onClose();
    setQuestion('');
    setAttemptedAnswer('');
    setCorrectAnswer('');
    setExplanation('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {t('vaultAddMistake')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block font-bold text-theme-text mb-1">
                {t('vaultCategory')} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MistakeCategory)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                <option value="concept">{t('vaultCatConcept')}</option>
                <option value="formula">{t('vaultCatFormula')}</option>
                <option value="calc_error">{t('vaultCatCalc')}</option>
                <option value="misread">{t('vaultCatMisread')}</option>
                <option value="memorization">{t('vaultCatMemorization')}</option>
                <option value="time_management">{t('vaultCatTime')}</option>
                <option value="careless">{t('vaultCatCareless')}</option>
              </select>
            </div>
          </div>

          {/* Question Prompt */}
          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('vaultQuestion')} *
            </label>
            <textarea
              required
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="نص السؤال أو التمرين الذي ارتكبت فيه الخطأ..."
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            />
          </div>

          {/* Attempted Answer */}
          <div>
            <label className="block font-bold text-rose-600 dark:text-rose-400 mb-1">
              {t('vaultAttemptedAnswer')}
            </label>
            <textarea
              rows={2}
              value={attemptedAnswer}
              onChange={(e) => setAttemptedAnswer(e.target.value)}
              placeholder="كيف أجبت وما الفكرة الخاطئة التي خطرت ببالك؟"
              className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 text-theme-text focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              {t('vaultCorrectAnswer')} *
            </label>
            <textarea
              required
              rows={2}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="الحل النموذجي الصحيح والقانون الصحيح المعتمد..."
              className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-theme-text focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Explanation / Personal Lesson */}
          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('vaultExplanation')} *
            </label>
            <input
              type="text"
              required
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="مثال: تنبيه في ورقة المسودة: تأكد دائماً من شروط تطبيق القانون..."
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
