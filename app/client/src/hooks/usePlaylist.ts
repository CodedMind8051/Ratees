import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { toast } from 'sonner';
import type {
  Playlist,
  PlaylistItem,
  CreatePlaylistInput,
  UpdatePlaylistInput,
  DeletePlaylistInput,
  CreatePlaylistItemInput,
  DeletePlaylistItemInput,
} from '@/types/playlist.type';

// Queries
import { GET_PLAYLISTS, GET_PLAYLIST_ITEMS } from '@/lib/graphql/query/playlist.query';

// Mutations
import {
  CREATE_PLAYLIST,
  UPDATE_PLAYLIST,
  DELETE_PLAYLIST,
  CREATE_PLAYLIST_ITEM,
  DELETE_PLAYLIST_ITEM,
} from '@/lib/graphql/mutation/playlist.mutation';

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

interface GraphQLError {
  message: string;
  code?: string;
}

function handleGraphQLError(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as GraphQLError;
    if (err.message) {
      // Map user-friendly messages
      const errorMessages: Record<string, string> = {
        PLAYLIST_ALREADY_EXISTS: 'A playlist with this name already exists',
        PLAYLIST_NOT_FOUND: 'Playlist not found',
        PLAYLIST_NOT_FOUND_OR_NO_PERMISSION: "You don't have permission to view the items",
        PLAYLIST_ITEM_ALREADY_EXISTS: 'This content is already in the playlist',
        PLAYLIST_ITEM_NOT_FOUND: 'Item not found in playlist',
        UNAUTHENTICATED: 'Please sign in to continue',
        PAGE_NOT_FOUND: 'Page not found',
      };
      return errorMessages[err.code || ''] || err.message;
    }
  }
  return 'Something went wrong. Please try again.';
}

function handleMutationError(error: unknown, action: string): boolean {
  const message = handleGraphQLError(error);
  toast.error(message);
  console.error(`Playlist ${action} error:`, error);
  return false;
}

// ============================================
// USE PLAYLISTS HOOK (Simple)
// ============================================

interface UsePlaylistsOptions {
  userID: string;
  page?: number;
  enabled?: boolean;
}

interface UsePlaylistsResult {
  playlists: Playlist[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePlaylists({ userID, page = 1, enabled = true }: UsePlaylistsOptions): UsePlaylistsResult {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLISTS, {
    variables: { page, userID },
    skip: !enabled || !userID,
  });

  const playlists = (data as any)?.getPlaylists?.playlists || [];

  return {
    playlists: playlists as Playlist[],
    loading,
    error: error as Error | null,
    refetch,
  };
}

// ============================================
// USE PLAYLIST ITEMS HOOK (Simple)
// ============================================

interface UsePlaylistItemsOptions {
  playlistId: string;
  page?: number;
  enabled?: boolean;
}

interface UsePlaylistItemsResult {
  items: PlaylistItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePlaylistItems({
  playlistId,
  page = 1,
  enabled = true,
}: UsePlaylistItemsOptions): UsePlaylistItemsResult {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLIST_ITEMS, {
    variables: { playlistId, page },
    skip: !enabled || !playlistId,
  });

  const items = (data as any)?.getPlaylistItems?.items || [];

