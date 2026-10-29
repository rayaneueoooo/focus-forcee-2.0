import React, { useState } from 'react';
import { 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  Clock, 
  Filter, 
  ChevronDown, 
  Trash2, 
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MistakeCategory } from '../types';

interface MistakeVaultPageProps {
  onOpenAddMistake: () => void;
}

export const MistakeVaultPage: React.FC<MistakeVaultPageProps> = ({ onOpenAddMistake }) => {
  const { mistakes, subjects, markMistakeResolved, deleteMistake, profile, t } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const filteredMistakes = mistakes.filter(m => {
    if (selectedSubject !== 'all' && m.subjectId !== selectedSubject) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedStatus === 'pending' && m.isResolved) return false;
    if (selectedStatus === 'resolved' && !m.isResolved) return false;
    return true;
  });

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resolvedCount = mistakes.filter(m => m.isResolved).length;
  const resolutionRate = mistakes.length > 0 ? Math.round((resolvedCount / mistakes.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            {t('vaultTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('vaultSubtitle')}
          </p>
        </div>

        <button
          onClick={onOpenAddMistake}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('vaultAddMistake')}</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-theme-muted block">إجمالي الأخطاء المسجلة</span>
            <span className="text-2xl font-black text-theme-text font-sans">{mistakes.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-theme-primary/10 text-theme-primary">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-theme-muted block">أخطاء تم تجاوزها بالتطبيق</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">{resolvedCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-theme-muted block">نسبة الاستيعاب وتفادي الخطأ</span>
            <span className="text-2xl font-black text-theme-primary font-sans">{resolutionRate}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-theme-primary/10 text-theme-primary">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-card p-3 rounded-2xl border border-theme-border shadow-subtle text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-theme-card-hover p-1 rounded-xl border border-theme-border/60">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${selectedStatus === 'all' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${selectedStatus === 'pending' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('vaultStatusPending')}
          </button>
          <button
            onClick={() => setSelectedStatus('resolved')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${selectedStatus === 'resolved' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            {t('vaultStatusResolved')}
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="all">كل المواد</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="all">كل أسباب الأخطاء</option>
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

      {/* Mistakes List */}
      <div className="space-y-4">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map(m => {
            const subj = subjects.find(s => s.id === m.subjectId);
            const isRevealed = !!revealedSolutions[m.id];
            return (
              <div
                key={m.id}
                className={`
                  p-5 rounded-2xl border transition-all duration-200 space-y-4
                  ${m.isResolved 
                    ? 'bg-theme-card-hover/40 border-theme-border opacity-85' 
                    : 'bg-theme-card border-theme-border hover:border-theme-primary/30 shadow-card'}
                `}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {subj && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                        {profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr}
                      </span>
                    )}
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold border border-rose-500/20">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-theme-muted">
                      مستوى الصعوبة: {'★'.repeat(m.difficulty)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markMistakeResolved(m.id, !m.isResolved)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition
                        ${m.isResolved 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'border border-theme-border hover:border-emerald-500 text-theme-muted hover:text-emerald-600'}
                      `}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{m.isResolved ? 'تم استيعابه' : 'تحديد كمستوعب'}</span>
                    </button>

                    <button
                      onClick={() => deleteMistake(m.id)}
                      className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                    {t('vaultQuestion')}
                  </span>
                  <p className="text-sm font-bold text-theme-text leading-relaxed">
                    {m.question}
                  </p>
                </div>

                {/* Attempted Answer vs Correct Answer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                      {t('vaultAttemptedAnswer')}
                    </span>
                    <p className="text-theme-text/90 italic">
                      {m.attemptedAnswer}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {t('vaultCorrectAnswer')}
                      </span>
                      <button
                        onClick={() => toggleSolution(m.id)}
                        className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 underline"
                      >
                        {isRevealed ? 'إخفاء' : 'كشف الحل'}
                      </button>
                    </div>
                    {isRevealed ? (
                      <p className="text-theme-text font-medium leading-relaxed">
                        {m.correctAnswer}
                      </p>
                    ) : (
                      <p className="text-theme-muted text-[11px] italic">
                        الحل النموذجي مخفي لاختبار استحضارك. انقر كشف للتحقق.
                      </p>
                    )}
                  </div>
                </div>

                {/* Lesson Learned */}
                <div className="p-3 rounded-xl bg-theme-card-hover border border-theme-border/60 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-theme-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-theme-primary block">{t('vaultExplanation')}:</span>
                    <span className="text-theme-text">{m.explanation}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-theme-border p-12 text-center space-y-3 bg-theme-card/50">
            <AlertCircle className="w-10 h-10 text-theme-muted mx-auto opacity-50" />
            <p className="text-sm font-semibold text-theme-muted">{t('vaultEmpty')}</p>
            <button
              onClick={onOpenAddMistake}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition"
            >
              {t('vaultAddMistake')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
