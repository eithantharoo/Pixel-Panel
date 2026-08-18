import { useEffect, useState } from 'react';
import { Check, FileText, Layers, Link2, Pencil, Plus, Sparkles, Trash2, UploadCloud, X } from 'lucide-react';
import { createStory, updateStory } from '../../services/storyService';
import { createChapter } from '../../services/chapterService';
import { getAdminChapters, updateChapter, deleteChapter } from '../../services/adminService';
import { uploadChapterPdf } from '../../services/pdfService';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';
import { GENRE_ID_TO_LABEL } from '../../utils/genreMap';
import ChapterFormModal from './ChapterFormModal';

const STATUS_OPTIONS = ['ongoing', 'completed', 'hiatus'];
const GENRE_OPTIONS = Object.entries(GENRE_ID_TO_LABEL);
const FIELD_CLASS =
  'w-full rounded-xl border border-[var(--home-border)] bg-black/20 px-3.5 py-2.5 text-sm text-[var(--home-text)] transition-colors focus:border-[var(--home-accent)] focus:outline-none';
const LABEL_CLASS = 'flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[var(--home-text-muted)]';

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

function emptyForm() {
  return { title: '', description: '', cover: '', banner: '', author: '', status: 'ongoing', isFeatured: false, chapterUrl: '' };
}

