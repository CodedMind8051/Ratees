import React, { useState } from 'react';
import { Search, Users, X } from 'lucide-react';
import { mockFriends, allContent, FriendUser } from '@/data/mockData';
import UserProfileModal from '@/pages/friends-page/UserProfileModal';

export default function FriendsContent() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<FriendUser | null>(null);

  const handleSearch = () => {
    setQuery(searchInput.trim().toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredFriends = query
    ? mockFriends.filter(
        f =>
          f.name.toLowerCase().includes(query) ||
          f.username.toLowerCase().includes(query)
      )
    : mockFriends;

  const getContent = (contentId: string) => allContent.find(c => c.id === contentId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Friends</h1>
        <p className="text-sm text-muted-foreground">See what your friends are watching right now</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search friends by name or username..."
            className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setQuery(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all"
        >
          Search
        </button>
      </div>

      {/* Friends list */}
      {filteredFriends.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No friends found matching "{query}"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFriends.map(friend => {
            const currentContent = getContent(friend.currentlyWatching);
            return (
              <button
                key={friend.id}
                onClick={() => setSelectedUser(friend)}
                className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-150 text-left group"
              >
                {/* Avatar */}
                {friend.avatarImage ? (
                  <img
                    src={friend.avatarImage}
                    alt={`${friend.name} profile picture`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-border group-hover:border-primary/40 transition-colors shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-lg font-bold text-primary-foreground border-2 border-border shrink-0">
                    {friend.avatar}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{friend.name}</p>
                    <span className="text-xs text-muted-foreground">@{friend.username}</span>
                  </div>

                  {currentContent && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                      <span className="text-xs text-blue-400 font-medium truncate">
                        Watching: {currentContent.title}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground">{friend.watchlist.length} in watchlist</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-xs text-muted-foreground">{friend.playlists.length} playlists</span>
                  </div>
                </div>

                {/* Poster preview */}
                {currentContent && (
                  <div className="shrink-0 w-10 h-14 rounded-lg overflow-hidden border border-border opacity-70 group-hover:opacity-100 transition-opacity">
                    <img
                      src={currentContent.poster}
                      alt={`${currentContent.title} poster`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
