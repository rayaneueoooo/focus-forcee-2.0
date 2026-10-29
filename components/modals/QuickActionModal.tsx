import React from 'react';
import { 
  X, 
  Timer, 
  CheckSquare, 
  AlertCircle, 
  Layers, 
  FlaskConical, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddTask: () => void;
  onOpenAddMistake: () => void;
  onOpenAddCard: () => void;
  onOpenAddPractice: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onOpenAddTask,
  onOpenAddMistake,
  onOpenAddCard,
  onOpenAddPractice
}) => {
  const { setActiveTab, t } = useApp();

  if (!isOpen) return null;

  const actions = [
    {
      title: t('focusTitle'),
      desc: 'بدء جلسة تركيز عالي مع أصوات المحيط المهدئة',
      icon: Timer,
      color: 'bg-emerald-500 text-white',
      handler: () => {
        setActiveTab('focus-room');
        onClose();
      }
    },
    {
      title: t('rescueTitle'),
      desc: 'جلسة إنقاذ سريعة (10 إلى 60 دقيقة) بدون جلد للذات',
      icon: Zap,
      color: 'bg-amber-500 text-white',
      handler: () => {
        setActiveTab('rescue-mode');
        onClose();
      }
    },
    {
      title: t('plannerAddTask'),
      desc: 'جدولة مهمة جديدة في مخطط البكالوريا الذكي',
      icon: CheckSquare,
      color: 'bg-theme-primary text-white',
      handler: () => {
        onClose();
        onOpenAddTask();
      }
    },
    {
      title: t('vaultAddMistake'),
      desc: 'تدوين خطأ في تمرين لفهم سببه وتجنب تكراره',
      icon: AlertCircle,
      color: 'bg-rose-600 text-white',
      handler: () => {
        onClose();
        onOpenAddMistake();
      }
    },
    {
      title: t('flashcardsAddCard'),
      desc: 'صنع بطاقة مراجعة متباعدة جديدة لقانون أو تعريف',
      icon: Layers,
      color: 'bg-indigo-600 text-white',
      handler: () => {
        onClose();
        onOpenAddCard();
      }
    },
    {
      title: t('practiceLogAttempt'),
      desc: 'تسجيل علامة تمرين أو اختبار ذاتي وتتبع النقاط',
      icon: FlaskConical,
      color: 'bg-sky-600 text-white',
      handler: () => {
        onClose();
        onOpenAddPractice();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-theme-text">{t('mcQuickActions')}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.handler}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-theme-border hover:border-theme-primary/40 bg-theme-card hover:bg-theme-card-hover transition-all text-start group active:scale-[0.98]"
              >
                <div className={`p-2.5 rounded-xl ${act.color} shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-theme-text group-hover:text-theme-primary transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-theme-muted mt-0.5 line-clamp-2">
                    {act.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

