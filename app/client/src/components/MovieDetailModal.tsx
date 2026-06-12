import  { useState, useEffect } from 'react';
import {
  X, Star, Eye, Clock, CheckCircle2, Plus, Film, Tv,
  ChevronDown, Pencil, Trash2, Send, Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ContentItem, RatingKey, RATING_LABELS, RATING_COLORS, Review
} from '@/data/mockData';
import RatingDistributionChart from './RatingDistributionChart';



interface MovieDetailModalProps {
  content: ContentItem;
  onClose: () => void;
  initialStatus?: 'watched' | 'watching' | 'watchlater' | null;
  onStatusChange?: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
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

export default function MovieDetailModal({ content, onClose, initialStatus, onStatusChange }: MovieDetailModalProps) {
  const [activeStatus, setActiveStatus] = useState<'watched' | 'watching' | 'watchlater' | null>(initialStatus ?? null);
  const [reviews, setReviews] = useState<Review[]>(content.reviews);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<RatingKey>('good');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState<RatingKey>('good');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [playlistDropdownOpen, setPlaylistDropdownOpen] = useState(false);
  const [myRating, setMyRating] = useState<RatingKey | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleStatusToggle = (status: 'watched' | 'watching' | 'watchlater') => {
    const next = activeStatus === status ? null : status;
    setActiveStatus(next);
    onStatusChange?.(content.id, next);
    toast.success(next ? `Added to ${statusConfig[status].label}` : 'Removed from watchlist');
    // BACKEND: POST /api/watchlist { contentId: content.id, status: next }
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    // BACKEND: POST /api/reviews { contentId: content.id, rating: newRating, comment: newComment }
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
    setReviews(prev => [newRev, ...prev]);
    setNewComment('');
    setNewRating('good');
    setSubmitting(false);
    toast.success('Review posted');
  };

  const handleUpdateReview = async (id: string) => {
    // BACKEND: PATCH /api/reviews/:id { rating: editRating, comment: editComment }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, rating: editRating, comment: editComment } : r));
    setEditingId(null);
    toast.success('Review updated');
  };

  const handleDeleteReview = async (id: string) => {
    // BACKEND: DELETE /api/reviews/:id
    setReviews(prev => prev.filter(r => r.id !== id));
    setDeleteConfirmId(null);
    toast.success('Review deleted');
  };

  const playlists = ['Nolan Universe', 'Watch on a Rainy Night', 'Weekend Binge'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header backdrop */}
        <div className="relative h-48 shrink-0 overflow-hidden">
          <img src={content.backdrop} alt={`${content.title} backdrop`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-overlay" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${ratingBadgeClass[content.aggregateRating]}`}>
              {RATING_LABELS[content.aggregateRating]}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/50 text-white border border-white/10">
              {content.type === 'Movie' ? <Film size={10} className="inline mr-1" /> : <Tv size={10} className="inline mr-1" />}
              {content.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Top section: poster + info */}
            <div className="flex gap-6">
              {/* Poster */}
              <div className="shrink-0 w-32 -mt-5 relative z-10">
                <div className="w-32 h-48 rounded-xl overflow-hidden border-2 border-border shadow-2xl">
                  <img src={content.poster} alt={`${content.title} poster`} className="w-full h-full object-cover" />
                </div>
                {/* Status buttons below poster */}
                <div className="mt-3 flex flex-col gap-1.5">
                  {(['watched', 'watching', 'watchlater'] as const).map(status => {
                    const cfg = statusConfig[status];
                    const Icon = cfg.icon;
                    const isActive = activeStatus === status;
                    return (
                      <button
                        key={`status-${status}`}
                        onClick={() => handleStatusToggle(status)}
                        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                          isActive ? `${cfg.bg} ${cfg.color}` : 'border-border text-muted-foreground hover:border-muted hover:text-foreground'
                        }`}
                      >
                        <Icon size={11} />
                        {cfg.label}
                      </button>
                    );
                  })}

                  {/* Add to Playlist */}
                  <div className="relative mt-1">
                    <button
                      onClick={() => setPlaylistDropdownOpen(!playlistDropdownOpen)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border border-dashed border-primary/40 text-primary hover:bg-primary/10 transition-all"
                    >
                      <Plus size={11} />
                      Add to List
                      <ChevronDown size={10} className="ml-auto" />
                    </button>
                    {playlistDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-20 py-1 fade-in">
                        {playlists.map(pl => (
                          <button
                            key={`pl-opt-${pl}`}
                            onClick={() => { setPlaylistDropdownOpen(false); toast.success(`Added to "${pl}"`); }}
                            className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                          >
                            {pl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-foreground leading-tight">{content.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">{content.year}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{content.runtime}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">Dir. {content.director}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {content.genre.map(g => (
                    <span key={`genre-tag-${g}`} className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground">
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{content.description}</p>

                {/* Streaming platforms */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Where to Watch</p>
                  <div className="flex flex-wrap gap-2">
                    {content.platforms.map(platform => (
                      <span
                        key={`platform-${platform}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs font-medium text-foreground"
                      >
                        <Monitor size={11} className="text-primary" />
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground mb-4">Community Rating</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  {RATING_ORDER.map(key => {
                    const pct = content.ratingDistribution[key];
                    return (
                      <div key={`dist-${key}`} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-28 shrink-0" style={{ color: RATING_COLORS[key] }}>
                          {RATING_LABELS[key]}
                        </span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: RATING_COLORS[key] }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right font-mono">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <RatingDistributionChart distribution={content.ratingDistribution} />
              </div>
            </div>

            {/* Rate This — standalone rating section below Community Rating */}
            <div className="mt-6 bg-secondary/40 border border-border rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Rate This</p>
              <div className="flex flex-wrap gap-2">
                {RATING_ORDER.map(key => (
                  <button
                    key={`my-rating-${key}`}
                    onClick={() => {
                      const next = myRating === key ? null : key;
                      setMyRating(next);
                      if (next) toast.success(`Rated: ${RATING_LABELS[key]}`);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      myRating === key
                        ? `${ratingBadgeClass[key]} scale-105 shadow-md`
                        : 'border-border text-muted-foreground hover:border-muted hover:text-foreground'
                    }`}
                  >
                    {RATING_LABELS[key]}
                  </button>
                ))}
              </div>
              {myRating && (
                <p className="text-xs text-muted-foreground mt-2">
                  Your rating: <span className="font-semibold" style={{ color: RATING_COLORS[myRating] }}>{RATING_LABELS[myRating]}</span>
                  <button
                    onClick={() => setMyRating(null)}
                    className="ml-2 underline hover:text-foreground transition-colors"
                  >
                    Remove
                  </button>
                </p>
              )}
            </div>

            {/* Cast */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground mb-4">Cast & Crew</p>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {content.cast.map(member => (
                  <div key={member.id} className="shrink-0 text-center w-20">
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-border">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-medium text-foreground mt-2 leading-tight">{member.name}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground mb-4">
                Reviews <span className="text-muted-foreground font-normal">({reviews.length})</span>
              </p>

              {/* Write review */}
              <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Write a Review</p>
     
                <div className="flex gap-3">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this title..."
                    rows={3}
                    className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting || !newComment.trim()}
                    className="self-end px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {submitting
                      ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      : <Send size={14} />
                    }
                    {submitting ? '' : 'Post'}
                  </button>
                </div>
              </div>

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reviews yet — be the first to rate this title.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-secondary/30 border border-border rounded-xl p-4">
                      {editingId === review.id ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {RATING_ORDER.map(key => (
                              <button
                                key={`edit-rating-${key}`}
                                onClick={() => setEditRating(key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  editRating === key ? `${ratingBadgeClass[key]} scale-105` : 'border-border text-muted-foreground hover:border-muted'
                                }`}
                              >
                                {RATING_LABELS[key]}
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={editComment}
                            onChange={e => setEditComment(e.target.value)}
                            rows={3}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none mb-3"
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary">Cancel</button>
                            <button
                              onClick={() => handleUpdateReview(review.id)}
                              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-amber-400"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                                {review.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{review.username}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingBadgeClass[review.rating]}`}>
                                {RATING_LABELS[review.rating]}
                              </span>
                              {review.isOwn && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => { setEditingId(review.id); setEditComment(review.comment); setEditRating(review.rating); }}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    title="Edit review"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(review.id)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                                    title="Delete review"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">Delete Review?</h3>
            <p className="text-sm text-muted-foreground mb-5">This will permanently remove your review. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button
                onClick={() => handleDeleteReview(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}