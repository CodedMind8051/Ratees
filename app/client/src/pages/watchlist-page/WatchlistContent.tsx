import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookMarked, CheckCircle2, Eye, Clock, SlidersHorizontal,
  ArrowUpDown, Film, Tv, X
} from 'lucide-react';
import { allContent, mockWatchlist, WatchlistEntry, RATING_LABELS, RatingKey } from '@/data/mockData';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';
import { ContentItem } from '@/data/mockData';
import { toast } from 'sonner';

type StatusTab = 'watching' | 'watchlater' | 'watched';
type SortOption = 'dateAdded' | 'title' | 'year';

const tabConfig = {
  watching:   { label: 'Watching',    icon: Eye,          color: 'text-blue-400',  activeBg: 'bg-blue-400/10 border-blue-400/30 text-blue-400'  },
  watchlater: { label: 'Watch Later', icon: Clock,        color: 'text-primary',   activeBg: 'bg-primary/10 border-primary/30 text-primary'     },
  watched:    { label: 'Watched',     icon: CheckCircle2, color: 'text-green-400', activeBg: 'bg-green-400/10 border-green-400/30 text-green-400' },
};

const emptyMessages: Record<StatusTab, string> = {
  watching:   'Start watching something from your Watch Later list or browse the home page to find your next binge.',
  watchlater: 'Browse the home page and hit "Watch Later" on titles that catch your eye.',
  watched:    'Mark titles as Watched after you finish them to build your viewing history.',
};

