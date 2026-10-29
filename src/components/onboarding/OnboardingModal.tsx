import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  GraduationCap, 
  Clock, 
  Target, 
  Globe, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BAC_STREAMS } from '../../utils/curriculumData';
import { BacStreamId, Language } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, completeOnboarding, setLanguage, t } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name || '');
  const [selectedStream, setSelectedStream] = useState<BacStreamId>(profile.streamId || 'sciences_exp');
  const [targetAvg, setTargetAvg] = useState<number>(profile.targetAverage || 16.50);
  const [selectedLang, setSelectedLang] = useState<Language>(profile.preferredLanguage || 'ar');

  if (!isOpen) return null;

  const handleFinish = () => {
    setLanguage(selectedLang);
    completeOnboarding(selectedStream, Number(targetAvg), name);
    onClose();
  };

  const handleSkip = () => {
    completeOnboarding(selectedStream, targetAvg, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary to-theme-accent text-white flex items-center justify-center font-bold text-lg shadow-md">
              FF
            </div>
            <div>
              <h2 className="font-black text-lg text-theme-text font-sans">{t('obWelcomeTitle')}</h2>
              <p className="text-xs text-theme-muted">{t('obWelcomeSub')}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs text-theme-muted hover:text-theme-primary transition underline"
          >
            {t('obSkip')}
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${step === s 
                  ? 'bg-theme-primary text-white shadow-glow' 
                  : step > s 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-theme-card-hover text-theme-muted border border-theme-border'}
              `}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-theme-muted">
                {s === 1 ? t('settingsLanguage') : s === 2 ? t('settingsStream') : s === 3 ? t('targetAverageLabel') : t('settingsStudyPrefsTab')}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Language & Name */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
              <Globe className="w-5 h-5 text-theme-primary" />
              {t('obStep1Title')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ar', label: 'العربية (افتراضي)', desc: 'واجهة باللغة العربية مع دعم كامل لاتجاه اليمين إلى اليسار' },
                { id: 'fr', label: 'Français', desc: 'Interface complète en français avec terminologie BAC algérien' },
                { id: 'en', label: 'English', desc: 'High-performance English interface with clean typography' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedLang(item.id as Language)}
                  className={`
                    p-4 rounded-xl border text-start transition-all
                    ${selectedLang === item.id 
                      ? 'border-theme-primary bg-theme-primary-light/40 shadow-subtle' 
                      : 'border-theme-border bg-theme-card hover:bg-theme-card-hover'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-theme-text">{item.label}</span>
                    {selectedLang === item.id && <Check className="w-4 h-4 text-theme-primary" />}
                  </div>
                  <p className="text-[11px] text-theme-muted mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-theme-text mb-1">
                {t('settingsName')} (اختياري)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('obNamePlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-primary"
              />
            </div>
          </div>
        )}

        {/* Step 2: BAC Stream Selection */}
        {step === 2 && (
          <div className="space-y-3 py-1">
            <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-theme-primary" />
              {t('obStep2Title')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {BAC_STREAMS.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStream(st.id)}
                  className={`
                    p-3.5 rounded-xl border text-start transition-all
                    ${selectedStream === st.id 
                      ? 'border-theme-primary bg-theme-primary-light/40 shadow-subtle' 
                      : 'border-theme-border bg-theme-card hover:bg-theme-card-hover'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-theme-text">
                      {selectedLang === 'ar' ? st.nameAr : selectedLang === 'fr' ? st.nameFr : st.nameEn}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-card-hover font-bold text-theme-primary">
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-theme-muted mt-1 line-clamp-2">
                    {selectedLang === 'ar' ? st.descriptionAr : selectedLang === 'fr' ? st.descriptionFr : st.descriptionEn}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Target Average */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
              <Target className="w-5 h-5 text-theme-primary" />
              {t('obStep3Title')}
            </h3>

            <div className="p-6 rounded-2xl bg-theme-primary-light/30 border border-theme-primary/20 text-center space-y-4">
              <span className="text-xs text-theme-muted font-medium">{t('targetAverageLabel')} (على 20)</span>
              <div className="flex items-center justify-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="20"
                  value={targetAvg}
                  onChange={(e) => setTargetAvg(parseFloat(e.target.value) || 16)}
                  className="w-36 text-center text-4xl font-black text-theme-primary bg-theme-card border-2 border-theme-primary/40 rounded-2xl py-2 focus:outline-none focus:border-theme-primary shadow-subtle"
                />
                <span className="text-xl font-bold text-theme-muted">/ 20</span>
              </div>
              <p className="text-xs text-theme-muted max-w-md mx-auto">
                وفق شعبة {selectedStream}، هذا الهدف يتطلب استراتيجية واضحة في المواد ذات المعامل المرتفع واستمرارية يومية.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Study Commitment & Finish */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-theme-primary" />
              {t('obStep4Title')}
            </h3>

            <div className="p-4 rounded-xl border border-theme-border bg-theme-card space-y-2 text-xs text-theme-muted">
              <div className="flex items-center justify-between">
                <span>ساعات الدراسة الموصى بها أيام الأسبوع العادية:</span>
                <strong className="text-theme-text font-bold text-sm">3.5 إلى 4 ساعات</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>ساعات الدراسة الموصى بها أيام العطلة الأسبوعية:</span>
                <strong className="text-theme-text font-bold text-sm">5 إلى 6 ساعات</strong>
              </div>
              <p className="text-[11px] text-theme-primary pt-2 border-t border-theme-border">
                يمكنك ضبط ساعاتك بدقة لكل يوم على حدة من تبويب الإعدادات في أي وقت.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-theme-border">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              {t('obBack')}
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-theme-primary text-white shadow-md hover:bg-theme-primary-hover active:scale-95 transition"
            >
              {t('obNext')}
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-theme-primary to-theme-accent text-white shadow-lg hover:opacity-95 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              {t('obFinish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

