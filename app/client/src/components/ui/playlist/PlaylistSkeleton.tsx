import { cn } from '@/lib/utils';

// ============================================
// BASE SKELETON COMPONENT
// ============================================

interface SkeletonProps {
  className?: string;
  delay?: number;
}

function Skeleton({ className, delay = 0 }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-muted rounded-md', className)}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// ============================================
// PLAYLIST CARD SKELETON
// ============================================

interface PlaylistCardSkeletonProps {
  delay?: number;
}

export function PlaylistCardSkeleton({ delay = 0 }: PlaylistCardSkeletonProps) {
  return (
    <div
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-all duration-200"
      role="status"
      aria-label="Loading playlist"
    >
      {/* Cover area */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-secondary">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary" />

        {/* Center icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-9 h-9 rounded-lg" delay={delay} />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Count badge */}
        <div className="absolute top-2.5 right-2.5">
          <Skeleton className="h-5 w-16 rounded-full" delay={delay + 80} />
        </div>

        {/* Hover arrow placeholder */}
        <div className="absolute bottom-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full" delay={delay + 160} />
        </div>
      </div>

      {/* Info section */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          {/* Title with privacy icon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 flex-1 max-w-[70%]" delay={delay + 60} />
              <Skeleton className="w-3 h-3 rounded-full shrink-0" delay={delay + 100} />
            </div>
            {/* Description - 1-2 lines */}
            <Skeleton className="h-3.5 w-full mt-1.5" delay={delay + 140} />
            <Skeleton className="h-3.5 w-2/3 mt-0.5" delay={delay + 180} />
          </div>

          {/* Edit/Delete buttons - always visible on mobile, hover on desktop */}
          <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Skeleton className="w-6 h-6 rounded-lg" delay={delay + 220} />
            <Skeleton className="w-6 h-6 rounded-lg" delay={delay + 240} />
          </div>
        </div>

        {/* Footer metadata */}
        <Skeleton className="h-3 w-24 mt-2" delay={delay + 260} />
      </div>
    </div>
  );
}

// ============================================
// PLAYLIST GRID SKELETON
// ============================================

interface PlaylistGridSkeletonProps {
  count?: number;
  className?: string;
}

export function PlaylistGridSkeleton({ count = 8, className }: PlaylistGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading playlists"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PlaylistCardSkeleton key={i} delay={Math.min(i * 50, 400)} />
      ))}
    </div>
  );
}

// ============================================
// PLAYLIST ITEM SKELETON
// ============================================

interface PlaylistItemSkeletonProps {
  delay?: number;
  /** Variation index to create natural-looking text width differences */
  variant?: number;
}

export function PlaylistItemSkeleton({ delay = 0, variant = 0 }: PlaylistItemSkeletonProps) {
  // Different widths based on variant for natural look
  const titleWidths = ['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2', 'w-5/6'];
  const yearWidths = ['w-16', 'w-20', 'w-14', 'w-24', 'w-18'];

  const titleWidth = titleWidths[variant % titleWidths.length];
  const yearWidth = yearWidths[variant % yearWidths.length];

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
      role="status"
      aria-label="Loading item"
    >
      {/* Poster skeleton - exact dimensions w-14 h-20 */}
      <Skeleton className="w-14 h-20 rounded-lg shrink-0" delay={delay} />

      {/* Content info */}
      <div className="flex-1 min-w-0">
        <Skeleton className={cn('h-4', titleWidth)} delay={delay + 60} />
        <div className="flex items-center gap-1.5 mt-0.5">
          <Skeleton className={cn('h-3', yearWidth)} delay={delay + 100} />
          <Skeleton className="h-3 w-12" delay={delay + 120} />
        </div>
      </div>

      {/* Type badge (Movie/TV) */}
      <div className="flex items-center gap-1 shrink-0">
        <Skeleton className="w-3 h-3 rounded-sm" delay={delay + 80} />
        <Skeleton className="h-4 w-12 rounded-full" delay={delay + 140} />
      </div>

      {/* Delete button placeholder - same styling as real delete button */}
      <Skeleton className="w-6 h-6 rounded-lg shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" delay={delay + 180} />
    </div>
  );
}

