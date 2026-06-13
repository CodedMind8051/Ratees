import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import { Search, BookMarked, ListVideo, Home, ChevronDown, X, Menu, Bell, Users } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { href: '/', label: 'Home', icon: Home, key: 'nav-home' },
  { href: '/friends', label: 'Friends', icon: Users, key: 'nav-friends' },
  { href: '/watchlist', label: 'Watchlist', icon: BookMarked, key: 'nav-watchlist' },
  { href: '/playlists', label: 'Playlists', icon: ListVideo, key: 'nav-playlists' },
];

interface NavbarProps {
  onSelectMovie?: (content: import('@/data/mockData').ContentItem) => void;
}

export default function Navbar({ onSelectMovie }: NavbarProps) {
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ⌘K / Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 h-14 flex items-center gap-2">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2 group">
            <AppLogo size={32} />
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              Rate<span className="text-orange-500">es</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(({ href, label, icon: Icon, key }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={key}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                    isActive
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

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Search — desktop pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden hover:cursor-pointer md:flex items-center  gap-2  px-3 h-8 rounded-lg border border-border bg-secondary/60 text-muted-foreground text-[13px] hover:border-border/80 hover:bg-secondary transition-colors duration-150"
              aria-label="Search"
            >
              <Search size={13} />
              <span>Search</span>
              <kbd className="ml-1 text-[11px] bg-background border border-border rounded px-1 py-0.5 font-sans leading-none">
                ⌘K
              </kbd>
            </button>

            {/* Search — mobile icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden hover:cursor-pointer p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-border mx-1" />

            {/* Notifications */}
            <button
              className="relative hover:cursor-pointer p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-background" />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center hover:cursor-pointer gap-2 pl-1.5 pr-2 py-1 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
                  AR
                </div>
                <span className="text-[13px] font-medium hidden sm:block">Arjun</span>
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground transition-transform duration-200 hidden sm:block ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:cursor-pointer rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-3 pb-3 pt-2 flex flex-col gap-0.5 animate-in slide-in-from-top-1 duration-150">
            {navLinks.map(({ href, label, icon: Icon, key }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={`mob-${key}`}
                  to={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </Link>
              );
            })}

            {/* Mobile search shortcut */}
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex hover:cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mt-1 border-t border-border pt-3"
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