import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Clock, 
  Award, 
  ExternalLink, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BACExamResource } from '../types';

interface PracticeLabPageProps {
  onOpenAddPractice: () => void;
}

export const PracticeLabPage: React.FC<PracticeLabPageProps> = ({ onOpenAddPractice }) => {
  const { practiceAttempts, examResources, subjects, profile, t, addExamResource } = useApp();

  const [activeTab, setActiveTab] = useState<'attempts' | 'archive'>('attempts');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Resource Modal State
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResYear, setNewResYear] = useState(2024);
  const [newResSubjectId, setNewResSubjectId] = useState(subjects[0]?.id || '');
  const [newResLink, setNewResLink] = useState('');
  const [newResNotes, setNewResNotes] = useState('');

  const filteredAttempts = practiceAttempts.filter(att => {
    if (selectedSubjectFilter !== 'all' && att.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  const filteredResources = examResources.filter(res => {
    if (selectedSubjectFilter !== 'all' && res.subjectId !== selectedSubjectFilter) return false;
    if (searchQuery.trim() && !res.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate average practice score
  const avgScore = practiceAttempts.length > 0
    ? (practiceAttempts.reduce((acc, curr) => acc + curr.scoreOutOf20, 0) / practiceAttempts.length).toFixed(1)
    : '0.0';

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResSubjectId) return;

    addExamResource({
      year: Number(newResYear) || 2024,
      streamId: profile.streamId,
      subjectId: newResSubjectId,
      session: 'principal',
      title: newResTitle.trim(),
      description: 'مورد دراسي وموضوع أضافه الطالب',
      linkOrFile: newResLink.trim() || '#',
      solutionNotes: newResNotes.trim() || 'حل شخصي مسجل',
      isOfficialVerified: false,
      isDemoSample: false
    });

    setShowAddResourceModal(false);
    setNewResTitle('');
    setNewResLink('');
    setNewResNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-sky-500" />
            {t('practiceTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('practiceSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowAddResourceModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-theme-border text-theme-text hover:bg-theme-card-hover text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('practiceAddResource')}</span>
          </button>

          <button
            onClick={onOpenAddPractice}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('practiceLogAttempt')}</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-card p-3 rounded-2xl border border-theme-border shadow-subtle">
        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-theme-card-hover p-1 rounded-xl border border-theme-border/60">
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'attempts' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            نتائج الاختبارات الذاتية ({practiceAttempts.length})
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'archive' ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
          >
            أرشيف ومواضيع البكالوريا ({examResources.length})
          </button>
        </div>

        {/* Subject filter */}
        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
        >
          <option value="all">كل المواد</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
            </option>
          ))}
        </select>
      </div>

      {/* Attempts View */}
      {activeTab === 'attempts' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">متوسط علامات التمارين</span>
                <span className="text-2xl font-black text-theme-primary font-sans">{avgScore} / 20</span>
              </div>
              <div className="p-2.5 rounded-xl bg-theme-primary/10 text-theme-primary">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">إجمالي جلسات التدريب</span>
                <span className="text-2xl font-black text-theme-text font-sans">{practiceAttempts.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-muted block">دقائق التدريب تحت الضغط</span>
                <span className="text-2xl font-black text-theme-text font-sans">
                  {practiceAttempts.reduce((acc, c) => acc + c.timeSpentMinutes, 0)} {t('minutes')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Attempts List */}
          <div className="space-y-3">
            {filteredAttempts.length > 0 ? (
              filteredAttempts.map(att => {
                const subj = subjects.find(s => s.id === att.subjectId);
                return (
                  <div
                    key={att.id}
                    className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        {subj && (
                          <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                            {profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr}
                          </span>
                        )}
                        <span className="text-theme-muted text-[11px]">{att.date}</span>
                      </div>

                      <h4 className="font-bold text-sm text-theme-text truncate">
                        {att.title}
                      </h4>

                      {att.notes && (
                        <p className="text-theme-muted line-clamp-1 italic">
                          {att.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center flex-shrink-0">
                      <div className="text-end">
                        <span className="text-lg font-black text-theme-primary font-sans block">
                          {att.scoreOutOf20} / 20
                        </span>
                        <span className="text-[10px] text-theme-muted font-medium">
                          {att.correctQuestions} من {att.totalQuestions} أسئلة ({att.timeSpentMinutes} د)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-theme-border p-12 text-center space-y-3 bg-theme-card/50">
                <FlaskConical className="w-10 h-10 text-theme-muted mx-auto opacity-50" />
                <p className="text-sm font-semibold text-theme-muted">{t('practiceEmpty')}</p>
                <button
                  onClick={onOpenAddPractice}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow transition"
                >
                  {t('practiceLogAttempt')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Archive View */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            {t('practiceDemoNotice')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(res => {
              const subj = subjects.find(s => s.id === res.subjectId);
              return (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-theme-card border border-theme-border hover:border-sky-400 shadow-card transition flex flex-col justify-between space-y-4 text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                        {subj ? (profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr) : ''}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-card-hover font-bold text-theme-text font-mono">
                        BAC {res.year}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-theme-text">
                      {res.title}
                    </h4>

                    <p className="text-theme-muted text-[11px] leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                    <span className="text-[10px] text-theme-muted italic">
                      {res.isOfficialVerified ? '✓ موثق رسمي' : 'نموذج دراسي'}
                    </span>

                    {res.linkOrFile && res.linkOrFile !== '#' ? (
                      <a
                        href={res.linkOrFile}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold hover:underline"
                      >
                        <span>فتح الرابط</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-theme-muted">مدرج للتوضيح</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4"
          >
            <h3 className="font-bold text-base text-theme-text">
              {t('practiceAddResource')}
            </h3>

            <form onSubmit={handleAddResourceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-theme-text mb-1">
                  عنوان الموضوع أو الملخص *
                </label>
                <input
                  type="text"
                  required
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="مثال: حوليات البكالوريا 2024 علوم..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    المادة *
                  </label>
                  <select
                    value={newResSubjectId}
                    onChange={(e) => setNewResSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    السنة
                  </label>
                  <input
                    type="number"
                    value={newResYear}
                    onChange={(e) => setNewResYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  رابط الموضوع أو ملف Drive
                </label>
                <input
                  type="url"
                  value={newResLink}
                  onChange={(e) => setNewResLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-theme-border text-theme-muted"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-theme-primary text-white font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
