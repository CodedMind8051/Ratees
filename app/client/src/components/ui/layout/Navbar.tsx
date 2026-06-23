import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import { Search, BookMarked, ListVideo, Home, ChevronDown, X, Menu, Bell, Users } from 'lucide-react';
import ProfileDropdown from '../../ProfileDropdown';
import SearchOverlay from '../common/SearchOverlay';
import { ContentItemsType } from '@/types/content.types';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/friends', label: 'Friends', icon: Users },
  { href: '/watchlist', label: 'Watchlist', icon: BookMarked },
  { href: '/playlists', label: 'Playlists', icon: ListVideo },
] as const;

interface NavbarProps {
  onSelectMovie?: (content: ContentItemsType) => void;
}

export default function Navbar({ onSelectMovie }: NavbarProps) {
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        closeProfile();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [closeProfile]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        closeProfile();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeProfile]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 h-14 flex items-center gap-2">

          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
            <AppLogo size={32} />
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              Rate<span className="text-orange-500">es</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 ml-auto">

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 h-8 rounded-lg border border-border bg-secondary/60 text-muted-foreground text-[13px] hover:border-border/80 hover:bg-secondary transition-colors duration-150 cursor-pointer"
              aria-label="Open search"
            >
              <Search size={13} />
              <span>Search</span>
              <kbd className="ml-1 text-[11px] bg-background border border-border rounded px-1 py-0.5 font-sans leading-none">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search size={17} />
            </button>

            <div className="hidden md:block w-px h-5 bg-border mx-1" />

            <button
              type="button"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-background" aria-hidden="true" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(prev => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
                  AR
                </div>
                <span className="text-[13px] font-medium hidden sm:block">Arjun</span>
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground transition-transform duration-200 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {profileOpen && <ProfileDropdown onClose={closeProfile} />}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-3 pb-3 pt-2 flex flex-col gap-0.5 animate-in slide-in-from-top-1 duration-150"
          >
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mt-1 border-t border-border pt-3 cursor-pointer"
            >
              <Search size={17} strokeWidth={1.8} />
              Search movies, shows, anime…
            </button>
          </div>
        )}
      </nav>

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} onSelectMovie={onSelectMovie} />
      )}
    </>
  );
}