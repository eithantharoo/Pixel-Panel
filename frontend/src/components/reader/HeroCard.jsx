import React from 'react';
import { Bell, BookOpen, Heart, Star, X } from 'lucide-react';
import { images } from '../../assets/images';

const DEFAULT_GENRES = ['Action', 'Dark Fantasy', 'Supernatural', 'School', 'Adventure'];
const DEFAULT_METADATA = [
  ['Author', 'Gege Akutami'],
  ['Illustrator', 'Gege Akutami'],
  ['Type', 'Manga / Anime'],
  ['Chapters', '300+'],
  ['Volumes', '30'],
  ['Status', 'Completed'],
];
const DEFAULT_REVIEW = `Jujutsu Kaisen follows Yuji Itadori, a high school student whose life changes after he
consumes a cursed object and becomes the host of Ryomen Sukuna, the King of Curses.
Thrown into the dangerous world of Jujutsu Sorcerers, Yuji must fight powerful curses
while searching for Sukuna's remaining fingers.`;
const DEFAULT_TITLE = 'Jujutsu Kaisen';
const DEFAULT_RATING = '9.3';

function Surface({ className = '', children }) {
  return (
    <section className={`rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-deep)] p-4 shadow-[0_10px_24px_rgba(47,28,56,0.18)] sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

function RatingBadge({ rating, compact = false }) {
  const display = rating ?? '9.3';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-black/[0.45] font-bold text-white backdrop-blur-sm ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}>
      <Star size={compact ? 12 : 14} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
      {typeof display === 'number' ? display.toFixed(1) : display}
    </span>
  );
}

function IconButton({ label, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-hover)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-panel)] ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <X size={18} strokeWidth={2.4} />
    </button>
  );
}

function MetaTable({ metadata }) {
  const rows = metadata ?? DEFAULT_METADATA;
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm text-[var(--home-text-muted)] sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-lg border border-[var(--home-border)] bg-black/[0.12] px-3 py-2">
          <dt className="text-[11px] font-bold uppercase text-[var(--home-text-muted)]">{label}</dt>
          <dd className="mt-0.5 truncate font-semibold text-[var(--home-text)]">{value}</dd>
        </div>
      ))}
      <div className="min-w-0 rounded-lg border border-[var(--home-border)] bg-black/[0.12] px-3 py-2">
        <dt className="text-[11px] font-bold uppercase text-[var(--home-text-muted)]">Rating</dt>
        <dd className="mt-0.5 flex min-w-0 items-center gap-1.5 font-bold text-[var(--home-accent)]">
          <Star size={13} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
          {metadata ? (rows[0] ? 'N/A' : '9.3') : '9.3'}/10
        </dd>
      </div>
    </dl>
  );
}

function GenreList({ genres }) {
  const list = genres ?? DEFAULT_GENRES;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((genre) => (
        <span
          key={genre}
          className="rounded-md border border-[var(--home-control-hover)] bg-[var(--home-control)] px-3 py-1.5 text-xs font-bold text-[var(--home-ink)]"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}

function Poster({ book }) {
  if (book) {
    // Render a gradient poster using book color when no cover image is available
    return (
      <div
        className="relative overflow-hidden rounded-lg border border-[var(--home-border)] shadow-lg"
        style={{ background: `linear-gradient(160deg, ${book.color || '#3a2858'}, ${(book.color || '#3a2858')}88)` }}
      >
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="aspect-[3/4] w-full object-cover" />
        ) : (
          <div className="aspect-[3/4] w-full flex items-center justify-center">
            <span className="text-6xl font-black text-white/10 select-none">
              {book.title?.[0] ?? '?'}
            </span>
          </div>
        )}
          {book.rank != null && (
            <span className="absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--home-accent)] text-[var(--home-ink)] text-sm font-extrabold shadow">
              {book.rank}
            </span>
          )}
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-deep)] shadow-lg">
      <img src={images.hero} alt="Jujutsu Kaisen" className="aspect-[3/4] w-full object-cover" />
      <div className="absolute left-3 top-3">
        <RatingBadge compact />
      </div>
    </div>
  );
}

export default function HeroCard({ isReading, onReadNow, onClose, book, isFavorite = false, onToggleFavorite, notificationReason = '' }) {
  // Derive display values — use book data if provided, else hardcoded defaults
  const title    = book?.title    ?? DEFAULT_TITLE;
  const rating   = book?.rating   ?? DEFAULT_RATING;
  const color    = book?.color    ?? null;
  const review   = DEFAULT_REVIEW;
  const genres   = DEFAULT_GENRES;
  const meta     = DEFAULT_METADATA;

  // Banner style: gradient from book color when a trending book is selected
  const bannerStyle = color
    ? { background: `linear-gradient(135deg, ${color} 0%, ${color}aa 50%, ${color}44 100%)` }
    : {};

  if (isReading) {
    return (
      <div key={title} className="flex h-full min-h-0 flex-col gap-5" style={{ animation: 'heroFadeIn 0.35s ease' }}>
        <section className="relative min-h-[210px] shrink-0 overflow-hidden rounded-lg border border-[var(--home-border)]" style={bannerStyle}>
          {!color && <img src={images.heroBanner} alt={`${title} Banner`} className="h-full min-h-[210px] w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/[0.78] via-black/[0.38] to-transparent" />
          <IconButton label="Close reading mode" onClick={onClose} className="absolute right-4 top-4 bg-black/[0.35] hover:bg-black/[0.55]" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-5 sm:p-6">
            <span className="w-fit rounded-md bg-[var(--home-accent)] px-3 py-1.5 text-xs font-extrabold text-[var(--home-ink)]">Now Reading</span>
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{title}</h1>
              {notificationReason && (
                <p className="mt-2 flex max-w-2xl items-center gap-2 text-sm font-semibold leading-6 text-white/90">
                  <Bell size={14} aria-hidden="true" />
                  {notificationReason}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <RatingBadge rating={rating} />
                <button type="button" className="btn-yellow inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold" onClick={onClose}>
                  <BookOpen size={16} strokeWidth={2.3} />
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>

        <Surface className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <Poster book={book} />
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold text-[var(--home-text)]">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--home-text-muted)]">
              Curse-energy battles, sharp pacing, and a clear chapter list sit in one stable reading workspace.
            </p>
            <div className="mt-5">
              <MetaTable metadata={meta} />
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase text-[var(--home-accent)]">Genres</h3>
              <GenreList genres={genres} />
            </div>
          </div>
        </Surface>

        <Surface>
          <h3 className="mb-2 text-base font-bold text-[var(--home-accent)]">Review</h3>
          <p className="max-w-3xl text-sm leading-7 text-[var(--home-text-muted)]">{review}</p>
        </Surface>
      </div>
    );
  }

  return (
    <div key={title} className="flex h-full min-h-0 flex-col gap-5" style={{ animation: 'heroFadeIn 0.35s ease' }}>
      <Surface className="relative">
        <IconButton label="Close details" onClick={onClose} className="absolute right-4 top-4" />

        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <Poster book={book} />
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" className="btn-yellow inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold" onClick={onReadNow}>
                <BookOpen size={17} strokeWidth={2.3} />
                Read
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--home-control-hover)] bg-[var(--home-control)] px-3 py-2.5 text-sm font-bold text-[var(--home-ink)] transition-colors hover:bg-[var(--home-control-hover)]"
                onClick={onToggleFavorite}
                aria-pressed={isFavorite}
              >
                <Heart size={17} strokeWidth={2.3} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>

          <div className="min-w-0 pr-11">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight text-[var(--home-text)] sm:text-3xl">{title}</h1>
                <p className="mt-1 text-sm font-medium text-[var(--home-text-muted)]">Manga / Anime</p>
              </div>
              <RatingBadge rating={rating} />
            </div>

            <div className="mt-5">
              <MetaTable metadata={meta} />
            </div>

            {notificationReason && (
              <div className="mt-5 rounded-lg border border-[var(--home-border)] bg-black/[0.16] px-4 py-3 text-sm font-semibold leading-6 text-[var(--home-text)]">
                <span className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase text-[var(--home-accent)]">
                  <Bell size={14} aria-hidden="true" />
                  Notification reason
                </span>
                {notificationReason}
              </div>
            )}

            <div className="mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase text-[var(--home-accent)]">Genres</h3>
              <GenreList genres={genres} />
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-base font-bold text-[var(--home-accent)]">Review</h3>
              <p className="max-w-4xl text-sm leading-7 text-[var(--home-text-muted)]">{review}</p>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
