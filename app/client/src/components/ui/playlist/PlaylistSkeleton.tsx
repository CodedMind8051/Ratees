import { AlertTriangle, ListVideo } from 'lucide-react';
import type { ReactNode } from 'react';

// ============================================
// PLAYLIST CARD SKELETON
// ============================================
// Matches the redesigned PlaylistCard: a tall cover with a
// circular privacy badge top-left, a "N TITLES" pill top-right,
// and a bottom scrim holding title + description placeholders,
// then a slim footer with an "Updated ..." line and round
// action buttons.

export function PlaylistCardSkeleton() {
  return (
    <div className="relative bg-card border border-border/60 rounded-3xl overflow-hidden animate-pulse">
      {/* Cover */}
      <div className="relative h-64 sm:h-72 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
        {/* centered watermark icon */}
        <div className="h-9 w-9 rounded-lg bg-white/10" />

        {/* Top row: privacy badge + count pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="w-7 h-7 rounded-full bg-white/15" />
          <div className="h-6 w-20 rounded-full bg-white/15" />
        </div>

        {/* Title + description overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pr-14 space-y-2">
          <div className="h-4 w-3/4 rounded bg-white/25" />
          <div className="h-3 w-1/2 rounded bg-white/15" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="h-2.5 w-24 rounded bg-muted opacity-50" />
        <div className="flex gap-1 shrink-0">
          <div className="h-8 w-8 rounded-full bg-secondary" />
          <div className="h-8 w-8 rounded-full bg-secondary" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// PLAYLIST GRID SKELETON
// ============================================

interface PlaylistGridSkeletonProps {
  count?: number;
}

export function PlaylistGridSkeleton({ count = 12 }: PlaylistGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PlaylistCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// PLAYLIST ITEMS SKELETON (row list)
// ============================================
// Same tone, mirrors each row in PlaylistDetailView:
// poster thumb, title, meta line, type badge, action button.

interface PlaylistItemsSkeletonProps {
  itemCount?: number;
}

export function PlaylistItemsSkeleton({ itemCount = 10 }: PlaylistItemsSkeletonProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
          <div className="w-14 h-20 rounded-lg shrink-0 bg-secondary" />

          <div className="flex-1 min-w-0">
            <div
              className="h-3.5 rounded bg-muted"
              style={{ width: `${55 + ((i * 13) % 30)}%` }}
            />
            <div className="h-3 w-24 rounded bg-muted mt-2 opacity-70" />
          </div>

          <div className="hidden xs:block h-[18px] w-14 rounded-full bg-secondary shrink-0" />

          <div className="h-7 w-7 rounded-lg bg-secondary shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// PLAYLIST DETAIL PAGE SKELETON (full view)
// ============================================
// Header skeleton (back button, title, description, action
// buttons) composed with the item-row skeleton list.

interface PlaylistDetailPageSkeletonProps {
  itemCount?: number;
}

export function PlaylistDetailPageSkeleton({ itemCount = 10 }: PlaylistDetailPageSkeletonProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 animate-pulse">
        <div className="h-4 w-16 rounded bg-muted" />
      </div>

      <div className="flex items-start justify-between gap-4 mb-6 animate-pulse">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-44 rounded bg-muted" />
            <div className="h-4 w-4 rounded-full bg-muted" />
          </div>
          <div className="h-3 w-64 rounded bg-muted mt-2 opacity-70" />
          <div className="h-2.5 w-20 rounded bg-muted mt-2 opacity-50" />
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="h-8 w-28 rounded-lg bg-secondary" />
          <div className="h-8 w-8 rounded-lg bg-secondary" />
          <div className="h-8 w-8 rounded-lg bg-secondary" />
        </div>
      </div>

      <PlaylistItemsSkeleton itemCount={itemCount} />
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4">
      <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
        {icon ?? <ListVideo size={24} className="text-muted-foreground" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}

// ============================================
// ERROR STATE
// ============================================

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
        Something went wrong
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
        {message || "We couldn't load this. Check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="cursor-pointer px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}