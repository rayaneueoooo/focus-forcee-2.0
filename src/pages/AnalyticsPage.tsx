import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Target,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { 
    focusSessions, 
    tasks, 
    mistakes, 
    practiceAttempts, 
    subjects, 
    profile, 
    t 
  } = useApp();

  // Weekly study minutes distribution by day
  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayFocusMinutes = [0, 0, 0, 0, 0, 0, 0];

  focusSessions.forEach(fs => {
    try {
      const d = new Date(fs.completedAt);
      const dayIndex = d.getDay(); // 0 is Sunday
      dayFocusMinutes[dayIndex] += fs.actualMinutes || 0;
    } catch {}
  });

  const maxDayMinutes = Math.max(...dayFocusMinutes, 60);

  // Task Completion Velocity
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskVelocityPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mistakes Causes Breakdown
  const mistakeCausesCount: Record<string, number> = {};
  mistakes.forEach(m => {
    mistakeCausesCount[m.category] = (mistakeCausesCount[m.category] || 0) + 1;
  });

  // Subject Time Breakdown
  const subjectTimeMap: Record<string, number> = {};
  focusSessions.forEach(fs => {
    subjectTimeMap[fs.subjectId] = (subjectTimeMap[fs.subjectId] || 0) + (fs.actualMinutes || 0);
  });

  // Total Focus Hours
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.actualMinutes || 0), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-theme-primary" />
            {t('analyticsTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('analyticsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-primary/20 text-xs font-bold self-start md:self-auto">
          <Clock className="w-4 h-4" />
          <span>إجمالي ساعات التركيز المسجلة: {totalFocusHours} ساعة</span>
        </div>
      </div>

      {/* Top Velocity Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-card space-y-1">
          <span className="text-[11px] font-bold text-theme-muted block">{t('analyticsTaskVelocity')}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-theme-primary font-sans">{taskVelocityPercent}%</span>
            <span className="text-xs text-theme-muted font-medium">({completedTasks}/{totalTasks} مهمة)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-theme-card-hover mt-2 overflow-hidden">
            <div className="h-full bg-theme-primary rounded-full transition-all duration-500" style={{ width: `${taskVelocityPercent}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-card space-y-1">
          <span className="text-[11px] font-bold text-theme-muted block">{t('targetAverageLabel')}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-theme-text font-sans">{profile.targetAverage.toFixed(2)}</span>
            <span className="text-xs text-theme-muted font-bold">/ 20</span>
          </div>
          <p className="text-[10px] text-theme-muted mt-2">شعبة {profile.streamId.replace('_', ' ').toUpperCase()}</p>
        </div>

        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-card space-y-1">
          <span className="text-[11px] font-bold text-theme-muted block">الأخطاء المستوعبة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
              {mistakes.filter(m => m.isResolved).length}
            </span>
            <span className="text-xs text-theme-muted font-medium">من أصل {mistakes.length}</span>
          </div>
          <p className="text-[10px] text-theme-muted mt-2">تم حلها مجدداً بنجاح</p>
        </div>

        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-card space-y-1">
          <span className="text-[11px] font-bold text-theme-muted block">أيام الاستمرارية</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500 font-sans">{profile.streakCount}</span>
            <span className="text-xs text-theme-muted font-medium">يوم متواصل</span>
          </div>
          <p className="text-[10px] text-theme-muted mt-2">نظام تحفيز يحترم راحتك</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Focus Time Bar Chart (SVG) */}
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-theme-border">
            <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
              <Clock className="w-4 h-4 text-theme-primary" />
              {t('analyticsWeeklyHours')}
            </h3>
            <span className="text-[11px] text-theme-muted">بالدقائق</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            {dayNamesAr.map((dayName, idx) => {
              const mins = dayFocusMinutes[idx];
              const heightPercent = Math.max(8, Math.round((mins / maxDayMinutes) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {mins}د
                  </span>
                  <div 
                    className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-theme-primary to-theme-accent transition-all duration-300 group-hover:brightness-110 shadow-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-bold text-theme-muted truncate w-full text-center">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mistakes Root Causes Breakdown */}
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-theme-border">
            <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              {t('analyticsMistakeBreakdown')}
            </h3>
            <span className="text-[11px] text-theme-muted">{mistakes.length} خطأ مسجل</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(mistakeCausesCount).length > 0 ? (
              Object.entries(mistakeCausesCount).map(([cat, count]) => {
                const percent = Math.round((count / mistakes.length) * 100);
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-theme-text">
                      <span>{cat}</span>
                      <span className="text-theme-primary font-sans">{percent}% ({count})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-theme-card-hover overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-8 text-xs text-theme-muted">
                لم تسجل أي أخطاء في بنك الأخطاء بعد.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Strategic Advice */}
      <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-3">
        <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-theme-primary" />
          {t('analyticsInsightActionable')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-theme-card-hover border border-theme-border/60 space-y-1">
            <span className="font-bold text-theme-primary block">تحسين نتائج حل التمارين</span>
            <p className="text-theme-muted leading-relaxed">
              وفق تحليلات بنك الأخطاء، معظم الأخطاء في التمارين تعود إلى التسرع الحسابي أو عدم قراءة السؤال بدقة. خصص أول 3 دقائق دائماً لفهم المطلوب وتحديد المعطيات على المسودة.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-theme-card-hover border border-theme-border/60 space-y-1">
            <span className="font-bold text-theme-primary block">تثبيت المواد ذات المعامل المرتفع</span>
            <p className="text-theme-muted leading-relaxed">
              ركز جلسات تركيزك العالي الصباحية أو المسائية الأولى على المواد ذات المعامل الأكبر في شعبتك لضمان أكبر عائد في المعدل العام.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
