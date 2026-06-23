import Navbar from '@/components/ui/layout/Navbar';
import PlaylistsContent from './PlaylistsContent';

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