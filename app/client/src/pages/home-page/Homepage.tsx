import { useState } from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import HomePageContent from '@/pages/home-page/HomePageContent';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';
import { mockWatchlist, WatchlistEntry } from '@/data/mockData';
import type { ContentFullDetailType } from '@/types/content.types';
import { useWatchStatusActions } from '@/hooks/useWatchStatus';

export default function HomePage() {
  const [selectedContent, setSelectedContent] = useState<ContentFullDetailType | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(mockWatchlist);
   const { setStatus } = useWatchStatusActions();

  const getWatchStatus = (contentId: string) => {
    return watchlist.find(w => w.contentId === contentId)?.status ?? null;
  };

  const handleStatusChange = (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => {
    // setWatchlist(prev => {
    //   const existing = prev.findIndex(w => w.contentId === contentId);
    //   if (status === null) return prev.filter(w => w.contentId !== contentId);
    //   if (existing >= 0) return prev.map(w => w.contentId === contentId ? { ...w, status } : w);
    //   return [...prev, { id: `wl-new-${contentId}`, contentId, status, dateAdded: 'Jun 12, 2026' }];
    // });

    setStatus(contentId,status,null)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HomePageContent onSelectMovie={setSelectedContent} watchlist={watchlist} onStatusChange={handleStatusChange} />
      </main>

      {selectedContent && (
        <MovieDetailModal
          contentId={selectedContent?._id}
          onClose={() => setSelectedContent(null)}
          initialStatus={getWatchStatus(selectedContent?._id)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}