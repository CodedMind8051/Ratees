import { Play, Plus, CheckCircle2, Film, Tv, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentItemsType } from '@/types/content.types';





interface HeroBannerProps {
  content: ContentItemsType;
  onViewDetails: () => void;
  watchStatus?: 'watched' | 'watching' | 'watchlater' | null;
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}


function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[480px] rounded-2xl overflow-hidden bg-card animate-pulse">

      {/* Gradient overlays — mirrors the real banner */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 lg:p-10">
        <div className="flex items-end justify-between gap-4 lg:gap-8">

          {/* Left block */}
          <div className="flex-1 min-w-0">

            {/* "Featured Today" eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2.5 w-16 sm:w-20 rounded bg-white/20" />
            </div>

            {/* Type badge + year */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-14 rounded-full bg-white/15" />
              <div className="h-3 w-10 rounded bg-white/12" />
            </div>

            {/* Title — two lines on mobile, one on lg */}
            <div className="space-y-2 mb-2">
              <div className="h-7 sm:h-9 lg:h-10 w-3/4 rounded-md bg-white/20" />
              <div className="h-7 sm:h-9 lg:h-10 w-1/2 rounded-md bg-white/15 sm:hidden" />
            </div>

            {/* Genre pills — hidden xs (mirrors real banner) */}
            <div className="hidden xs:flex gap-1.5 mt-2 mb-2.5 flex-wrap">
              <div className="h-5 w-14 rounded-full bg-white/12" />
              <div className="h-5 w-16 rounded-full bg-white/12" />
              <div className="h-5 w-12 rounded-full bg-white/12" />
            </div>

            {/* Description — md+ only (mirrors real banner) */}
            <div className="hidden md:block space-y-1.5 mt-2.5 mb-4 max-w-lg">
              <div className="h-3.5 w-full rounded bg-white/12" />
              <div className="h-3.5 w-5/6 rounded bg-white/10" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 mt-4">
              <div className="h-9 sm:h-10 w-28 sm:w-32 rounded-xl bg-white/20" />
              <div className="h-9 sm:h-10 w-24 sm:w-32 rounded-xl bg-white/12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function HeroBanner({ content, onViewDetails, watchStatus, onStatusChange }: HeroBannerProps) {

  if (!content) {
    return <HeroBannerSkeleton />;
  }

  const handleQuickAdd = () => {
    const next = watchStatus === 'watchlater' ? null : 'watchlater';
    onStatusChange(content._id, next);
    toast.success(next ? 'Added to Watch Later' : 'Removed from Watch Later');
  };


  return (
    <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[480px] rounded-2xl overflow-hidden">
      {/* Backdrop */}
      <img
        src={
          content?.backdrop?.startsWith("/")
            ? `${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${content?.backdrop}`
            : content?.backdrop === "N/A" ? "/assets/images/no_image.png" : "/assets/images/no_image.png"
        }
        alt={`${content?.title} backdrop`}
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
                {content?.Content_Type === 'movie' ? <Film size={10} /> : content?.Content_Type === "tv" ? <Tv size={10} /> : <EyeOff size={11} />}
                {content?.Content_Type}
              </span>
              <span className="text-[10px] sm:text-xs text-white/50 tabular-nums">
                {content?.release_date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
              {content?.title}
            </h1>

            {/* Genres — hide on smallest screens */}
            <div className="hidden xs:flex flex-wrap gap-1.5 mt-2">
              {content?.genre?.map(g => (
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

        </div>
      </div>
    </div>
  );
}