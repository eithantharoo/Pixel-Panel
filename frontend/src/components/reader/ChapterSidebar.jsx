import { BookOpen, List } from 'lucide-react';

const chapters = Array.from({ length: 20 }, (_, i) => i + 1);

export default function ChapterSidebar() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-[var(--home-border)] bg-[var(--home-panel)] p-5 shadow-[0_12px_28px_rgba(47,28,56,0.2)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-left text-lg font-extrabold text-[var(--home-accent)]">
          <List size={19} strokeWidth={2.3} />
          Chapters
        </h2>
        <span className="rounded-md bg-[var(--home-panel-deep)] px-2 py-1 text-[11px] font-bold text-[var(--home-text-muted)]">{chapters.length}</span>
      </div>

      <div className="panel-scroll grid flex-1 grid-cols-4 gap-2.5 overflow-y-auto pr-1">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            type="button"
            aria-label={`Open chapter ${chapter}`}
            className={`aspect-square w-full rounded-lg border border-[var(--home-border)] text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] ${
              chapter === 1
                ? 'bg-[var(--home-accent)] text-[var(--home-ink)]'
                : 'bg-[var(--home-panel-deep)] text-[var(--home-text)] hover:bg-[var(--home-accent)] hover:text-[var(--home-ink)]'
            }`}
          >
            {chapter}
          </button>
        ))}
      </div>

      <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--home-accent)] py-3 text-sm font-bold text-[var(--home-ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--home-accent-hover)]">
        <BookOpen size={16} strokeWidth={2.4} />
        View all chapters
      </button>
    </div>
  );
}