export default function StoryEditor({ story, onCreated, onUpdated, onCancel, onChaptersChanged }) {
  const { t } = useTranslation();
  const auth = loadAuth();
  const isEdit = Boolean(story?._id);

  const [form, setForm] = useState(emptyForm());
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [chapterSourceType, setChapterSourceType] = useState('url');
  const [chapterPdfFile, setChapterPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [chapters, setChapters] = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chapterFormTarget, setChapterFormTarget] = useState(null); // null | 'new' | chapter object

  useEffect(() => {
    Promise.resolve().then(() => {
      setForm(
        story
          ? {
              title: story.title ?? '',
              description: story.description ?? '',
              cover: story.cover ?? '',
              banner: story.banner ?? '',
              author: story.author ?? '',
              status: story.status ?? 'ongoing',
              isFeatured: story.isFeatured ?? false,
              chapterUrl: '',
            }
          : emptyForm()
      );
      setSelectedGenres(story?.genres ?? []);
      setChapterPdfFile(null);
      setChapterSourceType('url');
      setError('');
    });
  }, [story]);

  function refreshChapters() {
    if (!story?._id) return;
    setChaptersLoading(true);
    getAdminChapters(story._id, auth?.token)
      .then(setChapters)
      .catch((err) => setError(err.message))
      .finally(() => setChaptersLoading(false));
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      if (story?._id) refreshChapters();
      else setChapters([]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?._id]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGenre(label) {
    setSelectedGenres((prev) => (prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]));
  }

  function handleChapterFileChange(e) {
    const file = e.target.files?.[0];
    if (file) setChapterPdfFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (selectedGenres.length === 0) {
      setError(t('Select at least one genre'));
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      cover: form.cover.trim(),
      banner: form.banner.trim(),
      author: form.author.trim(),
      genres: selectedGenres,
      status: form.status,
      isFeatured: form.isFeatured,
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        const updated = await updateStory(story._id, payload, auth?.token);
        onUpdated(updated);
      } else {
        const created = await createStory(payload, auth?.token);

        if (chapterSourceType === 'pdf' && chapterPdfFile) {
          setUploading(true);
          const uploaded = await uploadChapterPdf(chapterPdfFile, auth?.token);
          await createChapter(
            created._id,
            { number: 1, title: 'Chapter 1', pdfFileId: uploaded.fileId, pdfFilename: uploaded.filename, pdfSize: uploaded.size },
            auth?.token
          );
        } else if (chapterSourceType === 'url' && form.chapterUrl.trim()) {
          await createChapter(created._id, { number: 1, title: 'Chapter 1', contentUrl: form.chapterUrl.trim() }, auth?.token);
        }

        onCreated(created);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  async function handleChapterCreate(values) {
    await createChapter(story._id, values, auth?.token);
    setChapterFormTarget(null);
    refreshChapters();
    onChaptersChanged?.();
  }

  async function handleChapterUpdate(values) {
    await updateChapter(chapterFormTarget._id, values, auth?.token);
    setChapterFormTarget(null);
    refreshChapters();
    onChaptersChanged?.();
  }

  async function handleChapterDelete(chapter) {
    if (!window.confirm(t('Are you sure you want to delete this chapter? This cannot be undone.'))) return;
    try {
      await deleteChapter(chapter._id, auth?.token);
      refreshChapters();
      onChaptersChanged?.();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-[var(--home-text)]">
          <Sparkles size={18} className="text-[var(--home-accent)]" aria-hidden="true" />
          {isEdit ? t('Edit Story') : t('Upload New Story')}
        </h3>
        {isEdit && (
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-[var(--home-border)] px-3 py-1.5 text-xs font-semibold text-[var(--home-text-muted)] transition-colors hover:text-[var(--home-text)]"
            onClick={onCancel}
          >
            <X size={13} aria-hidden="true" />
            {t('New Story instead')}
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm font-semibold text-[#ff8fa3]">{error}</p>}

      <form className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASS}>{t('Title')} <span className="text-[#ff8fa3]">*</span></span>
          <input required className={FIELD_CLASS} placeholder={t('Enter story title')} value={form.title} onChange={(e) => update('title', e.target.value)} />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASS}>{t('Description')} <span className="text-[#ff8fa3]">*</span></span>
          <textarea required rows={3} className={`${FIELD_CLASS} resize-y`} placeholder={t('Describe your story...')} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASS}>{t('Cover URL')} <span className="text-[#ff8fa3]">*</span></span>
          <input required className={FIELD_CLASS} placeholder="https://your-cdn.example.com/cover.jpg" value={form.cover} onChange={(e) => update('cover', e.target.value)} />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASS}>{t('Banner URL')}</span>
          <input className={FIELD_CLASS} placeholder="https://your-cdn.example.com/banner.jpg" value={form.banner} onChange={(e) => update('banner', e.target.value)} />
          <span className="text-xs text-[var(--home-text-muted)]">{t('Optional. Wide image shown behind the title in the reader. Falls back to the cover image if left blank.')}</span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>{t('Author')}</span>
          <input required className={FIELD_CLASS} placeholder={t('Author name')} value={form.author} onChange={(e) => update('author', e.target.value)} />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>{t('Status')}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[var(--home-border)] bg-black/20 px-3.5 py-2.5">
            {STATUS_OPTIONS.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[var(--home-text)]">
                <input
                  type="radio"
                  name={`status-${story?._id ?? 'new'}`}
                  checked={form.status === opt}
                  onChange={() => update('status', opt)}
                  className="accent-[var(--home-accent)]"
                />
                {t(opt.charAt(0).toUpperCase() + opt.slice(1))}
              </label>
            ))}
            <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[var(--home-text)]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update('isFeatured', e.target.checked)}
                className="accent-[var(--home-accent)]"
              />
              {t('Featured')}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASS}>
            {t('Genres')} <span className="text-[#ff8fa3]">*</span>
            <span className="ml-1 font-normal normal-case text-[var(--home-text-muted)]">({t('select at least one')})</span>
          </span>
          <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--home-border)] bg-black/20 p-3">
            {GENRE_OPTIONS.map(([id, label]) => {
              const selected = selectedGenres.includes(label);
              return (
                <button
                  key={id}
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selected
                      ? 'border-[var(--home-accent)] bg-[rgba(255,221,0,0.16)] text-[var(--home-accent)]'
                      : 'border-[var(--home-border)] text-[var(--home-text-muted)] hover:text-[var(--home-text)]'
                  }`}
                  aria-pressed={selected}
                  onClick={() => toggleGenre(label)}
                >
                  {selected && <Check size={12} aria-hidden="true" />}
                  {t(`genres.${id}`, label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAPTERS */}
        <div className="flex flex-col gap-3 border-t border-[var(--home-border)] pt-5 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 text-sm font-extrabold text-[var(--home-text)]">
              <Layers size={16} className="text-[var(--home-accent)]" aria-hidden="true" />
              {t('Chapters')}
              {isEdit && (
                <span className="rounded-full bg-[rgba(255,221,0,0.14)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--home-accent)]">
                  {chapters.length} {t('total')}
                </span>
              )}
            </h4>
            {isEdit && (
              <button
                type="button"
                className="btn-yellow flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
                onClick={() => setChapterFormTarget('new')}
              >
                <Plus size={13} aria-hidden="true" />
                {t('Add Chapter')}
              </button>
            )}
          </div>

          {isEdit ? (
            chaptersLoading ? (
              <p className="text-sm text-[var(--home-text-muted)]">{t('Loading...')}</p>
            ) : chapters.length === 0 ? (
              <p className="text-sm text-[var(--home-text-muted)]">{t('No chapters yet')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter._id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--home-border)] bg-black/15 px-4 py-2.5 transition-colors hover:bg-black/25"
                  >
                    <span className="min-w-[32px] text-xs font-extrabold text-[var(--home-accent)]">#{chapter.number}</span>
                    <span className="min-w-[120px] flex-1 text-sm font-medium text-[var(--home-text)]">{chapter.title}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--home-text-muted)]">
                      {chapter.pdfFileId ? <FileText size={12} aria-hidden="true" /> : <Link2 size={12} aria-hidden="true" />}
                      {chapter.pdfFileId ? t('PDF') : t('URL')}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${chapter.isPublished ? 'bg-[rgba(93,214,146,0.16)] text-[#5dd692]' : 'bg-[rgba(255,255,255,0.1)] text-[var(--home-text-muted)]'}`}>
                      {chapter.isPublished ? t('Published') : t('Draft')}
                    </span>
                    <div className="ml-auto flex items-center gap-2 text-[var(--home-text-muted)]">
                      <button type="button" className="transition-colors hover:text-[var(--home-text)]" aria-label={t('Edit')} title={t('Edit')} onClick={() => setChapterFormTarget(chapter)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="transition-colors hover:text-[#ff8fa3]" aria-label={t('Delete')} title={t('Delete')} onClick={() => handleChapterDelete(chapter)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--home-border)] bg-black/15 p-4">
              <span className="text-sm font-semibold text-[var(--home-text)]">{t('Chapter 1')} <span className="font-normal text-[var(--home-text-muted)]">({t('optional')})</span></span>
              <div className="flex gap-2 rounded-xl border border-[var(--home-border)] bg-black/20 p-1">
                <button
                  type="button"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${chapterSourceType === 'url' ? 'bg-[var(--home-accent)] text-black' : 'text-[var(--home-text-muted)] hover:text-[var(--home-text)]'}`}
                  onClick={() => setChapterSourceType('url')}
                >
                  <Link2 size={14} aria-hidden="true" />
                  {t('Upload from URL')}
                </button>
                <button
                  type="button"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${chapterSourceType === 'pdf' ? 'bg-[var(--home-accent)] text-black' : 'text-[var(--home-text-muted)] hover:text-[var(--home-text)]'}`}
                  onClick={() => setChapterSourceType('pdf')}
                >
                  <FileText size={14} aria-hidden="true" />
                  {t('Upload PDF')}
                </button>
              </div>

              {chapterSourceType === 'url' ? (
                <input
                  type="url"
                  placeholder="https://your-cdn.example.com/chapter-1.jpg"
                  className={FIELD_CLASS}
                  value={form.chapterUrl}
                  onChange={(e) => update('chapterUrl', e.target.value)}
                />
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--home-border)] bg-black/20 px-3 py-5 text-center text-sm text-[var(--home-text-muted)] transition-colors hover:border-[var(--home-accent)]">
                  <UploadCloud size={20} aria-hidden="true" />
                  {chapterPdfFile ? (
                    <span className="font-semibold text-[var(--home-text)]">{chapterPdfFile.name} · {formatBytes(chapterPdfFile.size)}</span>
                  ) : (
                    <span>{t('Click to choose a PDF file')}</span>
                  )}
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleChapterFileChange} />
                </label>
              )}
              <span className="text-xs text-[var(--home-text-muted)]">{t('Creates Chapter 1 right away. More chapters can be added after saving.')}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-shrink-0 justify-end gap-3 border-t border-[var(--home-border)] pt-5 sm:col-span-2">
          <button type="button" className="btn-purple rounded-full px-5 py-2.5 text-sm font-semibold" onClick={onCancel}>
            {t('Cancel')}
          </button>
          <button type="submit" className="btn-yellow flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-60" disabled={submitting || uploading}>
            <UploadCloud size={15} aria-hidden="true" />
            {uploading ? t('Uploading...') : submitting ? t('Saving...') : isEdit ? t('Save Changes') : t('Publish Story')}
          </button>
        </div>
      </form>

      {chapterFormTarget && (
        <ChapterFormModal
          initialValues={chapterFormTarget === 'new' ? null : chapterFormTarget}
          existingChapters={chapters}
          onCancel={() => setChapterFormTarget(null)}
          onSubmit={chapterFormTarget === 'new' ? handleChapterCreate : handleChapterUpdate}
        />
      )}
    </div>
  );
}
