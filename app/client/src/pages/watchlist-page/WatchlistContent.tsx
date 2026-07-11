import React, { useState, useMemo } from 'react';
import {
  BookMarked, SlidersHorizontal
} from 'lucide-react';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';
import type { WatchStatus } from '@/types/watchlist';
import { toast } from 'sonner';
import { StatusTab, SortOption, tabConfig, emptyMessages } from '@/constants/watchlist.constant';
import { WatchlistCard } from '@/components/ui/watchlist/watchlistContaintCard';
import { useWatchStatusContentList, useWatchStatusActions } from '@/hooks/useWatchStatus';

interface WatchlistContentItem {
  _id: string;
  contentId: string;
  title: string;
  genre: string[];
  Content_Type: string;
  release_date: string;
  poster: string;
  createdAt: string;
  isOwner: boolean;
}

export default function WatchlistContent() {
  const [activeTab, setActiveTab] = useState<StatusTab>('Watching');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [filterType, setFilterType] = useState<'All' | 'movie' | 'Series'>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch watch status content list based on active tab
  const { contentList, loading, refetch } = useWatchStatusContentList(activeTab);

  // Actions for status changes
  const { setStatus } = useWatchStatusActions();

  // Current status is derived from the active tab

  // Memoize and filter the content list
  const tabEntries = useMemo(() => {
    const filtered = filterType === 'All'
      ? [...contentList]
      : contentList.filter((item: WatchlistContentItem) =>
          item.Content_Type === (filterType === 'movie' ? 'movie' : 'tv')
        );

    return filtered.sort((a: WatchlistContentItem, b: WatchlistContentItem) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') {
        const yearA = new Date(a.release_date)?.getFullYear();
        const yearB = new Date(b.release_date)?.getFullYear();
        return yearB - yearA;
      }
      return 0;
    });
  }, [contentList, sortBy, filterType]);

  const tabCounts: Record<string, number> = { watching: 0, watchlater: 0, watched: 0 };
  tabCounts[activeTab] = contentList.length;

  // Handle status change from modal
  const handleStatusChange = async (contentId: string, status: WatchStatus | null) => {
    await setStatus(contentId, status, currentStatus);
  };

  // Handle remove from watchlist
  const handleRemove = async (contentId: string) => {
    await setStatus(contentId, null, currentStatus);
    toast.success('Removed from watchlist');
  };

  // Handle move status
  const handleMoveStatus = async (contentId: string, newStatus: WatchStatus) => {
    await setStatus(contentId, newStatus, currentStatus);
    toast.success(`Moved to ${tabConfig[newStatus].label}`);
  };

  // Handle viewing details
  const handleViewDetails = (contentId: string) => {
    setSelectedContentId(contentId);
    // Fetch the full details via the modal
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'title', label: 'Title A–Z' },
    { value: 'year', label: 'Year' },
  ];

  const currentStatus = activeTab;

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
            {tabCounts[activeTab]} titles tracked
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
                {(['All', 'movie', 'Series'] as const).map(type => (
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
      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-[16/9] bg-secondary animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
                <div className="h-3 bg-secondary animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tabEntries.length === 0 ? (
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
          {(tabEntries as WatchlistContentItem[]).map((item) => (
            <WatchlistCard
              key={`wl-${item._id}`}
              contentId={item._id}
              title={item.title}
              poster={item.poster}
              genre={item.genre}
              contentType={item.Content_Type}
              releaseDate={item.release_date}
              dateAdded={item.createdAt}
              isOwner={item.isOwner}
              status={activeTab}
              onViewDetails={() => handleViewDetails(item.contentId)}
              onRemove={() => handleRemove(item.contentId)}
              onMoveStatus={(status) => handleMoveStatus(item.contentId, status)}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {selectedContentId && (
        <MovieDetailModal
          contentId={selectedContentId}
          onClose={() => {
            setSelectedContentId(null);
            setSelectedContentId(null);
          }}
          initialStatus={currentStatus}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}