// ============================================
// PLAYLIST ITEMS SKELETON (LIST)
// ============================================

interface PlaylistItemsSkeletonProps {
  count?: number;
  className?: string;
}

export function PlaylistItemsSkeleton({ count = 10, className }: PlaylistItemsSkeletonProps) {
  return (
    <div className={cn('space-y-1', className)} role="status" aria-label="Loading playlist items">
      {Array.from({ length: count }).map((_, i) => (
        <PlaylistItemSkeleton key={i} delay={Math.min(i * 40, 320)} variant={i} />
      ))}
    </div>
  );
}

// ============================================
// PLAYLIST DETAIL HEADER SKELETON
// ============================================

export function PlaylistDetailHeaderSkeleton() {
  return (
    <div role="status" aria-label="Loading playlist details">
      {/* Back button row */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header info - matches real layout */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 space-y-2">
          {/* Title row with privacy icon */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-48" />
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
          {/* Description */}
          <Skeleton className="h-4 w-56 sm:w-72" delay={60} />
          <Skeleton className="h-3.5 w-40 sm:w-48" delay={100} />
          {/* Item count */}
          <Skeleton className="h-3 w-24" delay={140} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-8 w-24 sm:w-28 rounded-lg" delay={80} />
          <Skeleton className="h-8 w-8 rounded-lg" delay={100} />
          <Skeleton className="h-8 w-8 rounded-lg" delay={120} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// FULL PLAYLIST DETAIL PAGE SKELETON
// ============================================

interface PlaylistDetailPageSkeletonProps {
  itemCount?: number;
}

export function PlaylistDetailPageSkeleton({ itemCount = 10 }: PlaylistDetailPageSkeletonProps) {
  return (
    <div role="status" aria-label="Loading playlist detail">
      <PlaylistDetailHeaderSkeleton />
      <PlaylistItemsSkeleton count={itemCount} />
    </div>
  );
}

// ============================================
// PLAYLISTS PAGE HEADER SKELETON
// ============================================

export function PlaylistsHeaderSkeleton() {
  return (
    <div
      className="flex items-start justify-between gap-4 mb-6 sm:mb-8"
      role="status"
      aria-label="Loading playlists header"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-6 sm:h-7 w-32 sm:w-40" />
        </div>
        <Skeleton className="h-3.5 w-36 mt-2.5" delay={60} />
      </div>
      <Skeleton className="h-9 sm:h-10 w-28 sm:w-32 rounded-xl shrink-0" delay={90} />
    </div>
  );
}

// ============================================
// FULL PLAYLISTS PAGE SKELETON
// ============================================

interface PlaylistsPageSkeletonProps {
  count?: number;
}

export function PlaylistsPageSkeleton({ count = 8 }: PlaylistsPageSkeletonProps) {
  return (
    <div>
      <PlaylistsHeaderSkeleton />
      <PlaylistGridSkeleton count={count} />
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENTS
// ============================================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16 sm:py-24', className)}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/50 mb-4 ring-1 ring-border/50">
        {icon}
      </div>
      <p className="text-sm sm:text-base font-semibold text-foreground mb-2">{title}</p>
      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed px-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// ============================================
// ERROR STATE COMPONENT
// ============================================

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('text-center py-16 sm:py-24', className)}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 mb-4 ring-1 ring-red-500/10">
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-semibold text-foreground mb-2">{title}</p>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95 cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ============================================
// LOADING BUTTON COMPONENT
// ============================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        'cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95',
        loading
          ? 'bg-primary/50 text-primary-foreground cursor-wait'
          : 'bg-primary text-primary-foreground hover:bg-amber-400',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      )}
      {loading ? loadingText || 'Loading...' : children}
    </button>
  );
}