import { Newspaper } from 'lucide-react';
import Navbar from '@/components/ui/layout/Navbar';
import ComingSoon from '@/components/ui/common/ComingSoon';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ComingSoon
        icon={Newspaper}
        eyebrow="News"
        title="Entertainment News"
        description="Stay updated with the latest news, releases, and announcements from the world of entertainment."
      />
    </div>
  );
}
