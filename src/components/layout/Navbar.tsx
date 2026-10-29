import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Moon, 
  Sun, 
  Globe, 
  Palette, 
  Settings, 
  Menu, 
  X, 
  ShieldAlert, 
  Zap, 
  PlusCircle, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { daysBetweenDateKeys, toLocalDateKey } from '../../utils/dateUtils';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenQuickAction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onOpenQuickAction }) => {
  const { profile, toggleDarkMode, setLanguage, setActiveTab, t } = useApp();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Calculate days remaining to BAC
  const daysRemaining = profile.examDate
    ? Math.max(0, daysBetweenDateKeys(toLocalDateKey(), profile.examDate) ?? 0)
    : null;

  return (
    <header className="sticky top-0 z-40 bg-theme-card/90 backdrop-blur-md border-b border-theme-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left / Brand Area */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('mission-control')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center text-white shadow-md shadow-theme-primary/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg font-sans tracking-tight">FF</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-theme-text font-sans">
                  FOCUS &amp; FORCE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                  2.0
                </span>
              </div>
              <span className="text-[11px] text-theme-muted font-medium -mt-1">
                {t('brandTagline')} &bull; <span className="text-theme-primary">{t('creatorCredit')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center / Strategic BAC Metrics */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Countdown Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-primary/20 text-xs font-semibold shadow-subtle">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {daysRemaining === null
                ? t('examDateNotSet')
                : <><strong className="text-sm font-bold">{daysRemaining}</strong> {t('dayRemaining')}</>}
            </span>
          </div>

          {/* Target Average Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-card-hover text-theme-text border border-theme-border text-xs font-medium shadow-subtle">
            <span className="text-theme-muted">{t('targetAverageLabel')}:</span>
            <span className="font-bold text-theme-primary">{profile.targetAverage.toFixed(2)}/20</span>
          </div>

          {/* Study Streak Pill */}
          {profile.gamificationEnabled && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{profile.streakCount} {t('streakDays')}</span>
            </div>
          )}
        </div>

        {/* Right / Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md shadow-theme-primary/25 hover:bg-theme-primary-hover active:scale-95 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t('mcQuickActions')}</span>
          </button>

          {/* Rescue Mode Direct Shortcut */}
          <button
            onClick={() => setActiveTab('rescue-mode')}
            title={t('rescueTitle')}
            className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 active:scale-95 transition border border-amber-500/20"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition border border-theme-border/60 text-xs font-bold"
              title={t('settingsLanguage')}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{profile.preferredLanguage}</span>
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 rounded-xl bg-theme-card border border-theme-border shadow-card py-1.5 z-50 text-xs font-medium"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <button
                  onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 hover:bg-theme-card-hover flex items-center justify-between ${profile.preferredLanguage === 'ar' ? 'text-theme-primary font-bold bg-theme-primary/5' : 'text-theme-text'}`}
                >
                  <span>العربية</span>
                  <span className="text-[10px] text-theme-muted">AR</span>
                </button>
                <button
                  onClick={() => { setLanguage('fr'); setLangDropdownOpen(false); }}
                  className={`w-full text-left rtl:text-right ltr:text-left px-3 py-2 hover:bg-theme-card-hover flex items-center justify-between ${profile.preferredLanguage === 'fr' ? 'text-theme-primary font-bold bg-theme-primary/5' : 'text-theme-text'}`}
                >
                  <span>Français</span>
                  <span className="text-[10px] text-theme-muted">FR</span>
                </button>
                <button
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left rtl:text-right ltr:text-left px-3 py-2 hover:bg-theme-card-hover flex items-center justify-between ${profile.preferredLanguage === 'en' ? 'text-theme-primary font-bold bg-theme-primary/5' : 'text-theme-text'}`}
                >
                  <span>English</span>
                  <span className="text-[10px] text-theme-muted">EN</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Studio Shortcut */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
            title={t('settingsThemeTab')}
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
            title={t('settingsDarkMode')}
          >
            {profile.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
