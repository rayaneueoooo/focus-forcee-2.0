import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Sparkles, 
  Battery, 
  BatteryMedium, 
  BatteryCharging, 
  BookOpen, 
  Play, 
  CheckCircle, 
  RotateCcw,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateRescueMission, RescueMissionPlan } from '../utils/adaptiveScheduler';

export const RescueModePage: React.FC = () => {
  const { subjects, logFocusSession, setActiveTab, t, profile } = useApp();

  const [duration, setDuration] = useState<number>(20);
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [energy, setEnergy] = useState<'low' | 'normal' | 'high'>('normal');
  const [activity, setActivity] = useState<'understand' | 'memorize' | 'practise' | 'mistakes'>('practise');
  
  const [missionPlan, setMissionPlan] = useState<RescueMissionPlan | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0];

  const handleGenerate = () => {
    if (!currentSubject) return;
    const plan = generateRescueMission(
      duration,
      currentSubject,
      energy,
      activity,
      profile.preferredLanguage || 'ar'
    );
    setMissionPlan(plan);
    setCompletedSteps({});
  };

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleCompleteMission = () => {
    if (!currentSubject) return;
    logFocusSession({
      subjectId: currentSubject.id,
      durationMinutes: duration,
      actualMinutes: duration,
      type: 'rescue',
      completedAt: new Date().toISOString(),
      reflectionNote: `جلسة إنقاذ ناجحة: ${duration} دقيقة في ${currentSubject.nameAr}`,
      rating: 5
    });

    alert('مبارك! تم تسجيل جلسة الإنقاذ بنجاح وإضافتها إلى رصيد تركيزك واستمراريتك.');
    setIsRunning(false);
    setMissionPlan(null);
    setActiveTab('mission-control');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/25 p-6 shadow-subtle space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-theme-text font-sans">
              {t('rescueTitle')}
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">
              {t('rescueSubtitle')}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
          💡 {t('rescueDisclaimer')}
        </p>
      </div>

      {/* Generator Controls (If not in active mission) */}
      {!missionPlan ? (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-6">
          {/* Time Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-theme-text flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-theme-primary" />
              {t('rescueTimeSelect')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 20, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`
                    py-3 rounded-xl border text-xs font-bold transition-all
                    ${duration === mins 
                      ? 'bg-theme-primary text-white border-theme-primary shadow-md' 
                      : 'bg-theme-card text-theme-muted border-theme-border hover:bg-theme-card-hover'}
                  `}
                >
                  {mins} {t('minutes')}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-theme-text flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-theme-primary" />
              {t('rescueSubjectSelect')}
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr} (معامل {s.coefficient})
                </option>
              ))}
            </select>
          </div>

          {/* Energy Level Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-theme-text flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-theme-primary" />
              {t('rescueEnergySelect')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'low', label: t('rescueEnergyLow'), icon: Battery, color: 'text-amber-500' },
                { id: 'normal', label: t('rescueEnergyNormal'), icon: BatteryMedium, color: 'text-blue-500' },
                { id: 'high', label: t('rescueEnergyHigh'), icon: BatteryCharging, color: 'text-emerald-500' }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = energy === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setEnergy(item.id as 'low' | 'normal' | 'high')}
                    className={`
                      p-3.5 rounded-xl border text-start transition-all
                      ${isSelected 
                        ? 'border-theme-primary bg-theme-primary-light/40 shadow-sm' 
                        : 'border-theme-border bg-theme-card hover:bg-theme-card-hover'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="font-bold text-xs text-theme-text capitalize">{item.id}</span>
                    </div>
                    <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desired Activity */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-theme-text">
              {t('rescueActivitySelect')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'understand', label: t('rescueActUnderstand') },
                { id: 'memorize', label: t('rescueActMemorize') },
                { id: 'practise', label: t('rescueActPractise') },
                { id: 'mistakes', label: t('rescueActMistakes') }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivity(item.id as 'understand' | 'memorize' | 'practise' | 'mistakes')}
                  className={`
                    py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all
                    ${activity === item.id 
                      ? 'border-theme-primary bg-theme-primary text-white shadow-md' 
                      : 'border-theme-border bg-theme-card text-theme-muted hover:bg-theme-card-hover'}
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('rescueGeneratePlan')}</span>
          </button>
        </div>
      ) : (
        /* Generated Mission View */
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-theme-border">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-500">
                خطة الإنقاذ المباشرة &bull; {missionPlan.durationMinutes} دقيقة
              </span>
              <h2 className="text-xl font-black text-theme-text">
                مهمة الإنقاذ: {missionPlan.subjectName}
              </h2>
            </div>

            <button
              onClick={() => setMissionPlan(null)}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
              title="إعادة التوليد"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Phases Display */}
          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="p-4 rounded-xl border border-theme-border bg-theme-card-hover/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-theme-text">
                  {missionPlan.phase1.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                  {missionPlan.phase1.durationMinutes} {t('minutes')}
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                {missionPlan.phase1.steps.map((st, i) => {
                  const key = `p1_${i}`;
                  const isChecked = !!completedSteps[key];
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleStep(key)}
                      className="flex items-start gap-2.5 text-xs text-theme-text cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded text-theme-primary focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-theme-muted' : ''}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase 2 */}
            <div className="p-4 rounded-xl border-2 border-theme-primary/30 bg-theme-primary-light/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-theme-primary">
                  {missionPlan.phase2.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-primary text-white">
                  {missionPlan.phase2.durationMinutes} {t('minutes')} (التركيز الأكبر)
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                {missionPlan.phase2.steps.map((st, i) => {
                  const key = `p2_${i}`;
                  const isChecked = !!completedSteps[key];
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleStep(key)}
                      className="flex items-start gap-2.5 text-xs text-theme-text cursor-pointer select-none font-medium"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded text-theme-primary focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-theme-muted' : ''}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-4 rounded-xl border border-theme-border bg-theme-card-hover/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-theme-text">
                  {missionPlan.phase3.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {missionPlan.phase3.durationMinutes} {t('minutes')}
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                {missionPlan.phase3.steps.map((st, i) => {
                  const key = `p3_${i}`;
                  const isChecked = !!completedSteps[key];
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleStep(key)}
                      className="flex items-start gap-2.5 text-xs text-theme-text cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded text-theme-primary focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-theme-muted' : ''}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-theme-border">
            <button
              onClick={() => setActiveTab('focus-room')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-card-hover border border-theme-border text-theme-text text-xs font-bold hover:bg-theme-card transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>فتح مؤقت التركيز لهذه الجلسة</span>
            </button>

            <button
              onClick={handleCompleteMission}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>أتممت مهمة الإنقاذ بنجاح!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
