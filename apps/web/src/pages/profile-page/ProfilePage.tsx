import { User } from 'lucide-react';
import Navbar from '@/components/ui/layout/Navbar';
import ComingSoon from '@/components/ui/common/ComingSoon';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ComingSoon
        icon={User}
        eyebrow="Profile"
        title="User Profile"
        description="View and manage your profile, reviews, and activity all in one place."
      />
    </div>
  );
}
