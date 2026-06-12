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
  const handleQuickAdd = (status: 'watchlater') => {
    const next = watchStatus === status ? null : status;
    onStatusChange(content.id, next);
    toast.success(next ? 'Added to Watch Later' : 'Removed from Watch Later');
  };

  return (
    <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden">
      <img
        src={content.backdrop}
        alt={`${content.title} featured backdrop`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 gradient-overlay" />
      <div className="absolute inset-0 hero-gradient" />

      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
        {/* Featured label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Featured Today</span>
          <span className="w-8 h-px bg-primary" />
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80 flex items-center gap-1">
                {content.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
                {content.type}
              </span>
              <span className="text-xs text-white/60">{content.year} · {content.runtime}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight truncate">{content.title}</h1>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {content.genre.map(g => (
                <span key={`hero-genre-${g}`} className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/70">{g}</span>
              ))}
            </div>
            <p className="text-sm text-white/70 mt-3 max-w-xl line-clamp-2 leading-relaxed">{content.description}</p>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={onViewDetails}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
              >
                <Play size={15} fill="currentColor" />
                View Details
              </button>
              <button
                onClick={() => handleQuickAdd('watchlater')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                  watchStatus === 'watchlater' ?'bg-primary/20 border-primary/50 text-primary' :'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {watchStatus === 'watchlater' ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                {watchStatus === 'watchlater' ? 'In Watch Later' : 'Watch Later'}
              </button>
            </div>
          </div>

          {/* Rating pill */}
          <div className="hidden lg:flex flex-col items-center p-4 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm shrink-0">
            <span className="text-3xl font-bold" style={{ color: RATING_COLORS[content.aggregateRating] }}>
              {content.ratingDistribution[content.aggregateRating]}%
            </span>
            <span className="text-xs text-white/60 mt-1 text-center max-w-[80px] leading-tight">
              {RATING_LABELS[content.aggregateRating]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}