import React, { useEffect, useState } from 'react';
import { Bell, BookOpen, Heart, Maximize2, Minimize2, Play, Star, SquareArrowOutUpRight, X } from 'lucide-react';
import { images } from '../../assets/images';
import { labelToGenreId } from '../../utils/genreMap';
import { useTranslation } from '../../utils/i18n/I18nContext';
import { checkEmbeddable } from '../../services/embedService';
import { fetchChapterPdfObjectUrl } from '../../services/pdfService';
import { loadAuth } from '../../utils/authState';
import { isRealStoryId } from '../../utils/objectId';
import { useMyRating } from '../../hooks/useMyRating';


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
  compact = false,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`
        flex
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--home-border)]
        bg-[var(--home-panel-hover)]
        text-[var(--home-text)]
        transition-colors
        hover:bg-[var(--home-panel)]
        ${compact ? 'h-6 w-6' : 'h-9 w-9'}
        ${className}
      `}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <X
        size={compact ? 12 : 18}
        strokeWidth={2.4}
      />
    </button>
  );
}


// Tries to show a chapter's source URL inline via <iframe>. Many sites
// (e.g. Webtoons) send X-Frame-Options/CSP headers that make browsers
// refuse to render them in a frame — and there's no reliable in-browser JS
// signal for that refusal (a blocked cross-origin frame and a genuinely
// loaded one both throw when you try to read their location). So instead
// we ask the backend to check the target's headers before ever attempting
// the iframe, and fall back to a plain link-out button when it can't be
// embedded (or the check itself fails, e.g. offline).
function ChapterEmbed({ url, title, t }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'embeddable' | 'blocked'
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = loadAuth()?.token;

    checkEmbeddable(url, token)
      .then(({ embeddable }) => {
        if (!cancelled) setStatus(embeddable ? 'embeddable' : 'blocked');
      })
      .catch(() => {
        if (!cancelled) setStatus('blocked');
      });

    return () => {
      cancelled = true;
    };
    // The parent remounts this component (via `key={url}`) on chapter
    // change, so `url` doesn't need to be a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--home-text-muted)] transition-colors hover:text-[var(--home-accent)]"
        >
          <SquareArrowOutUpRight size={12} aria-hidden="true" />
          {t('Open in new tab')}
        </a>
      </div>

      <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-[var(--home-border)] bg-black/20">
        {status === 'embeddable' && (
          <iframe
            src={url}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className={`h-full min-h-[50vh] w-full ${iframeLoaded ? '' : 'opacity-0'}`}
            style={{ minHeight: '50vh' }}
          />
        )}

        {(status === 'checking' || (status === 'embeddable' && !iframeLoaded)) && (
          <p className="absolute inset-0 flex items-center justify-center text-base text-[var(--home-text-muted)]">
            {t('Loading chapter...')}
          </p>
        )}

        {status === 'blocked' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="max-w-sm text-base text-[var(--home-text-muted)]">
              {t("This chapter can't be shown here — the source site blocks embedding.")}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-yellow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-black"
            >
              <SquareArrowOutUpRight size={15} aria-hidden="true" />
              {t('Read Chapter on Original Site')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Renders a PDF chapter stored in GridFS. GET requests via <iframe src>
// can't carry an Authorization header, so the PDF is fetched as an
// authenticated Blob first and shown via its object URL instead — the
// browser's native PDF viewer renders that fine inside an iframe.
function ChapterPdf({ fileId, title, t }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let createdUrl = null;
    const token = loadAuth()?.token;

    fetchChapterPdfObjectUrl(fileId, token)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        createdUrl = url;
        setObjectUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
    // The parent remounts this component (via `key={fileId}`) on chapter
    // change, so `fileId` doesn't need to be a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-[var(--home-border)] bg-black/20">
      {objectUrl && (
        <iframe src={objectUrl} title={title} className="h-full min-h-[50vh] w-full" style={{ minHeight: '50vh' }} />
      )}

      {!objectUrl && !failed && (
        <p className="absolute inset-0 flex items-center justify-center text-base text-[var(--home-text-muted)]">
          {t('Loading chapter...')}
        </p>
      )}

      {failed && (
        <p className="absolute inset-0 flex items-center justify-center text-base text-[var(--home-text-muted)]">
          {t('Something went wrong')}
        </p>
      )}
    </div>
  );
}

function MetaList({
  metadata,
  rating,
}) {
  const { t } = useTranslation();
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
            {t(label, label)}:
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
          {t('Rating', 'Rating')}:
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
  const { t } = useTranslation();
  const list =
    genres ?? DEFAULT_GENRES;

  return (
    <div className="flex flex-wrap gap-2.5">
      {list.map((genre) => {
        const genreId = labelToGenreId(genre);
        const displayLabel = genreId ? t(`genres.${genreId}`, genre) : t(genre, genre);
        return (
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
          {displayLabel}
        </span>
        );
      })}
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

// 5-star click-to-rate widget. `value` is the user's own rating (1-5, or
// null if they haven't rated); hovering previews the star that would be
// picked without committing until click.
function StarRatingInput({ value, onRate, disabled = false }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(null);
  const displayValue = hovered ?? value;

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label={t('Rate this story')}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayValue != null && star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${t('Rate this story')} — ${star}/5`}
            disabled={disabled}
            className="p-0.5 text-[var(--home-accent)] transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            onClick={() => onRate(star)}
          >
            <Star size={22} className={filled ? 'fill-current' : ''} strokeWidth={filled ? 0 : 1.8} />
          </button>
        );
      })}
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
  fullscreen = false,
  onToggleFullscreen,
}) {
  const { t } = useTranslation();
  const canRate = isRealStoryId(book?.id);
  const isLoggedIn = Boolean(loadAuth()?.token);
  const { myRating, submitRating, submitting } = useMyRating(book?.id);
  const [ratingOverride, setRatingOverride] = useState(null);

  // Reset the optimistic aggregate whenever a different story is shown.
  useEffect(() => {
    Promise.resolve().then(() => setRatingOverride(null));
  }, [book?.id]);

  async function handleRate(star) {
    if (!canRate || !isLoggedIn || submitting) return;
    const result = await submitRating(star).catch(() => null);
    if (result) setRatingOverride({ rating: result.rating, ratingCount: result.ratingCount });
  }

  const title =
    book?.title ?? DEFAULT_TITLE;

  const rating =
    ratingOverride?.rating ?? book?.rating ?? DEFAULT_RATING;

  const ratingCount =
    ratingOverride?.ratingCount ?? book?.ratingCount ?? null;

  const review =
    book?.description || DEFAULT_REVIEW;

  const genres =
    book?.genres?.length ? book.genres : DEFAULT_GENRES;

  const meta =
    buildMetadata(book);

  if (isReading) {
    return (
      <div
        key={title}
        className="
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
        {/* CHAPTER READING PANE — no banner in reading mode; every pixel
            goes to the chapter itself (esp. PDF chapters). */}
        <Surface
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden
            rounded-[1.25rem]
            p-0
          "
        >
          <div className={`flex min-h-0 flex-1 flex-col pl-2.5 pr-1.5 py-1.5 sm:pl-3 sm:pr-2 sm:py-1.5 ${(chapterContent?.contentUrl || chapterContent?.pdfFileId) ? '' : 'panel-scroll overflow-y-auto'}`}>
            <div className="flex min-h-0 w-full flex-1 flex-col">
              <div className="mb-1 flex items-center justify-between gap-1.5 border-b border-[var(--home-border)] pb-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-sm font-extrabold text-[var(--home-text)] sm:text-base">
                    {chapterContent ? chapterContent.title : `${t('Chapter')} 1`}
                  </h3>

                  {chapterContent && (
                    <span className="shrink-0 rounded-full bg-[var(--home-control)] px-2 py-0.5 text-[10px] font-bold text-[var(--home-ink)]">
                      Ch. {chapterContent.number}
                      {book?.totalChapters ? ` / ${book.totalChapters}` : ''}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={onToggleFullscreen}
                    aria-label={fullscreen ? t('Exit full screen') : t('Full screen')}
                    title={fullscreen ? t('Exit full screen') : t('Full screen')}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-hover)] text-[var(--home-text)] transition-colors hover:bg-[var(--home-panel)]"
                  >
                    {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>

                  <IconButton
                    label={t('Close reading mode')}
                    onClick={onClose}
                    compact
                  />
                </div>
              </div>

              {chapterLoading ? (
                <p className="text-base text-[var(--home-text-muted)]">{t('Loading chapter...')}</p>
              ) : chapterContent?.pdfFileId ? (
                <ChapterPdf key={chapterContent.pdfFileId} fileId={chapterContent.pdfFileId} title={chapterContent.title} t={t} />
              ) : chapterContent?.contentUrl ? (
                <ChapterEmbed key={chapterContent.contentUrl} url={chapterContent.contentUrl} title={chapterContent.title} t={t} />
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
        label={t('Close details')}
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
            {t('Read now')}
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
              ? t('Favorited')
              : t('Add to Favorites')}
          </button>
        </div>

            <div className="mt-5">
              <MetaList metadata={meta} rating={rating} />
            </div>

            {canRate && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--home-border)] bg-black/[0.12] px-4 py-3">
                <span className="text-sm font-bold text-[var(--home-text)]">
                  {isLoggedIn ? t('Your rating') : t('Log in to rate this story')}
                </span>

                {isLoggedIn && (
                  <StarRatingInput value={myRating} onRate={handleRate} disabled={submitting} />
                )}

                {ratingCount != null && (
                  <span className="text-xs text-[var(--home-text-muted)]">
                    {ratingCount} {ratingCount === 1 ? t('rating') : t('ratings')}
                  </span>
                )}
              </div>
            )}

            {notificationReason && (
              <div className="mt-5 rounded-lg border border-[var(--home-border)] bg-black/[0.16] px-4 py-3 text-sm font-semibold leading-6 text-[var(--home-text)]">
                <span className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase text-[var(--home-accent)]">
                  <Bell size={14} aria-hidden="true" />
                  {t('Notification reason')}
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
          {t('Genres')}
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
          {t('Review')}
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
