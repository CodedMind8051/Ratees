import  { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomePageContent from '@/pages/home-page/HomePageContent';
import MovieDetailModal from '@/components/MovieDetailModal';
import { mockWatchlist, WatchlistEntry } from '@/data/mockData';
import { ContentItemTypeHomePage, ContentFullDetail } from '@/types/Content.types';

export default function HomePage() {
  const [selectedContent, setSelectedContent] = useState<ContentFullDetail | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(mockWatchlist);

  const getWatchStatus = (contentId: string) => {
    return watchlist.find(w => w.contentId === contentId)?.status ?? null;
  };

  const handleStatusChange = (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => {
    setWatchlist(prev => {
      const existing = prev.findIndex(w => w.contentId === contentId);
      if (status === null) return prev.filter(w => w.contentId !== contentId);
      if (existing >= 0) return prev.map(w => w.contentId === contentId ? { ...w, status } : w);
      return [...prev, { id: `wl-new-${contentId}`, contentId, status, dateAdded: 'Jun 12, 2026' }];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSelectMovie={setSelectedContent} />
      <main className="pt-16">
        <HomePageContent onSelectMovie={setSelectedContent} watchlist={watchlist} onStatusChange={handleStatusChange} />
      </main>

      {selectedContent && (
        <MovieDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          initialStatus={getWatchStatus(selectedContent?._id)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}