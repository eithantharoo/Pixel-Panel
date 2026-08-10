import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const CHAPTER_COUNT = 20;
const chapters = Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1);

export default function ChapterSidebar({ currentChapter = 1, onChapterSelect, readDirection = 'ltr', onChapterEnd }) {
  const isRtl = readDirection === 'rtl';
  const displayChapters = isRtl ? [...chapters].reverse() : chapters;

  function goToPrev() {
    if (isRtl) {
      if (currentChapter < CHAPTER_COUNT) onChapterSelect?.(currentChapter + 1);
    } else {
      if (currentChapter > 1) onChapterSelect?.(currentChapter - 1);
    }
  }

  function goToNext() {
    if (isRtl) {
      if (currentChapter > 1) onChapterSelect?.(currentChapter - 1);
      else onChapterEnd?.();
    } else {
      if (currentChapter < CHAPTER_COUNT) onChapterSelect?.(currentChapter + 1);
      else onChapterEnd?.();
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-[1.75rem] border border-[var(--home-border)] bg-[var(--home-panel)] px-5 py-6 shadow-[0_12px_28px_rgba(47,28,56,0.2)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-center text-[1.4rem] font-extrabold text-[var(--home-text)]">
          Chapters
        </h2>
        {/* Prev / Next navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isRtl ? 'Next chapter' : 'Previous chapter'}
            onClick={goToPrev}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,244,61,0.25)] bg-[var(--home-panel-deep)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-accent)] hover:text-[var(--home-ink)]"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[2.5rem] text-center text-xs font-bold text-[var(--home-accent)]">
            {currentChapter}/{CHAPTER_COUNT}
          </span>
          <button
            type="button"
            aria-label={isRtl ? 'Previous chapter' : 'Next chapter'}
            onClick={goToNext}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,244,61,0.25)] bg-[var(--home-panel-deep)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-accent)] hover:text-[var(--home-ink)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {isRtl && (
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--home-text-muted)]">
          ← Right to Left
        </p>
      )}

      <div className="panel-scroll grid flex-1 grid-cols-4 auto-rows-[3.4rem] content-start gap-4 overflow-y-auto px-1">
        {displayChapters.map((chapter) => (
          <button
            key={chapter}
            type="button"
            aria-label={`Open chapter ${chapter}`}
            className={`w-full rounded-xl border border-[rgba(255,244,61,0.28)] text-sm font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] ${
              chapter === currentChapter
                ? 'bg-[var(--home-accent)] text-[var(--home-ink)]'
                : 'bg-[var(--home-panel-deep)] text-[var(--home-text)] hover:bg-[var(--home-accent)] hover:text-[var(--home-ink)]'
            }`}
            onClick={() => onChapterSelect?.(chapter)}
          >
            {chapter}
          </button>
        ))}
      </div>

      <button type="button" onClick={goToNext} className="mt-6 inline-flex min-h-[4.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--home-accent)] px-4 py-5 text-base font-bold text-[var(--home-ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--home-accent-hover)]">
        <BookOpen size={16} strokeWidth={2.4} />
        {currentChapter < CHAPTER_COUNT ? `Next — Ch. ${isRtl ? currentChapter - 1 : currentChapter + 1}` : 'Finished'}
      </button>
    </div>
  );
}
