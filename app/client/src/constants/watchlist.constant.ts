import { Eye , Clock , CheckCircle2 } from "lucide-react";


export type StatusTab = 'watching' | 'watchlater' | 'watched';
export type SortOption = 'dateAdded' | 'title' | 'year';


export const tabConfig = {
  watching:   { label: 'Watching',    icon: Eye,          color: 'text-blue-400',  activeBg: 'bg-blue-400/10 border-blue-400/30 text-blue-400'  },
  watchlater: { label: 'Watch Later', icon: Clock,        color: 'text-primary',   activeBg: 'bg-primary/10 border-primary/30 text-primary'     },
  watched:    { label: 'Watched',     icon: CheckCircle2, color: 'text-green-400', activeBg: 'bg-green-400/10 border-green-400/30 text-green-400' },
};


export const emptyMessages: Record<StatusTab, string> = {
  watching:   'Start watching something from your Watch Later list or browse the home page to find your next binge.',
  watchlater: 'Browse the home page and hit "Watch Later" on titles that catch your eye.',
  watched:    'Mark titles as Watched after you finish them to build your viewing history.',
};