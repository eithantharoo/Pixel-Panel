import React from 'react';
import { Bell, BookOpen, Heart, Play, Star, X } from 'lucide-react';
import { images } from '../../assets/images';


const DEFAULT_GENRES = [
  'Action',
  'Dark Fantasy',
  'Supernatural',
  'School',
  'Adventure',
];


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


function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}


function buildMetadata(book) {
  if (!book) return DEFAULT_METADATA;

  const rows = [];
  if (book.author) rows.push(['Author', book.author]);
  rows.push(['Type', 'Manga']);
  if (book.totalChapters) rows.push(['Chapters', String(book.totalChapters)]);
  if (book.status) rows.push(['Status', capitalize(book.status)]);

  return rows.length > 0 ? rows : DEFAULT_METADATA;
}


function Surface({
  className = '',
  children,
}) {
  return (
    <section
      className={`
        rounded-lg
        border
        border-[var(--home-border)]
        bg-[var(--home-panel-deep)]
        p-4
        shadow-[0_10px_24px_rgba(47,28,56,0.18)]
        sm:p-5
        ${className}
      `}
    >
      {children}
    </section>
  );
}


function RatingBadge({
  rating,
  compact = false,
}) {
  const display = rating ?? '9.3';

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-md
        bg-black/[0.45]
        font-bold
        text-white
        backdrop-blur-sm

        ${
          compact
            ? 'px-2.5 py-1 text-xs'
            : 'px-3 py-1.5 text-sm'
        }
      `}
    >
      <Star
        size={compact ? 12 : 14}
        className="
          fill-[var(--text-yellow)]
          text-[var(--text-yellow)]
        "
        aria-hidden="true"
      />

      {typeof display === 'number'
        ? display.toFixed(1)
        : display}
    </span>
  );
}


function IconButton({
  label,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--home-border)]
        bg-[var(--home-panel-hover)]
        text-[var(--home-text)]
        transition-colors
        hover:bg-[var(--home-panel)]
        ${className}
      `}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <X
        size={18}
        strokeWidth={2.4}
      />
    </button>
  );
}


function MetaList({
  metadata,
  rating,
}) {
  const rows =
    metadata ?? DEFAULT_METADATA;

  const displayRating =
    rating ?? DEFAULT_RATING;

  return (
    <dl
      className="
        mt-4
        space-y-1
        text-base
        leading-[1.7]
        sm:text-lg
      "
    >
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="
            grid
            grid-cols-[7.5rem_minmax(0,1fr)]
            items-baseline
            gap-x-2
            sm:grid-cols-[8.5rem_minmax(0,1fr)]
          "
        >
          <dt
            className="
              font-bold
              text-[var(--home-text)]
            "
          >
            {label}:
          </dt>

          <dd
            className="
              font-normal
              text-[var(--home-text)]
            "
          >
            {value}
          </dd>
        </div>
      ))}

      <div
        className="
          grid
          grid-cols-[7.5rem_minmax(0,1fr)]
          items-center
          gap-x-2
          sm:grid-cols-[8.5rem_minmax(0,1fr)]
        "
      >
        <dt
          className="
            font-bold
            text-[var(--home-text)]
          "
        >
          Rating:
        </dt>

        <dd
          className="
            flex
            items-center
            gap-1.5
            font-normal
            text-[var(--home-accent)]
          "
        >
          <Star
            size={16}
            className="
              fill-[var(--text-yellow)]
              text-[var(--text-yellow)]
            "
            aria-hidden="true"
          />

          {typeof displayRating === 'number'
            ? displayRating.toFixed(1)
            : displayRating}
          /10
        </dd>
      </div>
    </dl>
  );
}


function GenreList({
  genres,
  light = false,
  reading = false,
}) {
  const list =
    genres ?? DEFAULT_GENRES;

  return (
    <div className="flex flex-wrap gap-2.5">
      {list.map((genre) => (
        <span
          key={genre}
          className={
            light
              ? `
                inline-flex
                min-w-[9.5rem]
                items-center
                justify-center
                rounded-full
                bg-[var(--home-control)]
                px-6
                py-3
                text-center
                text-sm
                font-semibold
                text-[var(--home-ink)]
                sm:text-base
              `
              : reading
                ? `
                  inline-flex
                  min-w-[6rem]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--home-control-hover)]
                  bg-[var(--home-control)]
                  px-4
                  py-2
                  text-center
                  text-sm
                  font-semibold
                  text-[var(--home-ink)]
                `
                : `
                  inline-flex
                  min-w-[7.5rem]
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[var(--home-control-hover)]
                  bg-[var(--home-control)]
                  px-4
                  py-2
                  text-center
                  text-xs
                  font-bold
                  text-[var(--home-ink)]
                `
          }
        >
          {genre}
        </span>
      ))}
    </div>
  );
}


