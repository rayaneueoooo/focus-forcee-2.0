import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookMarked, 
  Timer, 
  AlertCircle, 
  Layers, 
  Zap, 
  FlaskConical, 
  BarChart3, 
  FolderLock, 
  Settings, 
  X,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isCardDueToday } from '../../utils/spacedRepetition';
import { toLocalDateKey } from '../../utils/dateUtils';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, tasks, mistakes, flashcards, t } = useApp();

  // Compute live badges
  const todayStr = toLocalDateKey();
  const pendingTasksToday = tasks.filter(t => t.status !== 'completed' && t.scheduledDate <= todayStr).length;
  const unresolvedMistakes = mistakes.filter(m => !m.isResolved).length;
  const dueFlashcards = flashcards.filter(c => isCardDueToday(c.nextReviewDate)).length;

  const navItems = [
    {
      id: 'mission-control',
      label: t('navMissionControl'),
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'planner',
      label: t('navPlanner'),
      icon: Calendar,
      badge: pendingTasksToday > 0 ? pendingTasksToday : null,
      badgeColor: 'bg-theme-primary text-white'
    },
    {
      id: 'bac-journey',
      label: t('navBacJourney'),
      icon: BookMarked,
      badge: null
    },
    {
      id: 'focus-room',
      label: t('navFocusRoom'),
      icon: Timer,
      badge: null
    },
    {
      id: 'social-lounge',
      label: t('navSocialLounge'),
      icon: Users,
      badge: null
    },
    {
      id: 'rescue-mode',
      label: t('navRescueMode'),
      icon: Zap,
      badge: 'PRO',
      badgeColor: 'bg-amber-500 text-white font-bold'
    },
    {
      id: 'mistake-vault',
      label: t('navMistakeVault'),
      icon: AlertCircle,
      badge: unresolvedMistakes > 0 ? unresolvedMistakes : null,
      badgeColor: 'bg-rose-600 text-white'
    },
    {
      id: 'spaced-repetition',
      label: t('navSpacedRepetition'),
      icon: Layers,
      badge: dueFlashcards > 0 ? dueFlashcards : null,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'practice-lab',
      label: t('navPracticeLab'),
      icon: FlaskConical,
      badge: null
    },
    {
      id: 'analytics',
      label: t('navAnalytics'),
      icon: BarChart3,
      badge: null
    },
    {
      id: 'study-space',
      label: t('navStudySpace'),
      icon: FolderLock,
      badge: null
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed md:sticky top-0 md:top-16 z-50 md:z-30 h-screen md:h-[calc(100vh-4rem)]
        w-64 bg-theme-card border-r rtl:border-r-0 rtl:border-l border-theme-border
        flex flex-col justify-between py-4 px-3 transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between px-2 pb-4 mb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-theme-primary text-white flex items-center justify-center font-bold text-sm">
              FF
            </div>
            <span className="font-bold text-sm text-theme-text font-sans">FOCUS & FORCE</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 pl-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-150 group text-start
                  ${isActive 
                    ? 'bg-theme-primary text-white shadow-md shadow-theme-primary/20 font-bold' 
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-card-hover'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-theme-muted'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor || 'bg-theme-card-hover text-theme-text'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Creator / Version Card Footer */}
        <div className="pt-3 border-t border-theme-border mt-2 px-2">
          <div className="p-2.5 rounded-xl bg-theme-primary-light/40 border border-theme-primary/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-theme-primary text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-theme-text">{t('creatorCredit')}</span>
              <span className="text-[10px] text-theme-muted">{t('brandBadge')}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