  return {
    items: items as PlaylistItem[],
    loading,
    error: error as Error | null,
    refetch,
  };
}

// ============================================
// USE INFINITE PLAYLISTS HOOK
// ============================================

interface UseInfinitePlaylistsOptions {
  userID: string;
  pageSize?: number;
  enabled?: boolean;
}

interface UseInfinitePlaylistsResult {
  playlists: Playlist[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => void;
}

export function useInfinitePlaylists({
  userID,
  pageSize = 20,
  enabled = true,
}: UseInfinitePlaylistsOptions): UseInfinitePlaylistsResult {
  const client = useApolloClient();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  const { data, loading, error, refetch } = useQuery(GET_PLAYLISTS, {
    variables: { page: 1, userID },
    skip: !enabled || !userID,
    notifyOnNetworkStatusChange: true,
  });

  // Update playlists when data changes
  useEffect(() => {
    const playlistsData = (data as any)?.getPlaylists?.playlists;
    const pagination = (data as any)?.getPlaylists;
    if (playlistsData) {
      setPlaylists(playlistsData as Playlist[]);
      setHasMore(pagination?.currentPage < pagination?.totalPages);
    }
  }, [data, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const { data: moreData } = await client.query({
        query: GET_PLAYLISTS,
        variables: { page: nextPage, userID },
        fetchPolicy: 'network-only',
      });

      const newPlaylists = (moreData as any)?.getPlaylists?.playlists || [];
      const pagination = (moreData as any)?.getPlaylists;

      if (newPlaylists.length > 0) {
        setPlaylists(prev => [...prev, ...newPlaylists]);
        setPage(nextPage);
        setHasMore(pagination?.currentPage < pagination?.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more playlists:', err);
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [loadingMore, hasMore, page, client, userID, pageSize]);

  return {
    playlists,
    loading,
    loadingMore,
    error: error as Error | null,
    hasMore,
    loadMore,
    refetch,
  };
}

// ============================================
// USE INFINITE PLAYLIST ITEMS HOOK
// ============================================

interface UseInfinitePlaylistItemsOptions {
  playlistId: string;
  pageSize?: number;
  enabled?: boolean;
}

interface UseInfinitePlaylistItemsResult {
  items: PlaylistItem[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => void;
}

export function useInfinitePlaylistItems({
  playlistId,
  pageSize = 40,
  enabled = true,
}: UseInfinitePlaylistItemsOptions): UseInfinitePlaylistItemsResult {
  const client = useApolloClient();
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  const { data, loading, error, refetch } = useQuery(GET_PLAYLIST_ITEMS, {
    variables: { playlistId, page: 1 },
    skip: !enabled || !playlistId,
    notifyOnNetworkStatusChange: true,
  });

  // Update items when data changes
  useEffect(() => {
    const itemsData = (data as any)?.getPlaylistItems?.items;
    const pagination = (data as any)?.getPlaylistItems;
    if (itemsData) {
      setItems(itemsData as PlaylistItem[]);
      setHasMore(pagination?.currentPage < pagination?.totalPages);
    }
  }, [data, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loadingRef.current || !playlistId) return;

    loadingRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const { data: moreData } = await client.query({
        query: GET_PLAYLIST_ITEMS,
        variables: { playlistId, page: nextPage },
        fetchPolicy: 'network-only',
      });

      const newItems = (moreData as any)?.getPlaylistItems?.items || [];
      const pagination = (moreData as any)?.getPlaylistItems;

      if (newItems.length > 0) {
        setItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(pagination?.currentPage < pagination?.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more playlist items:', err);
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [loadingMore, hasMore, page, client, playlistId, pageSize]);

  return {
    items,
    loading,
    loadingMore,
    error: error as Error | null,
    hasMore,
    loadMore,
    refetch,
  };
}

// ============================================
// USE CREATE PLAYLIST HOOK
// ============================================

interface UseCreatePlaylistResult {
  createPlaylist: (input: CreatePlaylistInput) => Promise<boolean>;
  loading: boolean;
}

export function useCreatePlaylist(): UseCreatePlaylistResult {
  const [mutation, { loading }] = useMutation(CREATE_PLAYLIST);

  const createPlaylist = useCallback(
    async (input: CreatePlaylistInput): Promise<boolean> => {
      try {
        const { data } = await mutation({
          variables: input,
        });

        if ((data as any)?.createPlaylist) {
          toast.success(`Playlist "${input.playlistName}" created`);
          return true;
        }

        toast.error('Failed to create playlist');
        return false;
      } catch (error) {
        return handleMutationError(error, 'create');
      }
    },
    [mutation]
  );

  return { createPlaylist, loading };
}

// ============================================
// USE UPDATE PLAYLIST HOOK
// ============================================

interface UseUpdatePlaylistResult {
  updatePlaylist: (input: UpdatePlaylistInput) => Promise<boolean>;
  loading: boolean;
}

export function useUpdatePlaylist(): UseUpdatePlaylistResult {
  const [mutation, { loading }] = useMutation(UPDATE_PLAYLIST);

  const updatePlaylist = useCallback(
    async (input: UpdatePlaylistInput): Promise<boolean> => {
      try {
        const { data } = await mutation({
          variables: input,
        });

        if ((data as any)?.updatePlaylist) {
          toast.success('Playlist updated');
          return true;
        }

        toast.error('Failed to update playlist');
        return false;
      } catch (error) {
        return handleMutationError(error, 'update');
      }
    },
    [mutation]
  );

  return { updatePlaylist, loading };
}

// ============================================
// USE DELETE PLAYLIST HOOK
// ============================================

interface UseDeletePlaylistResult {
  deletePlaylist: (input: DeletePlaylistInput) => Promise<boolean>;
  loading: boolean;
}

export function useDeletePlaylist(): UseDeletePlaylistResult {
  const [mutation, { loading }] = useMutation(DELETE_PLAYLIST);

  const deletePlaylist = useCallback(
    async (input: DeletePlaylistInput): Promise<boolean> => {
      try {
        const { data } = await mutation({
          variables: input,
        });

        if ((data as any)?.deletePlaylist) {
          toast.success('Playlist deleted');
          return true;
        }

        toast.error('Failed to delete playlist');
        return false;
      } catch (error) {
        return handleMutationError(error, 'delete');
      }
    },
    [mutation]
  );

  return { deletePlaylist, loading };
}

// ============================================
// USE ADD TO PLAYLIST HOOK
// ============================================

interface UseAddToPlaylistResult {
  addToPlaylist: (input: CreatePlaylistItemInput) => Promise<boolean>;
  loading: boolean;
}

export function useAddToPlaylist(): UseAddToPlaylistResult {
  const [mutation, { loading }] = useMutation(CREATE_PLAYLIST_ITEM);

  const addToPlaylist = useCallback(
    async (input: CreatePlaylistItemInput): Promise<boolean> => {
      try {
        const { data } = await mutation({
          variables: input,
        });

        if ((data as any)?.createPlaylistItem) {
          toast.success('Added to playlist');
          return true;
        }

        toast.error('Failed to add to playlist');
        return false;
      } catch (error) {
        return handleMutationError(error, 'add item');
      }
    },
    [mutation]
  );

  return { addToPlaylist, loading };
}

// ============================================
// USE REMOVE FROM PLAYLIST HOOK
// ============================================

interface UseRemoveFromPlaylistResult {
  removeFromPlaylist: (input: DeletePlaylistItemInput) => Promise<boolean>;
  loading: boolean;
}

export function useRemoveFromPlaylist(): UseRemoveFromPlaylistResult {
  const [mutation, { loading }] = useMutation(DELETE_PLAYLIST_ITEM);

  const removeFromPlaylist = useCallback(
    async (input: DeletePlaylistItemInput): Promise<boolean> => {
      try {
        const { data } = await mutation({
          variables: input,
        });

        if ((data as any)?.deletePlaylistItem) {
          toast.success('Removed from playlist');
          return true;
        }

        toast.error('Failed to remove from playlist');
        return false;
      } catch (error) {
        return handleMutationError(error, 'remove item');
      }
    },
    [mutation]
  );

  return { removeFromPlaylist, loading };
}