export type WatchStatus = 'Watched' | 'Watching' | 'WatchLater';

export const WATCH_STATUS_VALUES = ['Watched', 'Watching', 'WatchLater'] as const;

export interface WatchlistEntry {
  id: string;
  contentId: string;
  status: WatchStatus;
  dateAdded: string;
  personalRating?: string;
  progress?: number;
}
