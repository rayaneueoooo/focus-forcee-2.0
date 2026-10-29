import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Moon, 
  Sun, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  Settings as SettingsIcon,
  GraduationCap,
  Clock,
  Globe,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../utils/themes';
import { BAC_STREAMS } from '../utils/curriculumData';
import { ThemeId, BacStreamId, Language } from '../types';
import { parseBackup } from '../utils/backupValidation';

export const SettingsThemeStudioPage: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    setTheme, 
    toggleDarkMode, 
    setLanguage, 
    setCustomAccent,
    setStreamAndReloadSubjects,
    exportAllData, 
    importAllData, 
    resetAllData, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'themes' | 'profile' | 'hours' | 'data'>('themes');
  const [customColor, setCustomColor] = useState(profile.customAccentColor || '#721126');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyCustomColor = (color: string) => {
    setCustomColor(color);
    setCustomAccent(color);
  };

  const handleResetAppearance = () => {
    setTheme('cherry-cream');
    setCustomAccent('');
    if (profile.isDarkMode) toggleDarkMode();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الملف أكبر من الحد المسموح (10 ميغابايت).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') {
        alert('تعذر قراءة ملف النسخة الاحتياطية.');
        return;
      }

      try {
        const { parseBackup } = await import('../utils/backupValidation');
        const backup = parseBackup(content);
        if (!backup) {
          alert('تعذر استيراد الملف: بنية النسخة الاحتياطية أو إصدارها غير صالح.');
          return;
        }

        const summary = [
          `المهام: ${backup.tasks.length}`,
          `الأخطاء: ${backup.mistakes.length}`,
          `البطاقات: ${backup.flashcards.length}`,
          `الملاحظات: ${backup.notes.length}`,
          `جلسات التركيز: ${backup.focusSessions.length}`
        ].join('\n');
        if (!window.confirm(`سيتم استبدال بيانات التطبيق الحالية بهذه النسخة:\n\n${summary}\n\nهل تريد المتابعة؟`)) {
          return;
        }

        if (await importAllData(content)) {
          alert(t('settingsDataImportSuccess'));
        } else {
          alert('تعذر استيراد الملف: بنية النسخة الاحتياطية أو إصدارها غير صالح.');
        }
      } catch (error) {
        console.error('Backup import failed:', error);
        alert('تعذر استيراد النسخة الاحتياطية بسبب خطأ غير متوقع.');
      }
    };
    reader.onerror = () => alert('تعذر قراءة ملف النسخة الاحتياطية.');
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <Palette className="w-6 h-6 text-theme-primary" />
            {t('settingsTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('settingsSubtitle')}
          </p>
        </div>

        {/* Dark Mode Quick Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-card-hover text-xs font-bold text-theme-text transition self-start md:self-auto"
        >
          {profile.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          <span>{profile.isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي (OLED Dark)'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'themes', label: t('settingsThemeTab'), icon: Palette },
          { id: 'profile', label: t('settingsProfileTab'), icon: GraduationCap },
          { id: 'hours', label: t('settingsStudyPrefsTab'), icon: Clock },
          { id: 'data', label: t('settingsDataTab'), icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2
                ${isSelected 
                  ? 'bg-theme-primary text-white shadow-md' 
                  : 'bg-theme-card border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Theme Studio */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          {/* Theme Presets Grid */}
          <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-theme-text font-sans">
                  السمات الثمانية المعتمدة (Signature Themes)
                </h3>
                <p className="text-xs text-theme-muted mt-0.5">
                  تم تصميم كل سمة بتباين عالي مدروس لمنع إجهاد العين أثناء ساعات الدراسة الطويلة
                </p>
              </div>

              <button
                onClick={handleResetAppearance}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-theme-border text-xs font-bold text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {Object.values(THEMES).map(th => {
                const isSelected = profile.preferredTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`
                      p-4 rounded-2xl border text-start transition-all relative overflow-hidden group
                      ${isSelected 
                        ? 'border-2 border-theme-primary bg-theme-primary-light/30 shadow-md' 
                        : 'border-theme-border bg-theme-card hover:border-theme-primary/40 hover:bg-theme-card-hover'}
                    `}
                  >
                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center text-white"
                        style={{ backgroundColor: th.previewColor }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div 
                        className="w-5 h-5 rounded-full border border-black/10"
                        style={{ backgroundColor: th.previewAccent }}
                      />
                    </div>

                    <h4 className="font-bold text-xs text-theme-text font-sans">
                      {profile.preferredLanguage === 'ar' ? th.nameAr : th.nameFr}
                    </h4>

                    <p className="text-[11px] text-theme-muted mt-1 line-clamp-2 leading-relaxed">
                      {profile.preferredLanguage === 'ar' ? th.descriptionAr : th.descriptionFr}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Accent Color Picker */}
          <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
            <h3 className="font-bold text-sm text-theme-text">
              {t('settingsCustomAccent')}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {['#721126', '#8B1E3F', '#D94680', '#7C3AED', '#2E6F24', '#0F4C81', '#E63946', '#334155'].map(hex => (
                <button
                  key={hex}
                  onClick={() => handleApplyCustomColor(hex)}
                  className="w-9 h-9 rounded-full shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-white border-2 border-white dark:border-gray-800"
                  style={{ backgroundColor: hex }}
                >
                  {profile.customAccentColor === hex && <Check className="w-4 h-4" />}
                </button>
              ))}

              <div className="flex items-center gap-2 border border-theme-border rounded-xl px-2.5 py-1 bg-theme-card">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleApplyCustomColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-theme-text">{customColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Profile & Stream */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-6">
          {/* Name & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-text mb-1">
                {t('settingsName')}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-text mb-1">
                {t('settingsTargetAverage')}
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="20"
                value={profile.targetAverage}
                onChange={(e) => updateProfile({ targetAverage: parseFloat(e.target.value) || 16 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-text mb-1">
                {t('settingsExamDate')}
              </label>
              <input
                type="date"
                value={profile.examDate}
                onChange={(e) => updateProfile({ examDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
              />
            </div>
          </div>

          {/* Change Stream */}
          <div className="space-y-3 pt-4 border-t border-theme-border">
            <label className="block text-xs font-bold text-theme-text flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-theme-primary" />
              <span>{t('settingsStream')} (تغيير الشعبة سيعيد تحميل موادها ومعاملاتها الرسمية)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {BAC_STREAMS.map(st => {
                const isSelected = profile.streamId === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (confirm(`هل ترغب في تغيير الشعبة إلى ${st.nameAr} وإعادة تحميل موادها؟`)) {
                        setStreamAndReloadSubjects(st.id);
                      }
                    }}
                    className={`
                      p-3 rounded-xl border text-start transition-all
                      ${isSelected 
                        ? 'border-theme-primary bg-theme-primary-light/40 shadow-sm' 
                        : 'border-theme-border bg-theme-card hover:bg-theme-card-hover'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-theme-text">{st.nameAr}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-theme-card-hover text-theme-muted font-bold">
                        {st.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2 pt-4 border-t border-theme-border">
            <label className="block text-xs font-bold text-theme-text">
              {t('settingsLanguage')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'ar', label: t('settingsLangAr') },
                { id: 'fr', label: t('settingsLangFr') },
                { id: 'en', label: t('settingsLangEn') }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id as Language)}
                  className={`
                    py-2.5 rounded-xl border text-center text-xs font-bold transition
                    ${profile.preferredLanguage === item.id ? 'border-theme-primary bg-theme-primary text-white shadow-sm' : 'border-theme-border bg-theme-card text-theme-muted hover:bg-theme-card-hover'}
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Study Hours per Weekday */}
      {activeTab === 'hours' && (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-theme-primary" />
            {t('settingsAvailableHours')}
          </h3>
          <p className="text-xs text-theme-muted">
            يستخدمها مخطط المهام الذكي لإعادة موازنة جدولك تلقائياً دون إغراق يوم واحد
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {(Object.entries(profile.availableHoursByDay) as [keyof typeof profile.availableHoursByDay, number][]).map(([dayKey, hours]) => (
              <div key={dayKey} className="p-3 rounded-xl border border-theme-border bg-theme-card-hover/40 space-y-1">
                <span className="text-xs font-bold text-theme-text capitalize block">
                  {dayKey}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="14"
                    step="0.5"
                    value={Number(hours)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updateProfile({
                        availableHoursByDay: {
                          ...profile.availableHoursByDay,
                          [dayKey]: val
                        }
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-card text-theme-text text-xs font-bold focus:border-theme-primary"
                  />
                  <span className="text-xs text-theme-muted font-medium">ساعة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Data Management & Backup */}
      {activeTab === 'data' && (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-theme-text">
              النسخ الاحتياطي وإدارة البيانات الشخصية
            </h3>
            <p className="text-xs text-theme-muted">
              بياناتك محفوظة محلياً على جهازك بشكل آمن وخاص بالكامل دون خوادم خارجية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export Card */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-card-hover/40 space-y-3">
              <span className="font-bold text-xs text-theme-text block">
                تصدير نسخة احتياطية كاملة (JSON)
              </span>
              <p className="text-xs text-theme-muted">
                حمّل جميع مهامك، بنك الأخطاء، البطاقات، وجلسات التركيز في ملف واحد يمكنك نقله لأي جهاز.
              </p>
              <button
                onClick={exportAllData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow hover:bg-theme-primary-hover active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>{t('exportData')}</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-card-hover/40 space-y-3">
              <span className="font-bold text-xs text-theme-text block">
                استيراد نسخة احتياطية
              </span>
              <p className="text-xs text-theme-muted">
                استرجع بياناتك السابقة أو انقل سجلاتك من هاتف أو حاسوب آخر بضغطة زر.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-theme-border hover:bg-theme-card text-theme-text text-xs font-bold transition"
              >
                <Upload className="w-4 h-4" />
                <span>{t('importData')}</span>
              </button>
            </div>
          </div>

          {/* Complete Reset */}
          <div className="pt-6 border-t border-theme-border space-y-3">
            <span className="text-xs font-bold text-rose-600 block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              منطقة الخطر
            </span>
            <p className="text-xs text-theme-muted">
              حذف جميع السجلات وإعادة المنصة إلى إعدادات المصنع الأولية.
            </p>
            <button
              onClick={() => {
                if (confirm(t('settingsDataResetConfirm'))) {
                  resetAllData();
                  alert('تمت تهيئة البيانات بنجاح!');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-600/30 text-xs font-bold transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('resetAllData')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
