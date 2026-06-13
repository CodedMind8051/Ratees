import { Play, Plus, CheckCircle2, Film, Tv } from 'lucide-react';
import { ContentItem, RATING_LABELS, RATING_COLORS } from '@/data/mockData';
import { toast } from 'sonner';

interface HeroBannerProps {
  content: ContentItem;
  onViewDetails: () => void;
  watchStatus?: 'watched' | 'watching' | 'watchlater' | null;
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

export default function HeroBanner({ content, onViewDetails, watchStatus, onStatusChange }: HeroBannerProps) {
  const handleQuickAdd = () => {
    const next = watchStatus === 'watchlater' ? null : 'watchlater';
    onStatusChange(content.id, next);
    toast.success(next ? 'Added to Watch Later' : 'Removed from Watch Later');
  };

  const ratingColor = RATING_COLORS[content.aggregateRating];

  return (
    <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[480px] rounded-2xl overflow-hidden">
      {/* Backdrop */}
      <img
        src={content.backdrop}
        alt={`${content.title} backdrop`}
        className="w-full h-full object-cover object-center scale-[1.02]"
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 lg:p-10">

        {/* Featured eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
            Featured Today
          </span>
          <span className="w-6 sm:w-10 h-px bg-primary/70" />
        </div>

        <div className="flex items-end justify-between gap-4 lg:gap-8">
          {/* Left: title + meta + actions */}
          <div className="flex-1 min-w-0">

            {/* Type + year + runtime */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80 backdrop-blur-sm">
                {content.type === 'Movie' ? <Film size={9} /> : <Tv size={9} />}
                {content.type}
              </span>
              <span className="text-[10px] sm:text-xs text-white/50 tabular-nums">
                {content.year} · {content.runtime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
              {content.title}
            </h1>

            {/* Genres — hide on smallest screens */}
            <div className="hidden xs:flex flex-wrap gap-1.5 mt-2">
              {content.genre.map(g => (
                <span
                  key={`hero-genre-${g}`}
                  className="text-[10px] sm:text-xs px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-white/60"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description — only md+ */}
            <p className="hidden md:block text-xs sm:text-sm text-white/60 mt-2.5 max-w-lg line-clamp-2 leading-relaxed">
              {content.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2.5 mt-4">
              <button
                onClick={onViewDetails}
                className="flex items-center gap-2 hover:cursor-pointer px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <Play size={13} fill="currentColor" />
                View Details
              </button>
              <button
                onClick={handleQuickAdd}
                className={[
                  'flex items-center gap-2 px-4 hover:cursor-pointer sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all active:scale-95 backdrop-blur-sm',
                  watchStatus === 'watchlater'
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                ].join(' ')}
              >
                {watchStatus === 'watchlater'
                  ? <CheckCircle2 size={13} />
                  : <Plus size={13} />
                }
                <span className="hidden xs:inline">
                  {watchStatus === 'watchlater' ? 'In Watch Later' : 'Watch Later'}
                </span>
                <span className="xs:hidden">
                  {watchStatus === 'watchlater' ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
          </div>

          {/* Right: rating card — sm+ only */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-4 py-3.5 bg-black/50 border border-white/10 rounded-2xl backdrop-blur-md shrink-0 min-w-[80px]">
            <span
              className="text-2xl lg:text-3xl font-black tabular-nums leading-none"
              style={{ color: ratingColor }}
            >
              {content.ratingDistribution[content.aggregateRating]}%
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wide text-center leading-tight max-w-[72px]"
              style={{ color: ratingColor }}
            >
              {RATING_LABELS[content.aggregateRating]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}