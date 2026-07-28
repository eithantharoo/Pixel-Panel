import { ArrowRight, Flame, Star } from 'lucide-react';
import { images } from '../../assets/images';

const DEFAULT_ITEMS = [
  { id: 1, title: 'The Beginning After The End', rating: '9.3', img: images.trending.featured, featured: true },
  { id: 2, title: 'One Piece', rating: '9.3', img: images.trending.onePiece },
  { id: 3, title: 'Dandadan', rating: '8.3', img: images.trending.dandadan },
  { id: 4, title: 'Lookism', rating: '9.0', img: images.trending.lookism },
];

const fallbackCovers = [
  images.trending.featured,
  images.trending.onePiece,
  images.trending.dandadan,
  images.trending.lookism,
];

function withFallbackCovers(items) {
  return items.map((item, index) => ({
    ...item,
    img: item.img || fallbackCovers[index % fallbackCovers.length],
  }));
}

function formatRating(rating) {
  return typeof rating === 'number' ? rating.toFixed(1) : rating;
}

function Cover({ item, className }) {
  if (item.img) return <img src={item.img} alt={item.title} className={`${className} object-cover`} />;
  const color = item.color || '#3a2858';
  return <div className={className} style={{ background: `linear-gradient(160deg, ${color}, ${color}88)` }} />;
}

export default function TrendingPanel({ items, onCardClick, onViewAll }) {
  const list = withFallbackCovers(items && items.length ? items : DEFAULT_ITEMS);
  const featured = list.find((item) => item.featured) || list[0];
  const otherTrends = list.filter((item) => item !== featured);

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col justify-between rounded-lg border border-[var(--panel-control-border)] bg-gradient-to-b from-[#ad63c4] to-[#824a93] p-5 shadow-lg">
      <div className="flex min-h-0 flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[var(--text-yellow)]">
            <Flame size={18} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
            Trending
          </h2>
          <span className="rounded-md bg-[var(--panel-control-idle)] px-2 py-1 text-[11px] font-bold text-[var(--panel-control-muted)]">Top 4</span>
        </div>

        <button
          type="button"
          onClick={() => onCardClick?.(featured)}
          aria-label={`Read ${featured.title}`}
          className="group relative mb-4 h-[148px] shrink-0 overflow-hidden rounded-lg border border-[var(--panel-control-border)] text-left shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text-yellow)]"
        >
          <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--text-yellow)] text-xs font-extrabold text-black shadow">
            {featured.rank ?? 1}
          </div>
          <Cover item={featured} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/[0.82] via-black/20 to-transparent p-3">
            <div className="min-w-0">
              <span className="block max-h-[2.5em] overflow-hidden text-sm font-extrabold leading-tight text-white drop-shadow-md">{featured.title}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--text-yellow)]">
                <Star size={12} className="fill-[var(--text-yellow)]" aria-hidden="true" />
                {formatRating(featured.rating)}
              </span>
            </div>
          </div>
        </button>

        <div className="panel-scroll flex min-h-0 flex-col gap-2.5 overflow-y-auto pr-1">
          {otherTrends.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCardClick?.(item)}
              aria-label={`Read ${item.title}`}
              className="group relative flex items-center gap-3 rounded-lg border border-[var(--panel-control-border)] bg-[var(--panel-control-idle)] p-2 text-left transition-colors hover:border-[var(--panel-control-border-strong)] hover:bg-[var(--panel-control-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text-yellow)]"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--text-yellow)] text-[10px] font-extrabold text-black shadow">
                {item.rank ?? idx + 2}
              </div>

              <Cover item={item} className="h-12 w-[70px] shrink-0 rounded-lg border border-[var(--panel-control-border)] shadow-sm transition-opacity group-hover:opacity-90" />

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <h4 className="mb-1 truncate text-[13px] font-bold leading-tight text-[var(--panel-control-text)] transition-colors group-hover:text-[var(--panel-hover-text)]">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-[var(--panel-control-muted)]">{formatRating(item.rating)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-yellow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
        onClick={onViewAll}
      >
        View All
        <ArrowRight size={15} strokeWidth={2.4} />
      </button>
    </aside>
  );
}
