import Navbar from '@/components/ui/layout/Navbar';
import FriendsContent from './FriendsContent';

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <FriendsContent />
      </main>
    </div>
  );
}
