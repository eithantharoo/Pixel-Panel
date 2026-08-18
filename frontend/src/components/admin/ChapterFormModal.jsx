import { useState } from 'react';
import { FileText, Link2, UploadCloud, X } from 'lucide-react';
import { uploadChapterPdf } from '../../services/pdfService';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

const FIELD_CLASS =
  'rounded-lg border border-[var(--home-border)] bg-black/20 px-3 py-2.5 text-[var(--home-text)] transition-colors focus:border-[var(--home-accent)] focus:outline-none';

export default function ChapterFormModal({ initialValues, existingChapters = [], onCancel, onSubmit }) {
  const { t } = useTranslation();
  const [sourceType, setSourceType] = useState(initialValues?.pdfFileId ? 'pdf' : 'url');

  // Numbers already taken by *other* chapters — editing a chapter must still
  // allow keeping its own current number.
  const usedNumbers = new Set(
    existingChapters.filter((c) => c._id !== initialValues?._id).map((c) => c.number)
  );
  const maxNumber = existingChapters.reduce((max, c) => Math.max(max, c.number), 0);
  const nextAvailable = maxNumber + 1;

  const [form, setForm] = useState({
    number: initialValues?.number ?? nextAvailable,
    title: initialValues?.title ?? '',
    contentUrl: initialValues?.contentUrl ?? '',
    isPublished: initialValues?.isPublished ?? true,
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(
    initialValues?.pdfFileId
      ? { fileId: initialValues.pdfFileId, filename: initialValues.pdfFilename, size: initialValues.pdfSize }
      : null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const number = Number(form.number);
    if (!Number.isInteger(number) || number < 1) {
      setError(t('Chapter number must be a positive whole number'));
      return;
    }
    if (usedNumbers.has(number)) {
      setError(t('Chapter number already exists for this story'));
      return;
    }

    if (sourceType === 'url' && !form.contentUrl.trim()) {
      setError(t('Chapter URL is required'));
      return;
    }
    if (sourceType === 'pdf' && !pdfFile && !existingPdf) {
      setError(t('Please choose a PDF file'));
      return;
    }

    try {
      const payload = {
        number,
        title: form.title.trim(),
        isPublished: form.isPublished,
      };

      if (sourceType === 'url') {
        payload.contentUrl = form.contentUrl.trim();
        payload.pdfFileId = null;
        payload.pdfFilename = '';
        payload.pdfSize = 0;
      } else {
        payload.contentUrl = '';
        if (pdfFile) {
          setUploading(true);
          const token = loadAuth()?.token;
          const uploaded = await uploadChapterPdf(pdfFile, token);
          payload.pdfFileId = uploaded.fileId;
          payload.pdfFilename = uploaded.filename;
          payload.pdfSize = uploaded.size;
        } else {
          payload.pdfFileId = existingPdf.fileId;
          payload.pdfFilename = existingPdf.filename;
          payload.pdfSize = existingPdf.size;
        }
      }

      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
    setExistingPdf(null);
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] shadow-[var(--shadow-card)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--home-border)] px-6 py-4">
          <h2 className="text-lg font-extrabold text-[var(--home-text)]">
            {initialValues ? t('Edit Chapter') : t('New Chapter')}
          </h2>
          <button type="button" className="bg-transparent text-[var(--home-text-muted)] transition-colors hover:text-[var(--home-text)]" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form className="panel-scroll flex flex-col gap-4 overflow-y-auto px-6 py-5" onSubmit={handleSubmit}>
          {error && <p className="text-sm font-semibold text-[#ff8fa3]">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm text-[var(--home-text-muted)]">
              {t('Chapter Number')}
              <input
                type="number"
                required
                min={1}
                step={1}
                className={FIELD_CLASS}
                value={form.number}
                onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
              />
              {usedNumbers.has(Number(form.number)) ? (
                <span className="text-xs font-semibold text-[#ff8fa3]">{t('Chapter number already exists for this story')}</span>
              ) : (
                <span className="text-xs text-[var(--home-text-muted)]">{t('Next available')}: {nextAvailable}</span>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-[var(--home-text-muted)]">
              {t('Chapter Title')}
              <input
                required
                className={FIELD_CLASS}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-[var(--home-text-muted)]">{t('Chapter Source')}</span>
            <div className="flex gap-2 rounded-xl border border-[var(--home-border)] bg-black/20 p-1">
              <button
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${sourceType === 'url' ? 'bg-[var(--home-accent)] text-black' : 'bg-transparent text-[var(--home-text-muted)] hover:text-[var(--home-text)]'}`}
                onClick={() => setSourceType('url')}
              >
                <Link2 size={14} aria-hidden="true" />
                {t('URL')}
              </button>
              <button
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${sourceType === 'pdf' ? 'bg-[#4df5ff] text-black' : 'bg-transparent text-[var(--home-text-muted)] hover:text-[var(--home-text)]'}`}
                onClick={() => setSourceType('pdf')}
              >
                <FileText size={14} aria-hidden="true" />
                {t('PDF Upload')}
              </button>
            </div>

            {sourceType === 'url' ? (
              <label className="flex flex-col gap-1.5 text-sm text-[var(--home-text-muted)]">
                <input
                  type="url"
                  placeholder="https://your-cdn.example.com/chapter-1.jpg"
                  className={FIELD_CLASS}
                  value={form.contentUrl}
                  onChange={(e) => setForm((p) => ({ ...p, contentUrl: e.target.value }))}
                />
                <span className="text-xs text-[var(--home-text-muted)]">{t('The page readers see for this chapter. Sites that allow it show embedded here; others show a "Read Chapter" link-out button instead.')}</span>
              </label>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--home-border)] bg-black/20 px-3 py-6 text-center text-sm text-[var(--home-text-muted)] transition-colors hover:border-[#4df5ff]">
                  <UploadCloud size={22} aria-hidden="true" />
                  {pdfFile ? (
                    <span className="font-semibold text-[var(--home-text)]">{pdfFile.name} · {formatBytes(pdfFile.size)}</span>
                  ) : existingPdf ? (
                    <span className="font-semibold text-[var(--home-text)]">{existingPdf.filename} · {formatBytes(existingPdf.size)}</span>
                  ) : (
                    <span>{t('Click to choose a PDF file')}</span>
                  )}
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
                <span className="text-xs text-[var(--home-text-muted)]">{t('Up to 50MB. Stored in the database and streamed to readers.')}</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--home-text-muted)]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
            />
            {t('Published')}
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" className="btn-purple rounded-xl px-4 py-2 text-sm font-semibold" onClick={onCancel}>
              {t('Cancel')}
            </button>
            <button type="submit" className="btn-yellow rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-60" disabled={uploading}>
              {uploading ? t('Uploading...') : t('Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
