import React from 'react';
import { BookOpen, Heart, Play, Star, X } from 'lucide-react';
import { images } from '../../assets/images';

const genres = ['Action', 'Dark Fantasy', 'Supernatural', 'School', 'Adventure'];
const metadata = [
  ['Author', 'Gege Akutami'],
  ['Illustrator', 'Gege Akutami'],
  ['Type', 'Manga / Anime'],
  ['Chapters', '300+'],
  ['Volumes', '30'],
  ['Status', 'Completed'],
];
const reviewCopy = `Jujutsu Kaisen follows Yuji Itadori, a high school student whose life changes after he
consumes a cursed object and becomes the host of Ryomen Sukuna, the King of Curses.
Thrown into the dangerous world of Jujutsu Sorcerers, Yuji must fight powerful curses
while searching for Sukuna's remaining fingers.`;

function Surface({ className = '', children }) {
  return (
    <section className={`rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-deep)] p-4 shadow-[0_10px_24px_rgba(47,28,56,0.18)] sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

function RatingBadge({ compact = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-black/[0.45] font-bold text-white backdrop-blur-sm ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}>
      <Star size={compact ? 12 : 14} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
      9.3
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

function MetaTable() {
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm text-[var(--home-text-muted)] sm:grid-cols-2">
      {metadata.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-lg border border-[var(--home-border)] bg-black/[0.12] px-3 py-2">
          <dt className="text-[11px] font-bold uppercase text-[var(--home-text-muted)]">{label}</dt>
          <dd className="mt-0.5 truncate font-semibold text-[var(--home-text)]">{value}</dd>
        </div>
      ))}
      <div className="min-w-0 rounded-lg border border-[var(--home-border)] bg-black/[0.12] px-3 py-2">
        <dt className="text-[11px] font-bold uppercase text-[var(--home-text-muted)]">Rating</dt>
        <dd className="mt-0.5 flex min-w-0 items-center gap-1.5 font-bold text-[var(--home-accent)]">
          <Star size={13} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
          9.3/10
        </dd>
      </div>
    </dl>
  );
}

function MetaList() {
  return (
    <dl className="mt-4 space-y-1 text-base leading-[1.7] sm:text-lg">
      {metadata.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-x-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
          <dt className="font-bold text-[var(--home-text)]">{label}:</dt>
          <dd className="font-normal text-[var(--home-text)]">{value}</dd>
        </div>
      ))}
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <dt className="font-bold text-[var(--home-text)]">Rating:</dt>
        <dd className="flex items-center gap-1.5 font-normal text-[var(--home-accent)]">
          <Star size={16} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
          9.3/10
        </dd>
      </div>
    </dl>
  );
}

function GenreList({ light = false }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {genres.map((genre) => (
        <span
          key={genre}
          className={
            light
              ? 'rounded-full bg-[var(--home-control)] px-5 py-2.5 text-sm font-semibold text-[var(--home-ink)] sm:text-base'
              : 'rounded-md border border-[var(--home-control-hover)] bg-[var(--home-control)] px-3 py-1.5 text-xs font-bold text-[var(--home-ink)]'
          }
        >
          {genre}
        </span>
      ))}
    </div>
  );
}

function Poster({ accentBorder = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[var(--home-panel-deep)] shadow-lg ${
        accentBorder ? 'border border-white/70' : 'border border-[var(--home-border)]'
      }`}
    >
      <img src={images.hero} alt="Jujutsu Kaisen" className="aspect-[3/4] w-full object-cover" />
      <div className="absolute left-2.5 top-2.5">
        <RatingBadge compact />
      </div>
    </div>
  );
}

export default function HeroCard({ isReading, onReadNow, onClose }) {
  if (isReading) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-5">
        <section className="relative min-h-[210px] shrink-0 overflow-hidden rounded-lg border border-[var(--home-border)]">
          <img src={images.heroBanner} alt="Jujutsu Kaisen Banner" className="h-full min-h-[210px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/[0.78] via-black/[0.38] to-transparent" />
          <IconButton label="Close reading mode" onClick={onClose} className="absolute right-4 top-4 bg-black/[0.35] hover:bg-black/[0.55]" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-5 sm:p-6">
            <span className="w-fit rounded-md bg-[var(--home-accent)] px-3 py-1.5 text-xs font-extrabold text-[var(--home-ink)]">Now Reading</span>
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">Jujutsu Kaisen</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <RatingBadge />
                <button type="button" className="btn-yellow inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold" onClick={onClose}>
                  <BookOpen size={16} strokeWidth={2.3} />
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>

        <Surface className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <Poster />
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold text-[var(--home-text)]">Jujutsu Kaisen</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--home-text-muted)]">
              Curse-energy battles, sharp pacing, and a clear chapter list sit in one stable reading workspace.
            </p>
            <div className="mt-5">
              <MetaTable />
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase text-[var(--home-accent)]">Genres</h3>
              <GenreList />
            </div>
          </div>
        </Surface>

        <Surface>
          <h3 className="mb-2 text-base font-bold text-[var(--home-accent)]">Review</h3>
          <p className="max-w-3xl text-sm leading-7 text-[var(--home-text-muted)]">{reviewCopy}</p>
        </Surface>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <IconButton label="Close details" onClick={onClose} className="absolute right-0 top-0 z-10" />

      <div className="grid items-start gap-x-6 gap-y-0 pr-11 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Poster accentBorder />
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="btn-yellow inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap sm:text-base"
              onClick={onReadNow}
            >
              <Play size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              Read Now
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9b72b8] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#8a63a6] sm:text-base"
            >
              <Heart size={14} strokeWidth={2.3} />
              Add To Favorites
            </button>
          </div>
        </div>

        <div className="min-w-0 pt-0.5">
          <h1 className="text-2xl font-extrabold leading-tight text-[var(--home-text)] sm:text-3xl">
            Jujutsu Kaisen
          </h1>
          <MetaList />
        </div>
      </div>

      <div className="mt-7">
        <h3 className="mb-4 text-xl font-bold text-[var(--home-accent)] sm:text-2xl">Genres</h3>
        <GenreList light />
      </div>

      <div className="mt-7 mb-0">
        <h3 className="mb-4 text-xl font-bold text-[var(--home-accent)] sm:text-2xl">Review</h3>
        <p className="text-base leading-[1.75] text-[var(--home-text)] sm:text-lg">{reviewCopy}</p>
      </div>
    </div>
  );
}
