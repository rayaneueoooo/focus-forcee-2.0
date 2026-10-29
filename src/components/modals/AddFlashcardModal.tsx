import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlashcardType } from '../../types';

interface AddFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFlashcardModal: React.FC<AddFlashcardModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addFlashcard, t, profile } = useApp();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [type, setType] = useState<FlashcardType>('formula');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !subjectId) return;

    addFlashcard({
      subjectId,
      type,
      front: front.trim(),
      back: back.trim()
    });

    onClose();
    setFront('');
    setBack('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            {t('flashcardsAddCard')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
                {t('flashcardsCardType')} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FlashcardType)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
              >
                <option value="formula">{t('flashcardsTypeFormula')}</option>
                <option value="definition">{t('flashcardsTypeDef')}</option>
                <option value="qa">{t('flashcardsTypeQA')}</option>
                <option value="date_fact">{t('flashcardsTypeDate')}</option>
                <option value="vocab">{t('flashcardsTypeVocab')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('flashcardsFront')} *
            </label>
            <textarea
              required
              rows={2}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="السؤال أو المصطلح أو القانون المطلوب استحضاره..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-theme-text mb-1">
              {t('flashcardsBack')} *
            </label>
            <textarea
              required
              rows={3}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="الجواب الكامل أو الشرح النموذجي..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-primary text-xs"
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

