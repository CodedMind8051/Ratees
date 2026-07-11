// ============================================
// PLAYLIST TYPES - Matches Backend GraphQL Schema
// ============================================

export interface Playlist {
  _id: string;
  playlistName: string;
  description: string | null;
  userId: string;
  isPublic: boolean;
  totalTracks: number;
  isOwner?: boolean; // Added by backend aggregation
  coverImage?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistItem {
  _id: string;
  contentId: string;
  title: string;
  genre: string[];
  Content_Type: string;
  runtime: string;
  release_date: string;
  poster: string;
  updatedAt?: string;
}

// ============================================
// API INPUT TYPES
// ============================================

export interface GetPlaylistsInput {
  page?: number;
  userID: string;
}

export interface GetPlaylistItemsInput {
  playlistId: string;
  page?: number;
}

export interface CreatePlaylistInput {
  playlistName: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdatePlaylistInput {
  playlistId: string;
  playlistName?: string;
  description?: string;
  isPublic?: boolean;
}

export interface DeletePlaylistInput {
  playlistId: string;
}

export interface CreatePlaylistItemInput {
  contentId: string;
  playlistId: string;
}

export interface DeletePlaylistItemInput {
  contentId: string;
  playlistId: string;
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PlaylistsResponse {
  getPlaylists: Playlist[];
}

export interface PlaylistItemsResponse {
  getPlaylistItems: PlaylistItem[];
}

export interface PaginatedPlaylists {
  playlists: Playlist[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface PaginatedPlaylistItems {
  items: PlaylistItem[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}