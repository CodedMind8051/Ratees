import React, { useState, useMemo } from 'react';
import {
  BookMarked, CheckCircle2, Eye, Clock, SlidersHorizontal,
  ArrowUpDown, Film, Tv, X, Filter
} from 'lucide-react';
import { allContent, mockWatchlist, WatchlistEntry, RATING_LABELS, RatingKey } from '@/data/mockData';
import MovieDetailModal from '@/components/MovieDetailModal';
import { ContentItem } from '@/data/mockData';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


type StatusTab = 'watching' | 'watchlater' | 'watched';
type SortOption = 'dateAdded' | 'title' | 'rating' | 'year';

const tabConfig = {
  watching: { label: 'Watching', icon: Eye, color: 'text-blue-400', activeBg: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
  watchlater: { label: 'Watch Later', icon: Clock, color: 'text-primary', activeBg: 'bg-primary/10 border-primary/30 text-primary' },
  watched: { label: 'Watched', icon: CheckCircle2, color: 'text-green-400', activeBg: 'bg-green-400/10 border-green-400/30 text-green-400' },
};

const ratingBadgeClass: Record<RatingKey, string> = {
  waste: 'bg-red-500/10 text-red-400 border border-red-500/20',
  timepass: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  good: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  masterpiece: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export default function WatchlistContent() {
  const [activeTab, setActiveTab] = useState<StatusTab>('watching');
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(mockWatchlist);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [filterType, setFilterType] = useState<'All' | 'Movie' | 'Series'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const tabEntries = useMemo(() => {
    let entries = watchlist.filter(w => w.status === activeTab);
    const withContent = entries.map(e => {
      const content = allContent.find(c => c.id === e.contentId);
      return content ? { entry: e, content } : null;
    }).filter(Boolean) as { entry: WatchlistEntry; content: ContentItem }[];

    let filtered = withContent;
    if (filterType !== 'All') {
      filtered = filtered.filter(({ content }) => content.type === filterType);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'title') return a.content.title.localeCompare(b.content.title);
      if (sortBy === 'year') return b.content.year - a.content.year;
      return 0;
    });
  }, [activeTab, watchlist, sortBy, filterType]);

  const tabCounts = useMemo(() => ({
    watching: watchlist.filter(w => w.status === 'watching').length,
    watchlater: watchlist.filter(w => w.status === 'watchlater').length,
    watched: watchlist.filter(w => w.status === 'watched').length,
  }), [watchlist]);

  const handleStatusChange = (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => {
    // BACKEND: PATCH /api/watchlist/:contentId { status }
    setWatchlist(prev => {
      if (status === null) return prev.filter(w => w.contentId !== contentId);
      return prev.map(w => w.contentId === contentId ? { ...w, status } : w);
    });
  };

  const handleRemove = (contentId: string) => {
    // BACKEND: DELETE /api/watchlist/:contentId
    setWatchlist(prev => prev.filter(w => w.contentId !== contentId));
    toast.success('Removed from watchlist');
  };

  const handleMoveStatus = (contentId: string, newStatus: 'watched' | 'watching' | 'watchlater') => {
    // BACKEND: PATCH /api/watchlist/:contentId { status: newStatus }
    setWatchlist(prev => prev.map(w => w.contentId === contentId ? { ...w, status: newStatus } : w));
    toast.success(`Moved to ${tabConfig[newStatus].label}`);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <BookMarked size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {watchlist.length} titles tracked across all statuses
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters & Sort
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 slide-up">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sort By</p>
              <div className="flex gap-2">
                {([
                  { value: 'dateAdded', label: 'Date Added' },
                  { value: 'title', label: 'Title A–Z' },
                  { value: 'year', label: 'Year' },
                ] as { value: SortOption; label: string }[]).map(opt => (
                  <button
                    key={`sort-${opt.value}`}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      sortBy === opt.value
                        ? 'bg-primary/10 border-primary/30 text-primary' :'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Content Type</p>
              <div className="flex gap-2">
                {(['All', 'Movie', 'Series'] as const).map(type => (
                  <button
                    key={`type-${type}`}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      filterType === type
                        ? 'bg-primary/10 border-primary/30 text-primary' :'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(tabConfig) as StatusTab[]).map(tab => {
          const cfg = tabConfig[tab];
          const Icon = cfg.icon;
          const isActive = activeTab === tab;
          return (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                isActive ? cfg.activeBg : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={15} />
              {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-secondary'}`}>
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {tabEntries.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          {React.createElement(tabConfig[activeTab].icon, { size: 44, className: `mx-auto mb-4 ${tabConfig[activeTab].color}` })}
          <p className="text-lg font-semibold text-foreground mb-2">
            Nothing in {tabConfig[activeTab].label}
          </p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {activeTab === 'watching' && 'Start watching something from your Watch Later list or browse the home page to find your next binge.'}
            {activeTab === 'watchlater' && 'Browse the home page and hit "Watch Later" on titles that catch your eye.'}
            {activeTab === 'watched' && 'Mark titles as Watched after you finish them to build your viewing history.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {tabEntries.map(({ entry, content }) => (
            <WatchlistCard
              key={`wl-card-${entry.id}`}
              entry={entry}
              content={content}
              onViewDetails={() => setSelectedContent(content)}
              onRemove={() => handleRemove(content.id)}
              onMoveStatus={(status) => handleMoveStatus(content.id, status)}
            />
          ))}
        </div>
      )}

      {selectedContent && (
        <MovieDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          initialStatus={watchlist.find(w => w.contentId === selectedContent.id)?.status ?? null}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

interface WatchlistCardProps {
  entry: WatchlistEntry;
  content: ContentItem;
  onViewDetails: () => void;
  onRemove: () => void;
  onMoveStatus: (status: 'watched' | 'watching' | 'watchlater') => void;
}

function WatchlistCard({ entry, content, onViewDetails, onRemove, onMoveStatus }: WatchlistCardProps) {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);

  const moveOptions = (['watched', 'watching', 'watchlater'] as const).filter(s => s !== entry.status);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-muted transition-all duration-200">
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={onViewDetails}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onViewDetails(); }}
      >
        <div className="aspect-[16/9] overflow-hidden bg-secondary">
          <img src={content.poster} alt={`${content.title} poster`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Progress bar for watching */}
        {entry.status === 'watching' && entry.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-blue-400 transition-all"
              style={{ width: `${entry.progress}%` }}
            />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
            content.type === 'Movie' ? 'bg-card/90 border-border text-muted-foreground' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
          }`}>
            {content.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
            {content.type}
          </span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
          title="Remove from watchlist"
        >
          <X size={12} />
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{content.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{content.year} · {content.genre[0]}</p>
          </div>
          {entry.personalRating && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
              entry.personalRating === 'masterpiece' ? 'bg-green-500/10 text-green-400' :
              entry.personalRating === 'good' ? 'bg-yellow-500/10 text-yellow-400' :
              entry.personalRating === 'timepass'? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {RATING_LABELS[entry.personalRating].split(' ')[0]}
            </span>
          )}
        </div>

        {entry.status === 'watching' && entry.progress !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-blue-400 font-medium">{entry.progress}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${entry.progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Added {entry.dateAdded}</p>
          <div className="relative">
            <button
              onClick={() => setMoveMenuOpen(!moveMenuOpen)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Move to <ArrowUpDown size={10} />
            </button>
            {moveMenuOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-card border border-border rounded-lg shadow-xl z-10 py-1 min-w-[130px] fade-in">
                {moveOptions.map(status => {
                  const cfg = tabConfig[status];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={`move-${status}`}
                      onClick={() => { setMoveMenuOpen(false); onMoveStatus(status); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary transition-colors ${cfg.color}`}
                    >
                      <Icon size={12} />
                      {cfg.label}
                </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}