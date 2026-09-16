import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import AppLogo from '@/components/ui/shadcn/AppLogo';

export default function AuthNavbar() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <AppLogo size={30} />
          <span className="font-semibold text-sm tracking-tight">
            Rate<span className="text-orange-500">es</span>
          </span>
        </Link>

        <Link
          to={isLogin ? '/signup' : '/login'}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {isLogin ? <UserPlus size={14} /> : <LogIn size={14} />}
          {isLogin ? 'Sign up' : 'Sign in'}
        </Link>
      </div>
    </nav>
  );
}
