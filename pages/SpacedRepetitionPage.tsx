import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, 
  Plus, 
  Play, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Trash2, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSM2, isCardDueToday } from '../utils/spacedRepetition';
import { Flashcard, FlashcardRating } from '../types';

interface SpacedRepetitionPageProps {
  onOpenAddCard: () => void;
}

export const SpacedRepetitionPage: React.FC<SpacedRepetitionPageProps> = ({ onOpenAddCard }) => {
  const { flashcards, subjects, reviewFlashcard, deleteFlashcard, profile, t } = useApp();

  const [activeSession, setActiveSession] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewSessionCardIds, setReviewSessionCardIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const ratingInProgress = useRef(false);

  const dueCards = flashcards.filter(c => isCardDueToday(c.nextReviewDate));
  const currentCard: Flashcard | undefined = flashcards.find(card => card.id === reviewSessionCardIds[currentCardIndex]);
  const nextIntervalLabel = (rating: FlashcardRating) => {
    if (!currentCard) return '';
    const days = calculateSM2(currentCard, rating).intervalDays;
    if (profile.preferredLanguage === 'ar') return days === 1 ? 'غداً' : `بعد ${days} أيام`;
    if (profile.preferredLanguage === 'fr') return `dans ${days} j`;
    return `in ${days} days`;
  };

  useEffect(() => {
    ratingInProgress.current = false;
  }, [activeSession, currentCardIndex]);

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCard || ratingInProgress.current) return;
    ratingInProgress.current = true;
    reviewFlashcard(currentCard.id, rating);
    setIsFlipped(false);
    if (currentCardIndex + 1 < reviewSessionCardIds.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setActiveSession(false);
      setCurrentCardIndex(0);
      setReviewSessionCardIds([]);
      alert(t('flashcardsSessionFinished'));
    }
  };

  const filteredCards = flashcards.filter(c => {
    if (selectedSubjectFilter !== 'all' && c.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            {t('flashcardsTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('flashcardsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {dueCards.length > 0 && !activeSession && (
            <button
              onClick={() => {
                setCurrentCardIndex(0);
                setReviewSessionCardIds(dueCards.map(card => card.id));
                setIsFlipped(false);
                setActiveSession(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('flashcardsStudyNow')} ({dueCards.length})</span>
            </button>
          )}

          <button
            onClick={onOpenAddCard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow hover:bg-theme-primary-hover active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('flashcardsAddCard')}</span>
          </button>
        </div>
      </div>

      {/* Active Study Session Mode */}
      {activeSession && currentCard ? (
        <div className="max-w-xl mx-auto space-y-6 py-4">
          <div className="flex items-center justify-between text-xs font-bold text-theme-muted">
            <span>البطاقة {currentCardIndex + 1} من {reviewSessionCardIds.length}</span>
            <button
              onClick={() => {
                setActiveSession(false);
                setReviewSessionCardIds([]);
                setCurrentCardIndex(0);
              }}
              className="text-theme-primary hover:underline"
            >
              إنهاء الجلسة
            </button>
          </div>

          {/* Flashcard Box */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] p-8 rounded-3xl bg-theme-card border-2 border-theme-border shadow-elevated flex flex-col justify-between cursor-pointer hover:border-indigo-400 transition-all select-none text-center relative group"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              {currentCard.type.toUpperCase()} &bull; انقر للقلب
            </span>

            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-theme-text font-sans">
                    {currentCard.front}
                  </h3>
                  <span className="inline-block text-xs text-theme-muted">
                    انقر لكشف الإجابة والاسترجاع النشط
                  </span>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    الإجابة النموذجية
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-theme-text font-sans leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-theme-muted flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'وجه البطاقة' : 'ظهر البطاقة'}</span>
            </div>
          </div>

          {/* SM-2 Rating Buttons (Shown when flipped) */}
          {isFlipped ? (
            <div className="space-y-2 animate-fade-in">
              <span className="block text-center text-xs font-bold text-theme-muted">
                كيف كان استحضارك للإجابة؟ (يحدد موعد التكرار القادم)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate('again')}
                  className="py-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  {t('flashcardsRateAgain')}
                  <span className="block text-[10px] opacity-80 mt-0.5">{nextIntervalLabel('again')}</span>
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  {t('flashcardsRateHard')}
                  <span className="block text-[10px] opacity-80 mt-0.5">{nextIntervalLabel('hard')}</span>
                </button>
                <button
                  onClick={() => handleRate('good')}
                  className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  {t('flashcardsRateGood')}
                  <span className="block text-[10px] opacity-80 mt-0.5">{nextIntervalLabel('good')}</span>
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  {t('flashcardsRateEasy')}
                  <span className="block text-[10px] opacity-80 mt-0.5">{nextIntervalLabel('easy')}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3 rounded-xl bg-theme-card-hover border border-theme-border text-theme-text text-xs font-bold hover:bg-theme-card transition"
            >
              {t('flashcardsShowAnswer')}
            </button>
          )}
        </div>
      ) : (
        /* Regular Flashcard Overview */
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">{t('flashcardsDueCount')}</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-sans">{dueCards.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">{t('flashcardsTotalCount')}</span>
                <span className="text-2xl font-black text-theme-text font-sans">{flashcards.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-theme-primary/10 text-theme-primary">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">بطاقات مثبتة في الذاكرة</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
                  {flashcards.filter(c => c.masteryLevel === 'mastered').length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(c => {
              const subj = subjects.find(s => s.id === c.subjectId);
              return (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-theme-card border border-theme-border hover:border-indigo-400/50 shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                        {subj ? (profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr) : ''}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-card-hover font-semibold text-theme-muted">
                        {c.type}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-theme-text">
                      {c.front}
                    </h4>

                    <p className="text-xs text-theme-muted line-clamp-3 bg-theme-card-hover/60 p-2.5 rounded-xl border border-theme-border/40">
                      {c.back}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[11px] text-theme-muted">
                    <span>التكرار القادم: {c.nextReviewDate}</span>
                    <button
                      onClick={() => deleteFlashcard(c.id)}
                      className="p-1 rounded text-theme-muted hover:text-rose-500 transition"
                      title={t('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
