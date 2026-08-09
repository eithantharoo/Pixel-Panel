import { BookOpen } from 'lucide-react';

const soloLevelingChapters = [
  { number: 1, title: 'The Hunter of Hunters' },
  { number: 2, title: 'The Double Dungeon' },
  { number: 3, title: 'Three Rules' },
  { number: 4, title: 'The Trial' },
  { number: 5, title: 'The Daily Quest' },
  { number: 6, title: 'The Instance Dungeon' },
  { number: 7, title: 'Level Up' },
  { number: 8, title: 'A Grim Warning' },
  { number: 9, title: 'The C-Rank Dungeon' },
  { number: 10, title: 'Betrayal' },
];

export default function ChapterSidebar({
  currentChapter = 1,
  onChapterSelect,
}) {
  return (
    <aside
      className="
        flex
        h-full
        min-h-0
        w-full
        min-w-[280px]
        max-w-[360px]
        flex-col
        rounded-2xl
        border
        border-white/10
        bg-[var(--home-panel)]
        p-4
      "
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Chapters
        </h2>
      </div>

      {/* SCROLLABLE CHAPTER LIST */}
      <div
        className="
          panel-scroll
          min-h-0
          flex-1
          overflow-y-auto
          pr-1
        "
      >
        <div className="flex flex-col gap-2">
          {soloLevelingChapters.map((chapter) => {
            const isActive =
              chapter.number === currentChapter;

            return (
              <button
                key={chapter.number}
                type="button"
                aria-label={`Open chapter ${chapter.number}: ${chapter.title}`}
                onClick={() =>
                  onChapterSelect?.(chapter.number)
                }
                className={`
                  group
                  flex
                  min-h-[54px]
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-left
                  transition-all
                  duration-200

                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-[var(--home-accent)]

                  ${
                    isActive
                      ? `
                        border-[var(--home-accent)]
                        bg-[var(--home-accent)]
                        text-[var(--home-ink)]
                      `
                      : `
                        border-white/10
                        bg-[var(--home-panel-deep)]
                        text-[var(--home-text)]

                        hover:border-[var(--home-accent)]
                        hover:bg-[var(--home-accent)]
                        hover:text-[var(--home-ink)]
                      `
                  }
                `}
              >
                {/* NUMBER */}
                <span
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-sm
                    font-extrabold
                    transition-colors

                    ${
                      isActive
                        ? `
                          bg-[var(--home-ink)]
                          text-[var(--home-accent)]
                        `
                        : `
                          bg-white/10
                          text-white

                          group-hover:bg-[var(--home-ink)]
                          group-hover:text-[var(--home-accent)]
                        `
                    }
                  `}
                >
                  {chapter.number}
                </span>

                {/* CHAPTER INFO */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide

                      ${
                        isActive
                          ? 'text-black/60'
                          : 'text-white/50 group-hover:text-black/60'
                      }
                    `}
                  >
                    Chapter {chapter.number}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      font-bold
                    "
                    title={chapter.title}
                  >
                    {chapter.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW ALL CHAPTERS */}
      <button
        type="button"
        className="
          mt-4
          inline-flex
          min-h-[52px]
          w-full
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[var(--home-accent)]
          px-4
          text-sm
          font-extrabold
          text-[var(--home-ink)]
          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:bg-[var(--home-accent-hover)]
        "
      >
        <BookOpen
          size={18}
          strokeWidth={2.4}
        />

        View all chapters
      </button>
    </aside>
  );
}