export default function WatchlistContent() {
  const [activeTab, setActiveTab]         = useState<StatusTab>('watching');
  const [watchlist, setWatchlist]         = useState<WatchlistEntry[]>(mockWatchlist);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [sortBy, setSortBy]               = useState<SortOption>('dateAdded');
  const [filterType, setFilterType]       = useState<'All' | 'Movie' | 'Series'>('All');
  const [showFilters, setShowFilters]     = useState(false);

  const tabEntries = useMemo(() => {
    const withContent = watchlist
      .filter(w => w.status === activeTab)
      .map(e => {
        const content = allContent.find(c => c.id === e.contentId);
        return content ? { entry: e, content } : null;
      })
      .filter(Boolean) as { entry: WatchlistEntry; content: ContentItem }[];

    const filtered = filterType === 'All'
      ? withContent
      : withContent.filter(({ content }) => content.type === filterType);

    return filtered.sort((a, b) => {
      if (sortBy === 'title') return a.content.title.localeCompare(b.content.title);
      if (sortBy === 'year')  return b.content.year - a.content.year;
      return 0;
    });
  }, [activeTab, watchlist, sortBy, filterType]);

  const tabCounts = useMemo(() => ({
    watching:   watchlist.filter(w => w.status === 'watching').length,
    watchlater: watchlist.filter(w => w.status === 'watchlater').length,
    watched:    watchlist.filter(w => w.status === 'watched').length,
  }), [watchlist]);

  const handleStatusChange = (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => {
    setWatchlist(prev =>
      status === null
        ? prev.filter(w => w.contentId !== contentId)
        : prev.map(w => w.contentId === contentId ? { ...w, status } : w)
    );
  };

  const handleRemove = (contentId: string) => {
    setWatchlist(prev => prev.filter(w => w.contentId !== contentId));
    toast.success('Removed from watchlist');
  };

  const handleMoveStatus = (contentId: string, newStatus: 'watched' | 'watching' | 'watchlater') => {
    setWatchlist(prev => prev.map(w => w.contentId === contentId ? { ...w, status: newStatus } : w));
    toast.success(`Moved to ${tabConfig[newStatus].label}`);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'title',     label: 'Title A–Z'  },
    { value: 'year',      label: 'Year'        },
  ];

  return (
    <div className="watchlist-content-component max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">

      <style>{`\
        .watchlist-content-component button,\
        .watchlist-content-component [role="button"],\
        .watchlist-content-component input[type="button"],\
        .watchlist-content-component input[type="submit"] {\
          cursor: pointer;\
        }\
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BookMarked size={20} className="text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Watchlist</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {watchlist.length} titles tracked
          </p>
        </div>

        <button
          onClick={() => setShowFilters(p => !p)}
          className={[
            'flex items-center  gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all shrink-0',
            showFilters
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary',
          ].join(' ')}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden xs:inline">Filters</span>
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 mb-5 slide-up">
          <div className="flex flex-col xs:flex-row gap-5">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Sort By
              </p>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(opt => (
                  <button
                    key={`sort-${opt.value}`}
                    onClick={() => setSortBy(opt.value)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      sortBy === opt.value
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="xs:border-l xs:border-border xs:pl-5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Type
              </p>
              <div className="flex gap-2">
                {(['All', 'Movie', 'Series'] as const).map(type => (
                  <button
                    key={`type-${type}`}
                    onClick={() => setFilterType(type)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      filterType === type
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Status tabs ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {(Object.keys(tabConfig) as StatusTab[]).map(tab => {
          const cfg = tabConfig[tab];
          const TabIcon = cfg.icon;
          const isActive = activeTab === tab;
          return (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={[
                'shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150',
                isActive
                  ? cfg.activeBg
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary',
              ].join(' ')}
            >
              <TabIcon size={13} />
              {cfg.label}
              <span className={[
                'text-[10px] px-1.5 py-0.5 rounded-full tabular-nums',
                isActive ? 'bg-white/20' : 'bg-secondary',
              ].join(' ')}>
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {tabEntries.length === 0 ? (
        <div className="text-center py-16 sm:py-24 border border-dashed border-border rounded-2xl">
          {React.createElement(tabConfig[activeTab].icon, {
            size: 40,
            className: `mx-auto mb-3 opacity-30 ${tabConfig[activeTab].color}`,
          })}
          <p className="text-sm sm:text-base font-semibold text-foreground mb-2">
            Nothing in {tabConfig[activeTab].label}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed px-4">
            {emptyMessages[activeTab]}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {tabEntries.map(({ entry, content }) => (
            <WatchlistCard
              key={`wl-${entry.id}`}
              entry={entry}
              content={content}
              onViewDetails={() => setSelectedContent(content)}
              onRemove={() => handleRemove(content.id)}
              onMoveStatus={status => handleMoveStatus(content.id, status)}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
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

// ─── WatchlistCard ────────────────────────────────────────────────────────────

interface WatchlistCardProps {
  entry: WatchlistEntry;
  content: ContentItem;
  onViewDetails: () => void;
  onRemove: () => void;
  onMoveStatus: (status: 'watched' | 'watching' | 'watchlater') => void;
}

function WatchlistCard({ entry, content, onViewDetails, onRemove, onMoveStatus }: WatchlistCardProps) {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const moveOptions = (['watched', 'watching', 'watchlater'] as const).filter(s => s !== entry.status);

  // Close move menu on outside click
  useEffect(() => {
    if (!moveMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMoveMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moveMenuOpen]);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-muted transition-all duration-200 flex flex-col">

      {/* ── Thumbnail ── */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={onViewDetails}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onViewDetails(); }}
      >
        <div className="aspect-[16/9] bg-secondary overflow-hidden">
          <img
            src={content.poster}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={[
            'flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm',
            content.type === 'Movie'
              ? 'bg-card/80 border-border text-muted-foreground'
              : 'bg-blue-500/20 border-blue-500/40 text-blue-400',
          ].join(' ')}>
            {content.type === 'Movie' ? <Film size={9} /> : <Tv size={9} />}
            {content.type}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove from watchlist"
          className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all active:scale-95"
        >
          <X size={12} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-start justify-between gap-2 mb-auto">
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold text-foreground leading-tight truncate cursor-pointer hover:text-primary transition-colors"
              onClick={onViewDetails}
            >
              {content.title}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {content.year} · {content.genre[0]}
            </p>
          </div>

          {/* Personal rating badge */}
          {entry.personalRating && (
            <span className={[
              'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border',
              entry.personalRating === 'masterpiece' ? 'bg-green-500/10 text-green-400 border-green-500/20'  :
              entry.personalRating === 'good'        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              entry.personalRating === 'timepass'    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                       'bg-red-500/10 text-red-400 border-red-500/20',
            ].join(' ')}>
              {RATING_LABELS[entry.personalRating]}
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground/60 tabular-nums">
            {entry.dateAdded}
          </p>

          {/* Move to */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMoveMenuOpen(p => !p)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Move <ArrowUpDown size={10} />
            </button>
            {moveMenuOpen && (
              <div className="absolute bottom-full right-0 mb-1.5 bg-card border border-border rounded-xl shadow-2xl z-20 py-1 min-w-[130px] fade-in overflow-hidden">
                {moveOptions.map(status => {
                  const cfg = tabConfig[status];
                  const MoveIcon = cfg.icon;
                  return (
                    <button
                      key={`move-${status}`}
                      onClick={() => { setMoveMenuOpen(false); onMoveStatus(status); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary transition-colors ${cfg.color}`}
                    >
                      <MoveIcon size={12} />
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