import Navbar from '@/components/ui/layout/Navbar';
// import FriendsContent from './FriendsContent';
import ComingSoon from '@/components/ui/common/ComingSoon';
import { Bell } from 'lucide-react';

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* <FriendsContent /> */}
   <ComingSoon icon={Bell} eyebrow="Coming soon" title="Your friends" description="You can find your friends here" />
      </main>
    </div>
  );
}
