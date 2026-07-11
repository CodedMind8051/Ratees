import { useState } from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import HomePageContent from '@/pages/home-page/HomePageContent';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';
import { mockWatchlist } from '@/data/mockData';
import type { ContentItemsType } from '@/types/content.types';
import type { WatchStatus } from '@/types/watchlist';
import { useWatchStatusActions } from '@/hooks/useWatchStatus';

export default function HomePage() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [watchlist] = useState(mockWatchlist);
  const { setStatus } = useWatchStatusActions();

  const getWatchStatus = (contentId: string) => {
    return watchlist.find(w => w.contentId === contentId)?.status ?? null;
  };

  const handleStatusChange = async (contentId: string, status: WatchStatus | null) => {
    await setStatus(contentId, status, null);
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