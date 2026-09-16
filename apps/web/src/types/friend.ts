import type { WatchStatus } from './watchlist';

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarImage?: string;
  currentlyWatching: string;
  watchlist: { contentId: string; status: WatchStatus }[];
  playlists: { id: string; name: string; items: string[] }[];
}
