import React, { useState } from 'react';
import { 
  FolderLock, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Tag, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';

export const StudySpacePage: React.FC = () => {
  const { notes, subjects, addNote, updateNote, deleteNote, profile, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  
  // Note form state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const filteredNotes = notes.filter(n => {
    if (selectedSubjectFilter !== 'all' && n.subjectId !== selectedSubjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchTag = n.tags.some(tg => tg.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setTagsStr('');
    setIsPinned(false);
    setShowModal(true);
  };

  const handleOpenEdit = (n: NoteItem) => {
    setEditingNoteId(n.id);
    setTitle(n.title);
    setSubjectId(n.subjectId);
    setContent(n.content);
    setTagsStr(n.tags.join(', '));
    setIsPinned(n.isPinned);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: title.trim(),
        subjectId,
        content: content.trim(),
        tags,
        isPinned
      });
    } else {
      addNote({
        title: title.trim(),
        subjectId,
        content: content.trim(),
        tags,
        isPinned
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h1 className="text-2xl font-black text-theme-text font-sans flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-theme-primary" />
            {t('spaceTitle')}
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            {t('spaceSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-md shadow-theme-primary/20 hover:bg-theme-primary-hover active:scale-95 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('spaceAddNote')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-card p-3 rounded-2xl border border-theme-border shadow-subtle text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-theme-muted absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('spaceSearchPlaceholder')}
            className="w-full pr-9 pl-3 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
        >
          <option value="all">كل المواد</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {profile.preferredLanguage === 'ar' ? s.nameAr : s.nameFr}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(n => {
            const subj = subjects.find(s => s.id === n.subjectId);
            return (
              <div
                key={n.id}
                className={`
                  p-5 rounded-2xl bg-theme-card border transition-all flex flex-col justify-between space-y-4 shadow-card hover:border-theme-primary/40
                  ${n.isPinned ? 'border-theme-primary/50 bg-theme-primary-light/5' : 'border-theme-border'}
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {subj && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary">
                        {profile.preferredLanguage === 'ar' ? subj.nameAr : subj.nameFr}
                      </span>
                    )}

                    {n.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-theme-primary">
                        <Pin className="w-3 h-3 fill-theme-primary" />
                        <span>مثبتة</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-theme-text font-sans">
                    {n.title}
                  </h3>

                  <p className="text-xs text-theme-muted leading-relaxed whitespace-pre-wrap line-clamp-6">
                    {n.content}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-theme-border">
                  {/* Tags */}
                  {n.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {n.tags.map((tg, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-theme-card-hover text-theme-muted font-medium">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between text-[11px] text-theme-muted">
                    <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-card-hover transition"
                        title={t('edit')}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-theme-border p-12 text-center space-y-3 bg-theme-card/50">
            <FolderLock className="w-10 h-10 text-theme-muted mx-auto opacity-50" />
            <p className="text-sm font-semibold text-theme-muted">{t('spaceEmpty')}</p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow hover:bg-theme-primary-hover transition"
            >
              {t('spaceAddNote')}
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-theme-card border border-theme-border shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-bold text-base text-theme-text">
              {editingNoteId ? 'تعديل الملاحظة' : t('spaceAddNote')}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-theme-text mb-1">
                  عنوان الملخص أو القانون *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: القوانين الأساسية في الدارة الكهربائية RC..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  المادة *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
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
                <label className="block font-bold text-theme-text mb-1">
                  المحتوى والنص الكامل *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب ملاحظاتك، القوانين الذهبية، أو روابطك المهمة هنا..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs focus:outline-none focus:border-theme-primary leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  الوسوم (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="فيزياء, قوانين, مراجعة_نهائية"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-theme-text text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNoteCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-theme-primary focus:ring-0"
                />
                <label htmlFor="pinNoteCheck" className="text-theme-text font-bold cursor-pointer">
                  {t('spacePinNote')}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-theme-border text-theme-muted hover:text-theme-text text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover active:scale-95 transition"
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
