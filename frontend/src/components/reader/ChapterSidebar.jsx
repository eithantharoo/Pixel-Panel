import { BookOpen } from 'lucide-react';

const chapters = Array.from({ length: 20 }, (_, i) => i + 1);

export default function ChapterSidebar() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-[1.75rem] border border-[var(--home-border)] bg-[var(--home-panel)] px-5 py-6 shadow-[0_12px_28px_rgba(47,28,56,0.2)]">
      <div className="mb-5 flex items-center justify-center gap-3">
        <h2 className="text-center text-[1.75rem] font-extrabold text-[var(--home-text)]">
          Chapters
        </h2>
      </div>

      <div className="panel-scroll grid flex-1 grid-cols-4 auto-rows-[3.4rem] content-start gap-4 overflow-y-auto px-1">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            type="button"
            aria-label={`Open chapter ${chapter}`}
            className="w-full rounded-xl border border-[rgba(255,244,61,0.28)] bg-[var(--home-accent)] text-sm font-extrabold text-[var(--home-ink)] transition-colors hover:bg-[var(--home-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]"
          >
            {chapter}
          </button>
        ))}
      </div>

      <button type="button" className="mt-6 inline-flex min-h-[4.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--home-accent)] px-4 py-5 text-base font-bold text-[var(--home-ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--home-accent-hover)]">
        <BookOpen size={16} strokeWidth={2.4} />
        View all chapters
      </button>
    </div>
  );
}
