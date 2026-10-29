import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MissionControlPage } from './pages/MissionControlPage';
import { PlannerPage } from './pages/PlannerPage';
import { RescueModePage } from './pages/RescueModePage';
import { FocusRoomPage } from './pages/FocusRoomPage';
import { MistakeVaultPage } from './pages/MistakeVaultPage';
import { SpacedRepetitionPage } from './pages/SpacedRepetitionPage';
import { BacJourneyPage } from './pages/BacJourneyPage';
import { PracticeLabPage } from './pages/PracticeLabPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StudySpacePage } from './pages/StudySpacePage';
import { SettingsThemeStudioPage } from './pages/SettingsThemeStudioPage';
import { StudyLoungesPage } from './pages/StudyLoungesPage';
import { InstallAppPrompt } from './components/layout/InstallAppPrompt';

// Modals
import { QuickActionModal } from './components/modals/QuickActionModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { AddMistakeModal } from './components/modals/AddMistakeModal';
import { AddFlashcardModal } from './components/modals/AddFlashcardModal';
import { AddPracticeModal } from './components/modals/AddPracticeModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Mobile bottom bar icons
import { 
  LayoutDashboard, 
  Calendar, 
  Timer, 
  Users,
  AlertCircle, 
  Zap, 
  Settings 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, profile, t } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addMistakeOpen, setAddMistakeOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addPracticeOpen, setAddPracticeOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(!profile.hasCompletedOnboarding);

  useEffect(() => {
    setOnboardingOpen(!profile.hasCompletedOnboarding);
  }, [profile.hasCompletedOnboarding]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'mission-control':
        return (
          <MissionControlPage
            onOpenAddTask={() => setAddTaskOpen(true)}
            onOpenAddMistake={() => setAddMistakeOpen(true)}
            onOpenAddCard={() => setAddCardOpen(true)}
          />
        );
      case 'planner':
        return <PlannerPage onOpenAddTask={() => setAddTaskOpen(true)} />;
      case 'rescue-mode':
        return <RescueModePage />;
      case 'focus-room':
        return <FocusRoomPage />;
      case 'social-lounge':
        return <StudyLoungesPage />;
      case 'mistake-vault':
        return <MistakeVaultPage onOpenAddMistake={() => setAddMistakeOpen(true)} />;
      case 'spaced-repetition':
        return <SpacedRepetitionPage onOpenAddCard={() => setAddCardOpen(true)} />;
      case 'bac-journey':
        return <BacJourneyPage />;
      case 'practice-lab':
        return <PracticeLabPage onOpenAddPractice={() => setAddPracticeOpen(true)} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'study-space':
        return <StudySpacePage />;
      case 'settings':
        return <SettingsThemeStudioPage />;
      default:
        return (
          <MissionControlPage
            onOpenAddTask={() => setAddTaskOpen(true)}
            onOpenAddMistake={() => setAddMistakeOpen(true)}
            onOpenAddCard={() => setAddCardOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans selection:bg-theme-primary/20 selection:text-theme-primary">
      {/* Top Navigation */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenQuickAction={() => setQuickActionOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-theme-card/95 backdrop-blur-md border-t border-theme-border py-2 px-3 flex items-center justify-around shadow-elevated">
        <button
          onClick={() => setActiveTab('mission-control')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'mission-control' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'planner' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>المهام</span>
        </button>

        <button
          onClick={() => setActiveTab('focus-room')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'focus-room' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <Timer className="w-4 h-4" />
          <span>التركيز</span>
        </button>

        <button
          onClick={() => setActiveTab('social-lounge')}
          className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[9px] font-bold ${activeTab === 'social-lounge' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <Users className="w-4 h-4" />
          <span>{profile.preferredLanguage === 'ar' ? 'الغرف' : profile.preferredLanguage === 'fr' ? 'Salon' : 'Lounge'}</span>
        </button>

        <button
          onClick={() => setActiveTab('rescue-mode')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'rescue-mode' ? 'text-amber-500 font-black' : 'text-amber-600/70'}`}
        >
          <Zap className="w-4 h-4 fill-amber-500" />
          <span>إنقاذ</span>
        </button>

        <button
          onClick={() => setActiveTab('mistake-vault')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'mistake-vault' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>الأخطاء</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${activeTab === 'settings' ? 'text-theme-primary' : 'text-theme-muted'}`}
        >
          <Settings className="w-4 h-4" />
          <span>المظهر</span>
        </button>
      </nav>

      {/* Modals */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        onOpenAddTask={() => setAddTaskOpen(true)}
        onOpenAddMistake={() => setAddMistakeOpen(true)}
        onOpenAddCard={() => setAddCardOpen(true)}
        onOpenAddPractice={() => setAddPracticeOpen(true)}
      />

      <AddTaskModal
        isOpen={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
      />

      <AddMistakeModal
        isOpen={addMistakeOpen}
        onClose={() => setAddMistakeOpen(false)}
      />

      <AddFlashcardModal
        isOpen={addCardOpen}
        onClose={() => setAddCardOpen(false)}
      />

      <AddPracticeModal
        isOpen={addPracticeOpen}
        onClose={() => setAddPracticeOpen(false)}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
      <InstallAppPrompt />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
