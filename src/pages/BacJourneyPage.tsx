import React, { useState } from 'react';
import { 
  BookMarked, 
  CheckCircle, 
  Circle, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopicStatus } from '../types';

export const BacJourneyPage: React.FC = () => {
  const { 
    subjects, 
    updateTopicStatus, 
    updateTopicDifficulty, 
    addCustomTopic, 
    updateSubjectCoefficient,
    profile, 
    t 
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [targetChapterId, setTargetChapterId] = useState('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Stage mapping helper
  const stages: { id: TopicStatus; label: string; color: string }[] = [
    { id: 'not_started', label: t('journeyStageNotStarted'), color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    { id: 'learning', label: t('journeyStageLearning'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    { id: 'practising', label: t('journeyStagePractising'), color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    { id: 'revising', label: t('journeyStageRevising'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    { id: 'tested', label: t('journeyStageTested'), color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    { id: 'confident', label: t('journeyStageConfident'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
  ];

  // Compute curriculum progress percentage for subject
  const allTopics = currentSubject?.chapters.flatMap(ch => ch.topics) || [];
  const completedTopics = allTopics.filter(tp => tp.status === 'tested' || tp.status === 'confident').length;
  const progressPercent = allTopics.length > 0 ? Math.round((completedTopics / allTopics.length) * 100) : 0;

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !targetChapterId || !currentSubject) return;
    addCustomTopic(currentSubject.id, targetChapterId, newTopicTitle.trim());
    setNewTopicTitle('');
    setTargetChapterId('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-theme-primary" />
            {t('journeyTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('journeySubtitle')}
          </p>
        </div>

        {/* Overall Stream Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-primary/20 text-xs font-bold self-start md:self-auto">
          <span>شعبة: {profile.streamId.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {subjects.map(s => {
          const isSelected = s.id === currentSubject?.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2
                ${isSelected 
                  ? 'bg-theme-primary text-white shadow-md' 
                  : 'bg-theme-card border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover'}
              `}
            >
              <span>{profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-theme-card-hover text-theme-muted'}`}>
                ×{s.coefficient}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Subject Overview Card */}
      {currentSubject && (
        <div className="rounded-2xl bg-theme-card border border-theme-border shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-theme-text font-sans">
                  {profile.preferredLanguage === 'ar' ? currentSubject.nameAr : currentSubject.nameFr}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-primary/20">
                  {t('journeyCoeff')} {currentSubject.coefficient}
                </span>
              </div>
              <p className="text-xs text-theme-muted mt-1">
                إجمالي الدروس والمحاور المسجلة: {allTopics.length} درس
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-60 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-theme-muted">{t('journeyCompletion')}:</span>
                <span className="text-theme-primary font-sans">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-theme-card-hover overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-theme-primary to-theme-accent transition-all duration-500 rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters & Topics Accordion */}
      <div className="space-y-4">
        {currentSubject?.chapters.map(chapter => (
          <div 
            key={chapter.id}
            className="rounded-2xl bg-theme-card border border-theme-border shadow-card overflow-hidden"
          >
            {/* Chapter Header */}
            <div className="p-4 bg-theme-card-hover/60 border-b border-theme-border flex items-center justify-between">
              <h3 className="font-bold text-sm text-theme-text font-sans">
                {profile.preferredLanguage === 'ar' ? chapter.titleAr : chapter.titleFr}
              </h3>

              <span className="text-[11px] text-theme-muted font-medium">
                {chapter.topics.length} دروس
              </span>
            </div>

            {/* Topics Table/List */}
            <div className="divide-y divide-theme-border">
              {chapter.topics.map(topic => (
                <div 
                  key={topic.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-theme-card-hover/30 transition text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-theme-text">
                        {profile.preferredLanguage === 'ar' ? topic.titleAr : topic.titleFr}
                      </span>
                      {topic.isDifficult && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          {t('journeyMarkDifficult')}
                        </span>
                      )}
                    </div>
                    {topic.lastRevisedDate && (
                      <span className="text-[10px] text-theme-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        آخر مراجعة: {topic.lastRevisedDate}
                      </span>
                    )}
                  </div>

                  {/* Stage Selector */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Stage Selector Dropdown */}
                    <select
                      value={topic.status}
                      onChange={(e) => updateTopicStatus(currentSubject.id, topic.id, e.target.value as TopicStatus)}
                      className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs font-bold focus:outline-none focus:border-theme-primary"
                    >
                      {stages.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    {/* Toggle Difficult */}
                    <button
                      onClick={() => updateTopicDifficulty(currentSubject.id, topic.id, topic.difficulty, !topic.isDifficult)}
                      className={`p-1.5 rounded-lg border text-[11px] font-bold transition ${topic.isDifficult ? 'bg-rose-500/15 border-rose-400 text-rose-600' : 'border-theme-border text-theme-muted hover:text-theme-text'}`}
                      title="تحديد كمحور صعب يحتاج تكثيفاً"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Topic to Chapter */}
            <div className="p-3 bg-theme-card-hover/20 border-t border-theme-border">
              {targetChapterId === chapter.id ? (
                <form onSubmit={handleAddTopicSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="اسم الدرس أو المحور الجديد..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold"
                  >
                    {t('add')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetChapterId('')}
                    className="px-2.5 py-1.5 rounded-xl border border-theme-border text-theme-muted text-xs"
                  >
                    {t('cancel')}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setTargetChapterId(chapter.id)}
                  className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('journeyAddTopic')}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
