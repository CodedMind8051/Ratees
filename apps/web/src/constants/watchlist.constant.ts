import { Eye , Clock , CheckCircle2 } from "lucide-react";
import type { WatchStatus } from '@/types/watchlist';


export type StatusTab = WatchStatus;
export type SortOption = 'dateAdded' | 'title' | 'year';


export const tabConfig: Record<StatusTab, { label: string; icon: typeof Eye; color: string; activeBg: string }> = {
  Watching:   { label: 'Watching',    icon: Eye,          color: 'text-blue-400',  activeBg: 'bg-blue-400/10 border-blue-400/30 text-blue-400'  },
  WatchLater: { label: 'Watch Later', icon: Clock,        color: 'text-primary',   activeBg: 'bg-primary/10 border-primary/30 text-primary'     },
  Watched:    { label: 'Watched',     icon: CheckCircle2, color: 'text-green-400', activeBg: 'bg-green-400/10 border-green-400/30 text-green-400' },
};


export const emptyMessages: Record<StatusTab, string> = {
  Watching:   'Start watching something from your Watch Later list or browse the home page to find your next binge.',
  WatchLater: 'Browse the home page and hit "Watch Later" on titles that catch your eye.',
  Watched:    'Mark titles as Watched after you finish them to build your viewing history.',
};