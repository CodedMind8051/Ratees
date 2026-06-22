import { useState, useEffect, useRef } from 'react';
import {
  X, Eye, Clock, CheckCircle2, Plus, Film, Tv, UserCircle,
  ChevronDown, Pencil, Trash2, Send, Monitor, Star
} from 'lucide-react';
import { toast } from 'sonner';
import {
  RatingKey, RATING_LABELS, RATING_COLORS, Review
} from '@/data/mockData';
import type { ContentFullDetailType } from "@/types/Content.types"
import RatingDistributionChart from './RatingDistributionChart';
import { useQuery } from '@apollo/client/react';
import { FETCH_FULL_CONTENT_DETAIL } from '@/lib/graphql/query/content.query';


interface MovieDetailModalProps {
  contentId: string;
  onClose: () => void;
  initialStatus?: 'watched' | 'watching' | 'watchlater' | null;
  onStatusChange?: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

interface GetContentDetailsResponse {
  getContentDetails: ContentFullDetailType;
}

const RATING_ORDER: RatingKey[] = ['waste', 'timepass', 'good', 'masterpiece'];

const statusConfig = {
  watched: { label: 'Watched', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  watching: { label: 'Watching', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  watchlater: { label: 'Watch Later', icon: Clock, color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
};

const ratingBadgeClass: Record<RatingKey, string> = {
  waste: 'bg-rating-waste rating-waste border border-red-500/20',
  timepass: 'bg-rating-timepass rating-timepass border border-orange-500/20',
  good: 'bg-rating-good rating-good border border-yellow-500/20',
  masterpiece: 'bg-rating-masterpiece rating-masterpiece border border-green-500/20',
};

const ratingOptions = ["wasteOfTimePercentage", "TimePassPercentage", "GoodWatchPercentage", "masterpiecePercentage"] as const

export default function MovieDetailModal({
  contentId, onClose, initialStatus, onStatusChange,
}: MovieDetailModalProps) {

  console.log(contentId)

  const { loading, error, data } = useQuery<GetContentDetailsResponse>(FETCH_FULL_CONTENT_DETAIL, {
    variables: {
      ContentId: contentId
    }
  })


  const content: ContentFullDetailType = data?.getContentDetails


  const [activeStatus, setActiveStatus] = useState<'watched' | 'watching' | 'watchlater' | null>(initialStatus ?? null);
  // const [reviews, setReviews] = useState<Review[]>(content?.reviews);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<RatingKey>('good');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState<RatingKey>('good');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [playlistDropdownOpen, setPlaylistDropdownOpen] = useState(false);
  const [myRating, setMyRating] = useState<RatingKey | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Lock scroll + Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Close playlist dropdown on outside click
  useEffect(() => {
    if (!playlistDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlaylistDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [playlistDropdownOpen]);

  const handleStatusToggle = (status: 'watched' | 'watching' | 'watchlater') => {
    const next = activeStatus === status ? null : status;
    setActiveStatus(next);
    onStatusChange?.(content?._id, next);
    toast.success(next ? `Added to ${statusConfig[status].label}` : 'Removed from watchlist');
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const newRev: Review = {
      id: `rev-new-${Date.now()}`,
      userId: 'user-self',
      username: 'Arjun Rao',
      avatar: 'AR',
      rating: newRating,
      comment: newComment,
      date: 'Jun 12, 2026',
      isOwn: true,
    };
    // setReviews(prev => [newRev, ...prev]);
    setNewComment('');
    setNewRating('good');
    setSubmitting(false);
    toast.success('Review posted');
  };

  const handleUpdateReview = async (id: string) => {
    // setReviews(prev => prev.map(r => r.id === id ? { ...r, rating: editRating, comment: editComment } : r));
    setEditingId(null);
    toast.success('Review updated');
  };

  const handleDeleteReview = async (id: string) => {
    // setReviews(prev => prev.filter(r => r.id !== id));
    setDeleteConfirmId(null);
    toast.success('Review deleted');
  };

  const playlists = ['Nolan Universe', 'Watch on a Rainy Night', 'Weekend Binge'];


  if (loading) {
    return <>loading</>
  } else {
    console.log(content)
    return (


      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Modal shell — bottom sheet on mobile, centered card on sm+ */}
        <div
          className={[
            'relative w-full bg-card border-border flex flex-col fade-in',
            'sm:max-w-3xl sm:rounded-2xl sm:border sm:max-h-[90vh]',
            'rounded-t-2xl border-t border-x max-h-[95dvh]',
          ].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          {/* ─── Backdrop hero ───────────────────────────────────────────── */}
          <div className="relative h-40 sm:h-52 shrink-0 overflow-hidden rounded-t-2xl">
            <img
              src={
                content?.backdrop?.startsWith("/")
                  ? `${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${content?.backdrop}`
                  : content?.backdrop === "N/A" ? "/assets/images/no_image.png" : "/assets/images/no_image.png"
              }
              alt={`${content.title} backdrop`}
              className="w-full h-full object-cover"
            />
            {/* Gradient: dark bottom + subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 active:scale-95 transition-all"
            >
              <X size={16} />
            </button>

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/90 border border-white/10 flex items-center gap-1">
                {content?.Content_Type === 'movie' ? <Film size={10} /> : <Tv size={10} />}
                {content?.Content_Type}
              </span>
            </div>
          </div>

          {/* ─── Scrollable body ──────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-4 sm:px-6 pb-8">

              {/* ── Hero row: poster + title block ── */}
              <div className="flex gap-4 -mt-14 sm:-mt-16 relative z-10 mb-6">
                {/* Poster */}
                <div className="shrink-0">
                  <div className="w-24 h-36 mt-18 sm:w-32 sm:h-48 rounded-xl overflow-hidden border-2 border-border shadow-2xl ring-1 ring-white/5">
                    <img
                      src={
                        content.poster?.startsWith("/")
                          ? `${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${content.poster}`
                          : content?.poster === "N/A" ? "/assets/images/no_image.png" : "/assets/images/no_image.png"
                      }
                      alt={`${content.title} poster`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0 pt-16 sm:pt-20">
                  <h2 className="text-lg sm:text-2xl font-bold text-foreground leading-tight line-clamp-2">
                    {content.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                    <span>{content?.release_date}</span>
                    <span className="opacity-40">·</span>
            <span>
  {content?.runtime === "N/A" || !content?.runtime
    ? "Runtime: N/A"
    : `${Math.floor(content.runtime / 60)} hr ${content.runtime % 60} min`}
</span>
                    <span className="opacity-40">·</span>
                    <span className="truncate">Dir. {content?.director}</span>
                  </div>
                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {content.genre.map(g => (
                      <span
                        key={`genre-${g}`}
                        className="px-2 py-0.5 bg-secondary/80 rounded-full text-[10px] font-medium text-muted-foreground uppercase tracking-wide"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {content.description}
              </p>

              {/* ── Action row: status buttons + playlist ── */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['watched', 'watching', 'watchlater'] as const).map(status => {
                  const cfg = statusConfig[status];
                  const Icon = cfg.icon;
                  const isActive = activeStatus === status;
                  return (
                    <button
                      key={`status-${status}`}
                      onClick={() => handleStatusToggle(status)}
                      className={[
                        'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95',
                        isActive
                          ? `${cfg.bg} ${cfg.color}`
                          : 'border-border text-muted-foreground hover:border-muted hover:text-foreground',
                      ].join(' ')}
                    >
                      <Icon size={12} />
                      {cfg.label}
                    </button>
                  );
                })}

                {/* Playlist dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setPlaylistDropdownOpen(p => !p)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-primary/50 text-primary hover:bg-primary/10 transition-all active:scale-95"
                  >
                    <Plus size={12} />
                    Add to List
                    <ChevronDown size={10} className={`ml-0.5 transition-transform ${playlistDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {playlistDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 bg-card border border-border rounded-xl shadow-2xl z-30 py-1 fade-in overflow-hidden">
                      {playlists.map(pl => (
                        <button
                          key={`pl-${pl}`}
                          onClick={() => { setPlaylistDropdownOpen(false); toast.success(`Added to "${pl}"`); }}
                          className="w-full text-left px-4 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
                        >
                          {pl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Where to Watch ── */}
              <div className="mb-8">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Where to Watch
                </p>
                <div className="flex flex-wrap gap-2">
                  {content?.whereTOwatch && content.whereTOwatch.length > 0 ? (
                    content.whereTOwatch.map(platform => (
                      <div
                        key={`platform-${platform?.platform}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary/60 border border-border rounded-xl text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        {platform?.logo ? (
                          <img
                            src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}/${platform?.logo}`}
                            alt={platform?.platform}
                            className="w-4 h-4 rounded-sm object-contain"
                          />
                        ) : (
                          <Monitor size={12} className="text-primary shrink-0" />
                        )}
                        <span>{platform?.platform}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                      <Monitor size={13} className="opacity-50" />
                      <span>Not available on any platform</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Community Rating ── */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Community Rating
                </p>
                {/* Stacked on mobile, side-by-side on sm+ */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3">
                    {RATING_ORDER.map((key,index) => {
                      const pct = content?.Ratings[ratingOptions[index] !] || 0;
                      
                      return (
                        <div key={`dist-${key}`} className="flex items-center gap-3">
                         
                        <span className="text-xs font-medium w-24 shrink-0" style={{ color: RATING_COLORS[key] }}>
                            {RATING_LABELS[key]}
                          </span>
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: RATING_COLORS[key] }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right font-mono tabular-nums">
                            {pct}%
                             </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center sm:justify-end">
                    <RatingDistributionChart distribution={{
                      masterpiece: content?.Ratings?.masterpiecePercentage ? content?.Ratings?.masterpiecePercentage : 0,
                      waste: content?.Ratings?.wasteOfTimePercentage ? content?.Ratings?.wasteOfTimePercentage : 0,
                      timepass: content?.Ratings?.TimePassPercentage ? content?.Ratings?.TimePassPercentage : 0,
                      good: content?.Ratings?.GoodWatchPercentage ? content?.Ratings?.GoodWatchPercentage : 0
                    }} />
                  </div>
                </div>
              </div>

              {/* ── Rate This ── */}
              <div className="bg-secondary/40 border border-border rounded-xl p-4 mb-8">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Your Rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {RATING_ORDER.map(key => (
                    <button
                      key={`my-rating-${key}`}
                      onClick={() => {
                        const next = myRating === key ? null : key;
                        setMyRating(next);
                        if (next) toast.success(`Rated: ${RATING_LABELS[key]}`);
                      }}
                      className={[
                        'px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95',
                        myRating === key
                          ? `${ratingBadgeClass[key]} scale-105 shadow-md`
                          : 'border-border text-muted-foreground hover:border-muted hover:text-foreground',
                      ].join(' ')}
                    >
                      {RATING_LABELS[key]}
                    </button>
                  ))}
                </div>
                {myRating && (
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    Your rating:{' '}
                    <span className="font-semibold" style={{ color: RATING_COLORS[myRating] }}>
                      {RATING_LABELS[myRating]}
                    </span>
                    <button
                      onClick={() => setMyRating(null)}
                      className="underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      Remove
                    </button>
                  </p>
                )}
              </div>

              {/* ── Cast & Crew ── */}
              <div className="mb-8">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Cast & Crew
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory">
                  {content?.casts.map((member, index) => (
                    <div className="shrink-0 text-center w-[72px] snap-start">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mx-auto border-2 border-border ring-1 ring-white/5 bg-secondary/60 flex items-center justify-center">
                        {member?.profile_path ? (
                          <img
                            src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}/${member.profile_path}`}
                            alt={member?.name ?? "Cast member"}
                            className="w-full h-full object-cover "
                          />
                        ) : (
                          <UserCircle className="w-full h-full text-muted-foreground/40" />
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-foreground mt-2 leading-tight truncate">
                        {member?.name ?? "Unknown"}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight truncate">
                        {member?.character ?? "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Reviews ── */}
              <div>
                {/* <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Reviews{' '}
                <span className="text-muted-foreground/60 font-normal normal-case tracking-normal">
                  ({reviews.length})
                </span>
              </p> */}

                {/* Write review */}
                <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    Write a Review
                  </p>
                  {/* Comment + send */}
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Share your thoughts on this title..."
                      rows={3}
                      className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none transition-colors"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting || !newComment.trim()}
                      className="shrink-0 p-3 bg-primary text-primary-foreground rounded-xl hover:bg-amber-400 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center"
                      aria-label="Post review"
                    >
                      {submitting
                        ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        : <Send size={15} />
                      }
                    </button>
                  </div>
                </div>

                {/* Reviews list */}

              </div>
            </div>
          </div>
        </div>

        {/* ─── Delete confirm modal ───────────────────────────────────────── */}

      </div>
    )
  };
}
