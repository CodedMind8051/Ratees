import Navbar from '@/components/Navbar';
import FriendsContent from './components/FriendsContent';

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
