import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { useAuth } from './useAuth';
import type { WatchStatus } from '@/types/watchlist';
import {
  GET_WATCH_STATUS,
  GET_WATCH_STATUS_CONTENT_LIST,
  SUBMIT_WATCH_STATUS,
  UPDATE_WATCH_STATUS,
  DELETE_WATCH_STATUS,
} from '@/lib/graphql/query/watchStatus.query';
import { toast } from 'sonner';

// Map frontend status to backend enum
export const statusToBackend: Record<WatchStatus, string> = {
  Watching: 'Watching',
  WatchLater: 'WatchLater',
  Watched: 'Watched',
};

// Map backend enum to frontend status
export const backendToStatus: Record<string, WatchStatus> = {
  Watching: 'Watching',
  WatchLater: 'WatchLater',
  Watched: 'Watched',
};

// Types for API responses
interface WatchStatusResponse {
  getWatchStatusOfContent: {
    _id: string;
    watchStatus: string;
  } | null;
}

interface WatchStatusContentListItem {
  _id: string;
  contentId: string;
  title: string;
  genre: string[];
  Content_Type: string;
  release_date: string;
  poster: string;
  createdAt: string;
  isOwner: boolean;
}

interface WatchStatusContentListResponse {
  getContentListInWatchStatus: WatchStatusContentListItem[];
}

// Get current user's watchlist for a specific status
export function useWatchStatusContentList(watchStatus: WatchStatus) {
  const { user } = useAuth();
  const backendStatus = statusToBackend[watchStatus];

  const { data, loading, error, refetch } = useQuery<WatchStatusContentListResponse>(GET_WATCH_STATUS_CONTENT_LIST, {
    variables: {
      userId: user?.id,
      watchStatus: backendStatus,
      page: 1,
    },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    contentList: data?.getContentListInWatchStatus || [],
    loading,
    error,
    refetch,
  };
}

// Get watch status for a specific content
export function useWatchStatus(contentId: string) {
  const { data, loading, error, refetch } = useQuery<WatchStatusResponse>(GET_WATCH_STATUS, {
    variables: { contentId },
    fetchPolicy: 'cache-and-network',
  });

  const watchStatus = data?.getWatchStatusOfContent?.watchStatus;
  const frontendStatus = watchStatus ? backendToStatus[watchStatus] : null;

  return {
    watchStatus: frontendStatus,
    loading,
    error,
    refetch,
  };
}

// Mutation hook for submitting/updating watch status
export function useSubmitWatchStatus() {
  const client = useApolloClient();
  const [submitWatchStatus, { loading }] = useMutation(SUBMIT_WATCH_STATUS, {
    context: {
      credentials: 'include',
    },
  });

  const submitStatus = async (contentId: string, status: WatchStatus) => {
    try {
      const backendStatus = statusToBackend[status];
      await submitWatchStatus({
        variables: {
          contentId,
          watchStatus: backendStatus,
        },
      });

      await client.refetchQueries({ include: ['GetWatchStatusContentList'] });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update watch status';
      toast.error(message);
      return false;
    }
  };

  return { submitStatus, loading };
}

// Mutation hook for updating watch status
export function useUpdateWatchStatus() {
  const client = useApolloClient();
  const [updateWatchStatus, { loading }] = useMutation(UPDATE_WATCH_STATUS, {
    context: {
      credentials: 'include',
    },
  });

  const updateStatus = async (contentId: string, status: WatchStatus) => {
    try {
      const backendStatus = statusToBackend[status];
      await updateWatchStatus({
        variables: {
          contentId,
          watchStatus: backendStatus,
        },
      });

      await client.refetchQueries({ include: ['GetWatchStatusContentList'] });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update watch status';
      toast.error(message);
      return false;
    }
  };

  return { updateStatus, loading };
}

// Mutation hook for deleting watch status
export function useDeleteWatchStatus() {
  const client = useApolloClient();
  const [deleteWatchStatus, { loading }] = useMutation(DELETE_WATCH_STATUS, {
    context: {
      credentials: 'include',
    },
  });

  const deleteStatus = async (contentId: string) => {
    try {
      await deleteWatchStatus({
        variables: { contentId },
      });

      await client.refetchQueries({ include: ['GetWatchStatusContentList'] });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove from watchlist';
      toast.error(message);
      return false;
    }
  };

  return { deleteStatus, loading };
}

// Combined hook for status changes (handles both create and update)
export function useWatchStatusActions() {
  const { submitStatus, loading: submitLoading } = useSubmitWatchStatus();
  const { updateStatus, loading: updateLoading } = useUpdateWatchStatus();
  const { deleteStatus, loading: deleteLoading } = useDeleteWatchStatus();

  const setStatus = async (
    contentId: string,
    newStatus: WatchStatus | null,
    currentStatus: WatchStatus | null
  ) => {
    console.log('setStatus called:', { contentId, newStatus, currentStatus });

    if (newStatus === null) {
      // Remove from watchlist
      return deleteStatus(contentId);
    } else if (currentStatus === null) {
      // Create new status
      return submitStatus(contentId, newStatus);
    } else {
      // Update existing status
      return updateStatus(contentId, newStatus);
    }
  };

  return {
    setStatus,
    loading: submitLoading || updateLoading || deleteLoading,
  };
}