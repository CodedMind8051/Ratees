import Navbar from '@/components/Navbar';
import PlaylistsContent from './components/PlaylistsContent';

export default function PlaylistsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <PlaylistsContent />
      </main>
    </div>
  );
}