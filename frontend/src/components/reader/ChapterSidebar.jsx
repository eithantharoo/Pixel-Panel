import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../utils/i18n/I18nContext';

export default function ChapterSidebar({
  currentChapter = 1,
  totalChapters = 20,
  onChapterSelect,
  readDirection = 'ltr',
  onChapterEnd,
}) {
  const { t } = useTranslation();
  const isRtl = readDirection === 'rtl';
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);
  const displayChapters = isRtl ? [...chapters].reverse() : chapters;

  const isAtStart = isRtl ? currentChapter === totalChapters : currentChapter === 1;
  const isAtEnd = isRtl ? currentChapter === 1 : currentChapter === totalChapters;

  function goToPrev() {
    if (isRtl) {
      if (currentChapter < totalChapters) onChapterSelect?.(currentChapter + 1);
    } else {
      if (currentChapter > 1) onChapterSelect?.(currentChapter - 1);
    }
  }

  function goToNext() {
    if (isRtl) {
      if (currentChapter > 1) onChapterSelect?.(currentChapter - 1);
      else onChapterEnd?.();
    } else {
      if (currentChapter < totalChapters) onChapterSelect?.(currentChapter + 1);
      else onChapterEnd?.();
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-[1.5rem] border border-[var(--home-border)] bg-[var(--home-panel)] px-3 py-4 shadow-[0_12px_28px_rgba(47,28,56,0.2)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-[var(--home-text)]">
          {t('Chapters')}
        </h2>

        {/* Top Prev/Next Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isRtl ? t('Next chapter') : t('Previous chapter')}
            onClick={goToPrev}
            disabled={isAtStart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,244,61,0.25)] bg-[var(--home-panel-deep)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-accent)] hover:text-black disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[2.5rem] text-center text-xs font-bold text-[var(--home-accent)]">
            {currentChapter}/{totalChapters}
          </span>
          <button
            type="button"
            aria-label={isRtl ? t('Previous chapter') : t('Next chapter')}
            onClick={goToNext}
            disabled={isAtEnd}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,244,61,0.25)] bg-[var(--home-panel-deep)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-accent)] hover:text-black disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* RTL Indicator */}
      {isRtl && (
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--home-text-muted)]">
          ← Right to Left
        </p>
      )}

      {/* Chapter Grid (Numbered buttons) */}
      <div className="panel-scroll flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-4 gap-2">
          {displayChapters.map((chapter) => {
            const isSelected = chapter === currentChapter;
            return (
              <button
                key={chapter}
                type="button"
                aria-label={`Open chapter ${chapter}`}
                onClick={() => onChapterSelect?.(chapter)}
                className={`flex h-10 w-full items-center justify-center rounded-lg border border-[rgba(255,244,61,0.28)] text-sm font-extrabold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] active:scale-95 ${
                  isSelected
                    ? 'bg-[var(--home-accent)] text-black'
                    : 'bg-[var(--home-panel-deep)] text-[var(--home-text)] hover:bg-[var(--home-accent)] hover:text-black'
                }`}
              >
                {chapter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Original Main Button Text with Black Color */}
      <button
        type="button"
        onClick={goToNext}
        className="mt-4 inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--home-accent)] px-3 py-4 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-[var(--home-accent-hover)]"
      >
        <BookOpen size={16} strokeWidth={2.4} className="text-black" />
        <span className="text-black">
          {currentChapter < totalChapters
            ? `${t('Next')} — Ch. ${isRtl ? currentChapter - 1 : currentChapter + 1}`
            : t('Finished')}
        </span>
      </button>
    </div>
  );
}