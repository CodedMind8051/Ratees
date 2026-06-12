import  { useState, useEffect } from 'react';
import { X, BookMarked, ListVideo, Eye, CheckCircle2, Clock, Film, Tv } from 'lucide-react';
import { FriendUser, allContent } from '@/data/mockData';

interface UserProfileModalProps {
  user: FriendUser;
  onClose: () => void;
}

const statusConfig = {
  watched: { label: 'Watched', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  watching: { label: 'Watching', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  watchlater: { label: 'Watch Later', icon: Clock, color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
};

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'playlists' | 'watchlist'>('playlists');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const getContent = (contentId: string) => allContent.find(c => c.id === contentId);
  const currentlyWatchingContent = getContent(user.currentlyWatching);

  const watchlistByStatus = {
    watching: user.watchlist.filter(w => w.status === 'watching'),
    watched: user.watchlist.filter(w => w.status === 'watched'),
    watchlater: user.watchlist.filter(w => w.status === 'watchlater'),
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/20 to-amber-600/10 border-b border-border p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4">
            {user.avatarImage ? (
              <img
                src={user.avatarImage}
                alt={`${user.name} profile`}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/40 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-xl font-bold text-primary-foreground border-2 border-primary/40 shadow-lg">
                {user.avatar}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {currentlyWatchingContent && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs text-blue-400 font-medium">
                    Watching: {currentlyWatchingContent.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user.watchlist.length}</p>
              <p className="text-xs text-muted-foreground">In Watchlist</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user.playlists.length}</p>
              <p className="text-xs text-muted-foreground">Playlists</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user.watchlist.filter(w => w.status === 'watched').length}</p>
              <p className="text-xs text-muted-foreground">Watched</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'playlists' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListVideo size={15} />
            Playlists ({user.playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'watchlist' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookMarked size={15} />
            Watchlist ({user.watchlist.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'playlists' && (
            <div className="space-y-4">
              {user.playlists.length === 0 ? (
                <div className="text-center py-12">
                  <ListVideo size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No playlists yet</p>
                </div>
              ) : (
                user.playlists.map(playlist => (
                  <div key={playlist.id} className="bg-secondary/40 border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">{playlist.name}</h3>
                      <span className="text-xs text-muted-foreground">{playlist.items.length} titles</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {playlist.items.slice(0, 6).map(itemId => {
                        const content = getContent(itemId);
                        if (!content) return null;
                        return (
                          <div key={itemId} className="shrink-0 w-14">
                            <div className="w-14 h-20 rounded-lg overflow-hidden border border-border">
                              <img
                                src={content.poster}
                                alt={content.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">{content.title}</p>
                          </div>
                        );
                      })}
                      {playlist.items.length > 6 && (
                        <div className="shrink-0 w-14 h-20 rounded-lg border border-dashed border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{playlist.items.length - 6}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-5">
              {(['watching', 'watched', 'watchlater'] as const).map(status => {
                const items = watchlistByStatus[status];
                if (items.length === 0) return null;
                const cfg = statusConfig[status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={status}>
                    <div className={`flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg border w-fit ${cfg.bg}`}>
                      <StatusIcon size={13} className={cfg.color} />
                      <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label} ({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(entry => {
                        const content = getContent(entry.contentId);
                        if (!content) return null;
                        return (
                          <div key={entry.contentId} className="flex items-center gap-3 bg-secondary/30 border border-border rounded-xl p-3">
                            <div className="w-10 h-14 rounded-lg overflow-hidden border border-border shrink-0">
                              <img src={content.poster} alt={content.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{content.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">{content.year}</span>
                                <span className="text-muted-foreground">·</span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {content.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
                                  {content.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {user.watchlist.length === 0 && (
                <div className="text-center py-12">
                  <BookMarked size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No watchlist entries yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
