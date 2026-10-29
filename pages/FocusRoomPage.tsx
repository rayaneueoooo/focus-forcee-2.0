import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ambientAudio, AmbientSoundType } from '../utils/audioSynth';
import { localDateKeyFromTimestamp, toLocalDateKey } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

type PomodoroMode = 'work' | 'short-break' | 'long-break';

interface SavedTimer {
  mode: PomodoroMode;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  secondsRemaining: number;
  completedWorkSessions: number;
  longBreakEvery: number;
  isRunning: boolean;
  endAt: number | null;
}

const TIMER_STORAGE_KEY = 'focus_force_pro_timer';

const readSavedTimer = (): SavedTimer => {
  const fallback: SavedTimer = {
    mode: 'work',
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    secondsRemaining: 25 * 60,
    completedWorkSessions: 0,
    longBreakEvery: 4,
    isRunning: false,
    endAt: null
  };
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as Partial<SavedTimer>;
    const mode: PomodoroMode = ['work', 'short-break', 'long-break'].includes(saved.mode || '')
      ? saved.mode as PomodoroMode
      : 'work';
    const workMinutes = Number.isInteger(saved.workMinutes) ? Math.min(120, Math.max(1, saved.workMinutes!)) : 25;
    const shortBreakMinutes = Number.isInteger(saved.shortBreakMinutes) ? Math.min(30, Math.max(1, saved.shortBreakMinutes!)) : 5;
    const longBreakMinutes = Number.isInteger(saved.longBreakMinutes) ? Math.min(60, Math.max(1, saved.longBreakMinutes!)) : 15;
    const savedRemaining = Number.isInteger(saved.secondsRemaining) ? Math.max(0, saved.secondsRemaining!) : 25 * 60;
    const endAt = typeof saved.endAt === 'number' ? saved.endAt : null;
    const isRunning = saved.isRunning === true && endAt !== null && endAt > Date.now();
    return {
      mode,
      workMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      secondsRemaining: isRunning ? Math.ceil((endAt! - Date.now()) / 1000) : savedRemaining,
      completedWorkSessions: Number.isInteger(saved.completedWorkSessions) ? Math.max(0, saved.completedWorkSessions!) : 0,
      longBreakEvery: Number.isInteger(saved.longBreakEvery) ? Math.min(8, Math.max(2, saved.longBreakEvery!)) : 4,
      isRunning,
      endAt: isRunning ? endAt : null
    };
  } catch (error) {
    console.error('Saved focus timer could not be restored:', error);
    return fallback;
  }
};

