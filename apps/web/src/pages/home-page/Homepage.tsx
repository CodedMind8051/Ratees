import { useState } from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import HomePageContent from '@/pages/home-page/HomePageContent';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';
import type { ContentItemsType } from '@/types/content.types';
import type { WatchStatus } from '@/types/watchlist';
import type { WatchlistEntry } from '@/types/watchlist';
import { useWatchStatusActions } from '@/hooks/useWatchStatus';

export default function HomePage() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const { setStatus } = useWatchStatusActions();

  const getWatchStatus = (contentId: string) => {
    return watchlist.find(w => w.contentId === contentId)?.status ?? null;
  };

  const handleStatusChange = async (contentId: string, status: WatchStatus | null) => {
    const success = await setStatus(contentId, status);
    if (success) {
      setWatchlist(prev => {
        if (status === null) {
          return prev.filter(w => w.contentId !== contentId);
        }
        const existing = prev.find(w => w.contentId === contentId);
        if (existing) {
          return prev.map(w =>
            w.contentId === contentId ? { ...w, status } : w
          );
        }
        return [...prev, { id: `wl-${Date.now()}`, contentId, status, dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }];
      });
    }
  };

  const handleSelectMovie = (content: ContentItemsType) => {
    setSelectedContentId(content._id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HomePageContent onSelectMovie={handleSelectMovie} watchlist={watchlist} onStatusChange={handleStatusChange} />
      </main>

      {selectedContentId && (
        <MovieDetailModal
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          initialStatus={getWatchStatus(selectedContentId)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}