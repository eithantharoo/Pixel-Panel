import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { images } from '../../assets/images';

const DEFAULT_ITEMS = [
  { id: 1, title: 'Dandadan', chapter: 'Chapter 12', progress: 75, img: images.continueReading.dandadan },
  { id: 2, title: 'One Piece', chapter: 'Chapter 110', progress: 35, img: images.continueReading.onePiece },
  { id: 3, title: 'Noragami', chapter: 'Chapter 95', progress: 85, img: images.continueReading.noragami },
];

const fallbackCovers = [
  images.continueReading.dandadan,
  images.continueReading.onePiece,
  images.continueReading.noragami,
];

function withFallbackCovers(items) {
  return items.map((item, index) => ({
    ...item,
    img: item.img || fallbackCovers[index % fallbackCovers.length],
  }));
}

function Cover({ item }) {
  const base = 'h-12 w-12 shrink-0 rounded-lg border border-[var(--panel-control-border)] object-cover shadow-sm transition-transform group-hover:scale-105';
  if (item.img) return <img src={item.img} alt={item.title} className={base} />;
  const color = item.color || '#3a2858';
  return <div className={base} style={{ background: `linear-gradient(160deg, ${color}, ${color}88)` }} />;
}

export default function ContinueReadingBar({ items, onCardClick, onViewAll }) {
  const books = withFallbackCovers(items && items.length ? items : DEFAULT_ITEMS).slice(0, 3);

  return (
    <section className="flex w-full shrink-0 flex-col gap-3 rounded-lg border border-[var(--panel-control-border)] bg-[var(--bg-card-secondary)] px-4 py-3 shadow-md lg:flex-row lg:items-center lg:justify-between lg:px-5">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-[var(--text-yellow)] sm:text-base">
          <BookOpen size={18} strokeWidth={2.3} />
          Continue Reading
        </h3>
        <button
          type="button"
          className="btn-yellow inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold shadow transition-all hover:brightness-105 active:scale-95 lg:hidden"
          onClick={onViewAll}
        >
          View All
          <ArrowRight size={14} strokeWidth={2.4} />
        </button>
      </div>

      <div className="panel-scroll flex min-w-0 flex-1 items-center gap-3 overflow-x-auto pb-1 lg:justify-around lg:pb-0">
        {books.map((book, index) => (
          <React.Fragment key={book.id}>
            {index > 0 && <div className="my-auto hidden h-10 w-px shrink-0 bg-[var(--panel-divider)] lg:block" />}

            <button
              type="button"
              onClick={() => onCardClick?.(book)}
              aria-label={`Continue reading ${book.title}`}
              className="group flex min-w-[210px] max-w-[260px] flex-1 items-center gap-3 rounded-lg border border-[var(--panel-control-border)] bg-[var(--panel-control-idle)] p-1.5 text-left transition-colors hover:border-[var(--panel-control-border-strong)] hover:bg-[var(--panel-control-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text-yellow)]"
            >
              <Cover item={book} />
              <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="mb-1 truncate text-xs font-bold leading-tight text-[var(--panel-control-text)] transition-colors group-hover:text-[var(--panel-hover-text)]">
                  {book.title}
                </h4>
                <p className="mb-1.5 text-[10px] font-medium text-[var(--panel-control-muted)]">{book.chapter}</p>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1b0f2c]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--purple-normal)] to-[var(--text-yellow)] transition-all duration-500"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-[var(--panel-control-text)]">{book.progress}%</span>
                </div>
              </div>
            </button>
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        className="btn-yellow hidden shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold shadow transition-all hover:brightness-105 active:scale-95 lg:inline-flex"
        onClick={onViewAll}
      >
        View All
        <ArrowRight size={15} strokeWidth={2.4} />
      </button>
    </section>
  );
}
