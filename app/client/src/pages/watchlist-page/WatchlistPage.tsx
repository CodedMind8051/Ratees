import Navbar from '@/components/ui/layout/Navbar';
import WatchlistContent from './WatchlistContent';

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <WatchlistContent />
      </main>
    </div>
  );
}