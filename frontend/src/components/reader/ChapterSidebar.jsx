import { BookOpen, List } from 'lucide-react';

const chapters = Array.from({ length: 20 }, (_, i) => i + 1);

export default function ChapterSidebar() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-[var(--color-panel-border)] bg-[var(--bg-card-secondary)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-left text-lg font-extrabold text-white">
          <List size={19} strokeWidth={2.3} />
          Chapters
        </h2>
        <span className="rounded-md bg-white/[0.08] px-2 py-1 text-[11px] font-bold text-white/[0.65]">{chapters.length}</span>
      </div>

      <div className="panel-scroll grid flex-1 grid-cols-4 gap-2.5 overflow-y-auto pr-1">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            type="button"
            aria-label={`Open chapter ${chapter}`}
            className={`aspect-square w-full rounded-lg text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text-yellow)] ${
              chapter === 1
                ? 'bg-[var(--text-yellow)] text-black'
                : 'bg-white/[0.08] text-white hover:bg-[var(--text-yellow)] hover:text-black'
            }`}
          >
            {chapter}
          </button>
        ))}
      </div>

      <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--text-yellow)] py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5">
        <BookOpen size={16} strokeWidth={2.4} />
        View all chapters
      </button>
    </div>
  );
}
