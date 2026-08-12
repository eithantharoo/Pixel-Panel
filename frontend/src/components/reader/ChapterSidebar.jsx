import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const CHAPTER_COUNT = 20;

const chapters = Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1);

// Default Solo Leveling chapter names for testing
const defaultChapterNames = [
  "The Hunter of Hunters",
  "The Double Dungeon",
  "Three Rules",
  "The Trial",
  "The Daily Quest",
  "The Instance Dungeon",
  "Level Up",
  "A Grim Warning",
  "The C-Rank Dungeon",
  "Betrayal",
  "The Dungeon & Prisoners",
  "The Red Gate",
  "The Demon Castle",
  "The Necromancer",
  "The Architect",
  "The Shadow Monarch",
  "The Raid",
  "The Return",
  "The Final Battle",
  "A New Beginning",
];

export default function ChapterSidebar({
  currentChapter = 1,
  onChapterSelect,
  readDirection = 'ltr',
  onChapterEnd,
}) {
  const isRtl = readDirection === 'rtl';

  const displayChapters = isRtl
    ? [...chapters].reverse()
    : chapters;

  function goToPrev() {
    if (isRtl) {
      if (currentChapter < CHAPTER_COUNT) {
        onChapterSelect?.(currentChapter + 1);
      }
    } else {
      if (currentChapter > 1) {
        onChapterSelect?.(currentChapter - 1);
      }
    }
  }

  function goToNext() {
    if (isRtl) {
      if (currentChapter > 1) {
        onChapterSelect?.(currentChapter - 1);
      } else {
        onChapterEnd?.();
      }
    } else {
      if (currentChapter < CHAPTER_COUNT) {
        onChapterSelect?.(currentChapter + 1);
      } else {
        onChapterEnd?.();
      }
    }
  }

  return (
    <div
      className="
        flex h-full min-h-0 w-full flex-col
        overflow-hidden
        rounded-[1.75rem]
        border border-[var(--home-border)]
        bg-[var(--home-panel)]
        p-5
        shadow-[0_16px_40px_rgba(47,28,56,0.22)]
      "
    >

      {/* ================= HEADER ================= */}
      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-[1.45rem] font-extrabold tracking-tight text-[var(--home-text)]">
            Chapters
          </h2>

          <p className="mt-0.5 text-[11px] font-medium text-[var(--home-text-muted)]">
            {CHAPTER_COUNT} chapters
          </p>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div
          className="
            flex items-center gap-1.5
            rounded-xl
            border border-[rgba(255,244,61,0.15)]
            bg-[var(--home-panel-deep)]
            p-1
          "
        >

          {/* PREVIOUS */}
          <button
            type="button"
            aria-label={isRtl ? 'Next chapter' : 'Previous chapter'}
            onClick={goToPrev}
            disabled={
              isRtl
                ? currentChapter >= CHAPTER_COUNT
                : currentChapter <= 1
            }
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
            className="
              flex h-8 w-8
              shrink-0
              items-center justify-center
              rounded-lg
              border border-[rgba(255,244,61,0.18)]
              bg-[var(--home-panel-deep)]
              p-0
              text-[var(--home-text)]
              shadow-none
              outline-none
              transition-all duration-200

              hover:bg-[var(--home-accent)]
              hover:text-[var(--home-ink)]
              hover:scale-105

              active:scale-95

              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ChevronLeft
              size={19}
              strokeWidth={2.8}
            />
          </button>

          {/* CHAPTER COUNTER */}
          <div className="flex min-w-[3.1rem] items-center justify-center">
            <span className="text-[1.15rem] font-black leading-none text-[var(--home-accent)]">
              {currentChapter}
            </span>

            <span className="mx-0.5 text-[1rem] font-bold text-[var(--home-text-muted)]">
              /
            </span>

            <span className="text-[0.95rem] font-bold leading-none text-[var(--home-text)]">
              {CHAPTER_COUNT}
            </span>
          </div>

          {/* NEXT */}
          <button
            type="button"
            aria-label={isRtl ? 'Previous chapter' : 'Next chapter'}
            onClick={goToNext}
            disabled={currentChapter >= CHAPTER_COUNT}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
            className="
              flex h-8 w-8
              shrink-0
              items-center justify-center
              rounded-lg
              border border-[rgba(255,244,61,0.18)]
              bg-[var(--home-panel-deep)]
              p-0
              text-[var(--home-text)]
              shadow-none
              outline-none
              transition-all duration-200

              hover:bg-[var(--home-accent)]
              hover:text-[var(--home-ink)]
              hover:scale-105

              active:scale-95

              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ChevronRight
              size={19}
              strokeWidth={2.8}
            />
          </button>

        </div>
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="mb-4">

        <div className="mb-1.5 flex items-center justify-between">

          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--home-text-muted)]">
            Reading progress
          </span>

          <span className="text-[10px] font-bold text-[var(--home-accent)]">
            {Math.round((currentChapter / CHAPTER_COUNT) * 100)}%
          </span>

        </div>

        {/* Progress bar */}
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--home-panel-deep)]">
          <div
            className="
              h-full
              rounded-full
              bg-[var(--home-accent)]
              transition-all
              duration-300
            "
            style={{
              width: `${(currentChapter / CHAPTER_COUNT) * 100}%`,
            }}
          />
        </div>

      </div>

      {/* ================= RTL INDICATOR ================= */}
      {isRtl && (
        <div
          className="
            mb-3
            flex
            items-center
            justify-center
            rounded-lg
            bg-[var(--home-panel-deep)]
            py-1.5
          "
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--home-text-muted)]">
            ← Right to Left
          </p>
        </div>
      )}

      {/* ================= CHAPTER LIST ================= */}
      <div
        className="
          panel-scroll
          flex
          min-h-0
          flex-1
          flex-col
          gap-2
          overflow-y-auto
          px-0.5
          pb-1
        "
      >

        {displayChapters.map((chapter) => {
          const chapterName =
            defaultChapterNames[chapter - 1] ||
            `Chapter ${chapter}`;

          const isActive = chapter === currentChapter;

          return (
            <button
              key={chapter}
              type="button"
              aria-label={`Open chapter ${chapter}: ${chapterName}`}
              onClick={() => onChapterSelect?.(chapter)}
              className={`
                group
                relative
                flex
                min-h-[4rem]
                w-full
                shrink-0
                items-center
                gap-3
                overflow-hidden
                rounded-2xl
                border
                px-3
                py-2.5
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
                      shadow-[0_6px_18px_rgba(0,0,0,0.18)]
                      -translate-y-[1px]
                    `
                    : `
                      border-[rgba(255,244,61,0.12)]
                      bg-[var(--home-panel-deep)]
                      text-[var(--home-text)]

                      hover:-translate-y-[1px]
                      hover:border-[rgba(255,244,61,0.35)]
                      hover:bg-[rgba(255,244,61,0.08)]
                      hover:shadow-[0_5px_15px_rgba(0,0,0,0.10)]
                    `
                }
              `}
            >

              {/* Active chapter indicator */}
              {isActive && (
                <div
                  className="
                    absolute
                    bottom-2
                    left-0
                    top-2
                    w-1
                    rounded-r-full
                    bg-[var(--home-ink)]
                  "
                />
              )}

              {/* ================= CHAPTER NUMBER ================= */}
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-lg
                  font-black
                  leading-none
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-[rgba(0,0,0,0.10)]
                        text-[var(--home-ink)]
                      `
                      : `
                        bg-[rgba(255,244,61,0.08)]
                        text-[var(--home-accent)]

                        group-hover:bg-[rgba(255,244,61,0.15)]
                      `
                  }
                `}
              >
                {chapter}
              </div>

              {/* ================= CHAPTER NAME ================= */}
              <div className="min-w-0 flex-1">

                <div
                  className={`
                    truncate
                    text-[13px]
                    font-bold
                    leading-tight

                    ${
                      isActive
                        ? 'text-[var(--home-ink)]'
                        : 'text-[var(--home-text)]'
                    }
                  `}
                >
                  {chapterName}
                </div>

                <div
                  className={`
                    mt-1
                    text-[10px]
                    font-medium

                    ${
                      isActive
                        ? 'text-[var(--home-ink)] opacity-70'
                        : 'text-[var(--home-text-muted)]'
                    }
                  `}
                >
                  Chapter {chapter}
                </div>

              </div>

              {/* ================= HOVER ARROW ================= */}
              <ChevronRight
                size={16}
                strokeWidth={2.5}
                className={`
                  shrink-0
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        text-[var(--home-ink)]
                      `
                      : `
                        text-[var(--home-text-muted)]
                        opacity-0

                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      `
                  }
                `}
              />

            </button>
          );
        })}

      </div>

      {/* ================= NEXT CHAPTER BUTTON ================= */}
      <button
        type="button"
        onClick={goToNext}
        disabled={currentChapter >= CHAPTER_COUNT}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
        className="
          mt-4
          inline-flex
          min-h-[4.2rem]
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          border-0
          bg-[var(--home-accent)]
          px-4
          py-4
          text-sm
          font-extrabold
          text-[var(--home-ink)]
          shadow-[0_6px_18px_rgba(0,0,0,0.12)]
          outline-none
          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:bg-[var(--home-accent-hover)]
          hover:shadow-[0_8px_22px_rgba(0,0,0,0.18)]

          active:translate-y-0

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        <BookOpen
          size={17}
          strokeWidth={2.5}
        />

        {currentChapter < CHAPTER_COUNT
          ? 'Next Chapter'
          : 'Finished'}

      </button>

    </div>
  );
}