export const FocusRoomPage: React.FC = () => {
  const { subjects, tasks, logFocusSession, focusSessions, profile, t } = useApp();

  const [initialTimer] = useState(readSavedTimer);
  const [mode, setMode] = useState<PomodoroMode>(initialTimer.mode);
  const [workMinutes, setWorkMinutes] = useState(initialTimer.workMinutes);
  const [breakMinutes, setBreakMinutes] = useState(initialTimer.shortBreakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(initialTimer.longBreakMinutes);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(initialTimer.completedWorkSessions);
  const [longBreakEvery, setLongBreakEvery] = useState(initialTimer.longBreakEvery);
  
  // Timer state based on delta timestamps
  const [isRunning, setIsRunning] = useState(initialTimer.isRunning);
  const [secondsRemaining, setSecondsRemaining] = useState(initialTimer.secondsRemaining);
  const endTimeRef = useRef<number | null>(initialTimer.endAt);
  const activeWorkStartRef = useRef<number | null>(initialTimer.isRunning && initialTimer.mode === 'work' ? Date.now() : null);
  const elapsedWorkSecondsRef = useRef(
    initialTimer.isRunning && initialTimer.mode === 'work'
      ? Math.max(0, initialTimer.workMinutes * 60 - initialTimer.secondsRemaining)
      : 0
  );
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [screenAwake, setScreenAwake] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [sessionRating, setSessionRating] = useState<1 | 2 | 3 | 4 | 5>(5);

  const containerRef = useRef<HTMLDivElement>(null);

  const releaseWakeLock = async () => {
    const wakeLock = wakeLockRef.current;
    wakeLockRef.current = null;
    setScreenAwake(false);
    if (wakeLock) {
      try {
        await wakeLock.release();
      } catch (error) {
        console.warn('Screen wake lock could not be released:', error);
      }
    }
  };

  const requestWakeLock = async () => {
    const wakeLockApi = navigator.wakeLock;
    if (!wakeLockApi || document.visibilityState !== 'visible') return;
    try {
      wakeLockRef.current = await wakeLockApi.request('screen');
      setScreenAwake(true);
      wakeLockRef.current.addEventListener('release', () => setScreenAwake(false));
    } catch (error) {
      console.warn('Screen wake lock is unavailable:', error);
    }
  };

  // Sync ambient sound when selection changes
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      ambientAudio.play(ambientSound, 0.4);
    } else {
      ambientAudio.stop();
    }
    return () => ambientAudio.stop();
  }, [ambientSound, isRunning]);

  // Persist the timer locally so an offline refresh can restore its current state.
  useEffect(() => {
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({
        mode,
        workMinutes,
        shortBreakMinutes: breakMinutes,
        longBreakMinutes,
        secondsRemaining,
        completedWorkSessions,
        longBreakEvery,
        isRunning,
        endAt: endTimeRef.current
      } satisfies SavedTimer));
    } catch (error) {
      console.error('Focus timer state could not be saved:', error);
    }
  }, [breakMinutes, completedWorkSessions, isRunning, longBreakEvery, longBreakMinutes, mode, secondsRemaining, workMinutes]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) void requestWakeLock();
      if (document.visibilityState !== 'visible') void releaseWakeLock();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void releaseWakeLock();
    };
  }, [isRunning]);

  // A timestamp deadline keeps the timer accurate while background tabs are throttled.
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + secondsRemaining * 1000;
      }

      interval = window.setInterval(() => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
        setSecondsRemaining(diff);

        if (diff <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          endTimeRef.current = null;
          ambientAudio.stop();
          void releaseWakeLock();
          ambientAudio.playNotification();

          if (mode === 'work') {
            if (activeWorkStartRef.current !== null) {
              elapsedWorkSecondsRef.current += Math.max(0, (now - activeWorkStartRef.current) / 1000);
              activeWorkStartRef.current = null;
            }
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            setShowCompletionModal(true);
          } else {
            setMode('work');
            setSecondsRemaining(workMinutes * 60);
            activeWorkStartRef.current = null;
          }
        }
      }, 500);
    } else {
      endTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, mode, workMinutes]);

  const handleStart = async () => {
    endTimeRef.current = Date.now() + secondsRemaining * 1000;
    if (mode === 'work' && activeWorkStartRef.current === null) activeWorkStartRef.current = Date.now();
    setIsRunning(true);
    await requestWakeLock();
  };

  const handlePause = async () => {
    if (mode === 'work' && activeWorkStartRef.current !== null) {
      elapsedWorkSecondsRef.current += Math.max(0, (Date.now() - activeWorkStartRef.current) / 1000);
      activeWorkStartRef.current = null;
    }
    setIsRunning(false);
    endTimeRef.current = null;
    await releaseWakeLock();
  };

  const handleReset = () => {
    setIsRunning(false);
    endTimeRef.current = null;
    activeWorkStartRef.current = null;
    elapsedWorkSecondsRef.current = 0;
    const baseMins = mode === 'work' ? workMinutes : mode === 'long-break' ? longBreakMinutes : breakMinutes;
    setSecondsRemaining(baseMins * 60);
    void releaseWakeLock();
  };

  const handlePresetSelect = (wMins: number, bMins: number) => {
    setIsRunning(false);
    endTimeRef.current = null;
    activeWorkStartRef.current = null;
    elapsedWorkSecondsRef.current = 0;
    setWorkMinutes(wMins);
    setBreakMinutes(bMins);
    setLongBreakMinutes(Math.max(15, bMins * 3));
    setMode('work');
    setSecondsRemaining(wMins * 60);
    void releaseWakeLock();
  };

  const handleFinishSession = () => {
    const elapsedSeconds = elapsedWorkSecondsRef.current
      + (activeWorkStartRef.current !== null ? Math.max(0, (Date.now() - activeWorkStartRef.current) / 1000) : 0);
    const actualMinutes = Math.max(1, Math.min(workMinutes, Math.ceil(elapsedSeconds / 60)));
    logFocusSession({
      subjectId: selectedSubjectId,
      durationMinutes: workMinutes,
      actualMinutes,
      type: 'pomodoro',
      completedAt: new Date().toISOString(),
      reflectionNote: reflectionNote.trim() || undefined,
      rating: sessionRating
    });

    setCompletedWorkSessions(count => count + 1);
    const isLongBreak = (completedWorkSessions + 1) % longBreakEvery === 0;
    setShowCompletionModal(false);
    setReflectionNote('');
    activeWorkStartRef.current = null;
    elapsedWorkSecondsRef.current = 0;
    setMode(isLongBreak ? 'long-break' : 'short-break');
    setSecondsRemaining((isLongBreak ? longBreakMinutes : breakMinutes) * 60);
    ambientAudio.playNotification();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(error => {
        console.error('Fullscreen mode could not be enabled:', error);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(error => {
        console.error('Fullscreen mode could not be exited:', error);
      });
    }
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Today's total focus
  const todayStr = toLocalDateKey();
  const todayFocusMinutes = focusSessions
    .filter(fs => localDateKeyFromTimestamp(fs.completedAt) === todayStr)
    .reduce((acc, curr) => acc + (curr.actualMinutes || 0), 0);

  return (
    <div 
      ref={containerRef}
      className={`space-y-6 animate-fade-in pb-12 ${isFullscreen ? 'p-8 bg-theme-bg min-h-screen flex flex-col justify-center' : ''}`}
    >
      {/* Header */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-border">
          <div>
            <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
              <Clock className="w-6 h-6 text-theme-primary" />
              {t('focusTitle')}
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">
              {t('focusSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Award className="w-4 h-4" />
              <span>{todayFocusMinutes} {t('minutes')} {t('today')}</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
              title={isFullscreen ? t('focusExitFullscreen') : t('focusFullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Focus Console */}
      <div className="max-w-xl mx-auto rounded-3xl bg-theme-card border border-theme-border shadow-elevated p-8 sm:p-10 text-center space-y-8 relative overflow-hidden">
        {/* Glow behind timer */}
        <div className={`
          absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700
          ${mode === 'work' ? 'bg-theme-primary' : 'bg-emerald-500'}
        `} />

        {/* Mode & Preset Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
          <button
            onClick={() => handlePresetSelect(25, 5)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${workMinutes === 25 ? 'bg-theme-primary text-white shadow-md' : 'bg-theme-card-hover text-theme-muted hover:text-theme-text'}`}
          >
            25 / 5
          </button>
          <button
            onClick={() => handlePresetSelect(50, 10)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${workMinutes === 50 ? 'bg-theme-primary text-white shadow-md' : 'bg-theme-card-hover text-theme-muted hover:text-theme-text'}`}
          >
            50 / 10
          </button>
          <button
            onClick={() => handlePresetSelect(90, 15)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${workMinutes === 90 ? 'bg-theme-primary text-white shadow-md' : 'bg-theme-card-hover text-theme-muted hover:text-theme-text'}`}
          >
            90 / 15
          </button>
        </div>

        {/* Digital Clock Display */}
        <div className="space-y-2 relative z-10">
          <div className="text-7xl sm:text-8xl font-black text-theme-text font-mono tracking-tight select-none">
            {formattedTime}
          </div>
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${mode === 'work' ? 'bg-theme-primary/10 text-theme-primary' : 'bg-emerald-500/10 text-emerald-600'}`}>
          {mode === 'work' ? t('focusModeWork') : mode === 'long-break' ? t('focusModeLongBreak') : t('focusModeShortBreak')}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-theme-muted">
          <span>{t('focusCycles')}: {completedWorkSessions}</span>
          <label className="flex items-center gap-2">
            <span>{t('focusLongBreakEvery')}</span>
            <select
              value={longBreakEvery}
              onChange={event => setLongBreakEvery(Number(event.target.value))}
              className="rounded-lg border border-theme-border bg-theme-card px-2 py-1 text-theme-text"
            >
              {[2, 3, 4, 5, 6, 8].map(goal => <option key={goal} value={goal}>{goal}</option>)}
            </select>
            <span>{t('focusSessions')}</span>
          </label>
          {screenAwake && <span className="text-emerald-600">{t('focusScreenAwake')}</span>}
          </div>
        </div>

        {/* Subject & Task Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 text-start">
          <div>
            <label className="block text-[11px] font-bold text-theme-muted mb-1">
              المادة قيد الدراسة
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-theme-muted mb-1">
              {t('focusAmbientSound')}
            </label>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value as AmbientSoundType)}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
            >
              <option value="none">{t('focusSoundNone')}</option>
              <option value="rain">{t('focusSoundRain')}</option>
              <option value="white-noise">{t('focusSoundWhiteNoise')}</option>
              <option value="clock">{t('focusSoundClock')}</option>
              <option value="cafe">{t('focusSoundCafe')}</option>
              <option value="sea-waves">{t('focusSoundWaves')}</option>
              <option value="binaural-40">{t('focusSoundBinaural')}</option>
            </select>
          </div>
        </div>

        {/* Play/Pause/Reset Controls */}
        <div className="flex items-center justify-center gap-4 pt-2 relative z-10">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
            title={t('reset')}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover active:scale-95 text-white font-black text-sm shadow-xl shadow-theme-primary/30 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{t('start')}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-sm shadow-xl shadow-amber-600/30 transition"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>{t('pause')}</span>
            </button>
          )}

          {mode === 'work' && <button
            onClick={() => {
              if (confirm('هل ترغب في تسجيل إنهاء هذه الجلسة الآن؟')) {
                void handlePause();
                setShowCompletionModal(true);
              }
            }}
            className="p-3.5 rounded-2xl border border-theme-border text-theme-muted hover:text-emerald-500 hover:bg-emerald-500/10 transition"
            title="تسجيل الإتمام مبكراً"
          >
            <CheckCircle className="w-5 h-5" />
          </button>}
        </div>
      </div>

      {/* Completion & Reflection Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4 text-start"
          >
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-theme-text font-sans">
                {t('focusSessionComplete')}
              </h3>
              <p className="text-xs text-theme-muted">
                أتممت {workMinutes} دقيقة من العمل الذهني المركز!
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-theme-text">
                {t('focusReflectionPrompt')}
              </label>
              <textarea
                rows={3}
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder={t('focusReflectionPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-theme-text">
                تقييم جودة التركيز
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSessionRating(star as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${sessionRating === star ? 'bg-theme-primary text-white border-theme-primary' : 'border-theme-border text-theme-muted'}`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishSession}
              className="w-full py-3 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary-hover active:scale-95 transition"
            >
              حفظ النتيجة والانتقال للاستراحة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
