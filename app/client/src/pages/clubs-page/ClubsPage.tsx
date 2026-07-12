import { MessageCircle } from 'lucide-react';
import Navbar from '@/components/ui/layout/Navbar';
import ComingSoon from '@/components/ui/common/ComingSoon';

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ComingSoon
        icon={MessageCircle}
        eyebrow="Clubs"
        title="Clubs & Communities"
        description="Join clubs, discuss your favorite movies and shows, and connect with like-minded fans."
      />
    </div>
  );
}
