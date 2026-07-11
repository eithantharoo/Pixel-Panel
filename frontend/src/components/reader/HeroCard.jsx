import React from 'react';
import { BookOpen, Heart, Star, X } from 'lucide-react';
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
    <section className={`rounded-lg border border-white/[0.08] bg-white/[0.05] p-4 sm:p-5 ${className}`}>
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
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.12] text-white transition-colors hover:bg-white/20 ${className}`}
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
    <dl className="grid grid-cols-1 gap-2 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
      {metadata.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-lg bg-black/[0.12] px-3 py-2">
          <dt className="text-[11px] font-bold uppercase text-white/[0.55]">{label}</dt>
          <dd className="mt-0.5 truncate font-semibold text-white/[0.88]">{value}</dd>
        </div>
      ))}
      <div className="min-w-0 rounded-lg bg-black/[0.12] px-3 py-2">
        <dt className="text-[11px] font-bold uppercase text-white/[0.55]">Rating</dt>
        <dd className="mt-0.5 flex min-w-0 items-center gap-1.5 font-bold text-[var(--text-yellow)]">
          <Star size={13} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
          9.3/10
        </dd>
      </div>
    </dl>
  );
}

function GenreList() {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <span
          key={genre}
          className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}

function Poster() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/20">
      <img src={images.hero} alt="Jujutsu Kaisen" className="aspect-[3/4] w-full object-cover" />
      <div className="absolute left-3 top-3">
        <RatingBadge compact />
      </div>
    </div>
  );
}

export default function HeroCard({ isReading, onReadNow, onClose }) {
  if (isReading) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-5">
        <section className="relative min-h-[210px] shrink-0 overflow-hidden rounded-lg border border-white/[0.08]">
          <img src={images.heroBanner} alt="Jujutsu Kaisen Banner" className="h-full min-h-[210px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/[0.78] via-black/[0.38] to-transparent" />
          <IconButton label="Close reading mode" onClick={onClose} className="absolute right-4 top-4 bg-black/[0.35] hover:bg-black/[0.55]" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-5 sm:p-6">
            <span className="w-fit rounded-md bg-[var(--text-yellow)] px-3 py-1.5 text-xs font-extrabold text-black">Now Reading</span>
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
            <h2 className="text-2xl font-extrabold text-white">Jujutsu Kaisen</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              Curse-energy battles, sharp pacing, and a clear chapter list sit in one stable reading workspace.
            </p>
            <div className="mt-5">
              <MetaTable />
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase text-[var(--text-yellow)]">Genres</h3>
              <GenreList />
            </div>
          </div>
        </Surface>

        <Surface>
          <h3 className="mb-2 text-base font-bold text-[var(--text-yellow)]">Review</h3>
          <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)]">{reviewCopy}</p>
        </Surface>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <Surface className="relative">
        <IconButton label="Close details" onClick={onClose} className="absolute right-4 top-4 bg-[#8a5fac] hover:bg-[#794f9a]" />

        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <Poster />
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" className="btn-yellow inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold" onClick={onReadNow}>
                <BookOpen size={17} strokeWidth={2.3} />
                Read
              </button>
              <button type="button" className="btn-purple inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold">
                <Heart size={17} strokeWidth={2.3} />
                Favorite
              </button>
            </div>
          </div>

          <div className="min-w-0 pr-11">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">Jujutsu Kaisen</h1>
                <p className="mt-1 text-sm font-medium text-white/60">Manga / Anime</p>
              </div>
              <RatingBadge />
            </div>

            <div className="mt-5">
              <MetaTable />
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase text-[var(--text-yellow)]">Genres</h3>
              <GenreList />
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-base font-bold text-[var(--text-yellow)]">Review</h3>
              <p className="max-w-4xl text-sm leading-7 text-[var(--color-text-secondary)]">{reviewCopy}</p>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