function Poster({
  book,
  accentBorder = false,
  showRating = true,
  className = '',
}) {
  const borderClass =
    accentBorder
      ? 'border border-white/70'
      : 'border border-[var(--home-border)]';


  if (book) {
    return (
      <div
        className={`
          relative
          overflow-hidden
          rounded-2xl
          bg-[var(--home-panel-deep)]
          shadow-lg
          ${className}
          ${borderClass}
        `}
        style={{
          background: `linear-gradient(
            160deg,
            ${book.color || '#3a2858'},
            ${(book.color || '#3a2858')}88
          )`,
        }}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="
              aspect-[3/4]
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              aspect-[3/4]
              flex
              w-full
              items-center
              justify-center
            "
          >
            <span
              className="
                select-none
                text-6xl
                font-black
                text-white/10
              "
            >
              {book.title?.[0] ?? '?'}
            </span>
          </div>
        )}

        {book.rank != null && (
          <span
            className="
              absolute
              left-3
              top-3
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[var(--home-accent)]
              text-sm
              font-extrabold
              text-[var(--home-ink)]
              shadow
            "
          >
            {book.rank}
          </span>
        )}
      </div>
    );
  }


  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        bg-[var(--home-panel-deep)]
        shadow-lg
        ${className}
        ${borderClass}
      `}
    >
      <img
        src={images.hero}
        alt="Jujutsu Kaisen"
        className="
          aspect-[3/4]
          w-full
          object-cover
        "
      />

      {showRating ? (
        <div className="absolute left-2.5 top-2.5">
          <RatingBadge compact />
        </div>
      ) : null}
    </div>
  );
}

export default function HeroCard({
  isReading,
  onReadNow,
  onClose,
  book,
  isFavorite = false,
  onToggleFavorite,
  chapterContent = null,
  chapterLoading = false,
  notificationReason = '',
}) {
  const title =
    book?.title ?? DEFAULT_TITLE;

  const rating =
    book?.rating ?? DEFAULT_RATING;

  const color =
    book?.color ?? null;

  const review =
    book?.description || DEFAULT_REVIEW;

  const genres =
    book?.genres?.length ? book.genres : DEFAULT_GENRES;

  const meta =
    buildMetadata(book);


  const bannerImage =
    book?.banner ||
    (title.toLowerCase() === 'solo leveling' ? images.banners.soloLeveling : book?.cover) ||
    images.heroBanner;

  if (isReading) {
    return (
      <div
        key={title}
        className="
          flex
          h-full
          min-h-0
          flex-col
          gap-4
        "
        style={{
          animation:
            'heroFadeIn 0.35s ease',
        }}
      >
        {/* BANNER SECTION */}
        <section
          className="
            relative
            min-h-0
            flex-[0_0_auto]
            h-44
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--home-border)]
          "
        >
          {/* BANNER IMAGE */}
          <img
            src={bannerImage}
            alt={`${title} Banner`}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

          {/* COLOR OVERLAY */}
          {color && (
            <div
              className="
                absolute
                inset-0
              "
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    ${color}88 0%,
                    ${color}45 50%,
                    transparent 100%
                  )
                `,
              }}
            />
          )}

          {/* DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/60
              via-black/25
              to-transparent
            "
          />

          {/* CLOSE BUTTON */}
          <IconButton
            label="Close reading mode"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              z-20
              bg-black/[0.35]
              hover:bg-black/[0.55]
            "
          />

          {/* BANNER TEXT & ACTIONS */}
          <div
            className="
              absolute
              bottom-3
              left-4
              z-10
              flex
              flex-col
              items-start
              gap-2.5
              sm:bottom-4
              sm:left-5
            "
          >
            {/* BALANCED TITLE FRAME */}
            <span
              className="
                inline-block
                whitespace-nowrap
                rounded-xl
                bg-[var(--home-accent)]
                text-base
                font-extrabold
                leading-none
                text-black
                shadow-md
                sm:text-lg
              "
              style={{
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              {title}
            </span>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2.5
              "
            >
              <RatingBadge
                rating={rating}
                compact
              />

              {/* BALANCED DETAILS BUTTON FRAME */}
              <button
                type="button"
                className="
                  btn-yellow
                  inline-flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-xl
                  text-xs
                  font-bold
                  text-black
                  shadow-sm
                  transition-all
                  hover:brightness-105
                  sm:text-sm
                "
                style={{
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                }}
                onClick={onClose}
              >
                <BookOpen
                  size={14}
                  strokeWidth={2.3}
                />
                Details
              </button>
            </div>
          </div>
        </section>

        {/* CHAPTER READING PANE */}
        <Surface
          className="
            flex
            min-h-0
            flex-[1_1_0%]
            flex-col
            overflow-hidden
            rounded-[1.75rem]
            p-0
          "
        >
          <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <div className="w-full">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-[var(--home-border)] pb-4">
                <h3 className="text-2xl font-extrabold text-[var(--home-text)] sm:text-3xl">
                  {chapterContent ? chapterContent.title : 'Chapter 1'}
                </h3>

                {chapterContent && (
                  <span className="shrink-0 rounded-full bg-[var(--home-control)] px-3 py-1 text-xs font-bold text-[var(--home-ink)]">
                    Ch. {chapterContent.number}
                    {book?.totalChapters ? ` / ${book.totalChapters}` : ''}
                  </span>
                )}
              </div>

              {chapterLoading ? (
                <p className="text-base text-[var(--home-text-muted)]">Loading chapter...</p>
              ) : (
                <p
                  className="
                    w-full
                    whitespace-pre-line
                    text-base
                    leading-[1.8]
                    text-[var(--home-text)]
                    sm:text-lg
                  "
                >
                  {chapterContent?.content || review}
                </p>
              )}
            </div>
          </div>
        </Surface>
      </div>
    );
  }


 /* =====================================
      NORMAL DETAILS VIEW
  ====================================== */

  return (
    <div
      key={title}
      className="
        relative
        flex
        h-full
        min-h-0
        flex-col
      "
      style={{
        animation:
          'heroFadeIn 0.35s ease',
      }}
    >
      <IconButton
        label="Close details"
        onClick={onClose}
        className="
          absolute
          right-0
          top-0
          z-10
        "
      />

      {/* TOP SECTION & BUTTONS WRAPPER WITH DIRECT GAP */}
      <div className="flex flex-col gap-6">
        {/* Poster + Metadata Grid */}
        <div
          className="
            grid
            items-start
            gap-x-6
            gap-y-0
            pr-11
            sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]
            lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]
          "
        >
          <Poster
            book={book}
            accentBorder
          />

          <div
            className="
              min-w-0
              pt-0.5
            "
          >
            <h1
              className="
                text-2xl
                font-extrabold
                leading-tight
                text-[var(--home-text)]
                sm:text-3xl
              "
            >
              {title}
            </h1>

            <MetaList
              metadata={meta}
              rating={rating}
            />
          </div>
        </div>

     {/* BUTTONS SECTION */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3.5
          "
        >
          {/* READ NOW BUTTON */}
          <button
            type="button"
            className="
              btn-yellow
              inline-flex
              items-center
              justify-center
              gap-2.5
              whitespace-nowrap
              rounded-xl
              text-sm
              font-extrabold
              text-black
              shadow-sm
              transition-all
              hover:brightness-105
            "
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '14px',
              paddingBottom: '14px',
            }}
            onClick={onReadNow}
          >
            <Play
              size={15}
              fill="currentColor"
              strokeWidth={0}
              aria-hidden="true"
            />
            Read Now
          </button>

          {/* FAVORITE BUTTON */}
          <button
            type="button"
            className="
              inline-flex
              items-center
              justify-center
              gap-2.5
              whitespace-nowrap
              rounded-xl
              bg-[#9b72b8]
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-colors
              hover:bg-[#8a63a6]
            "
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '14px',
              paddingBottom: '14px',
            }}
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
          >
            <Heart
              size={15}
              strokeWidth={2.3}
              fill={
                isFavorite
                  ? 'currentColor'
                  : 'none'
              }
            />
            {isFavorite
              ? 'Favorited'
              : 'Add To Favorites'}
          </button>
        </div>

            <div className="mt-5">
              <MetaList metadata={meta} rating={rating} />
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

      {/* GENRES SECTION */}
      <div className="mt-7">
        <h3
          className="
            mb-4
            text-xl
            font-bold
            text-[var(--home-accent)]
            sm:text-2xl
          "
        >
          Genres
        </h3>

        <GenreList
          genres={genres}
          light
        />
      </div>

      {/* REVIEW SECTION */}
      <div className="mt-7 mb-0">
        <h3
          className="
            mb-4
            text-xl
            font-bold
            text-[var(--home-accent)]
            sm:text-2xl
          "
        >
          Review
        </h3>

        <p
          className="
            text-base
            leading-[1.75]
            text-[var(--home-text)]
            sm:text-lg
          "
        >
          {review}
        </p>
      </div>
    </div>
    </div>
  );
}
