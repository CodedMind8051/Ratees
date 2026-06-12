import Navbar from '@/components/Navbar';
import WatchlistContent from './components/WatchlistContent';

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