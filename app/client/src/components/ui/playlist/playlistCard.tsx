import { ChevronRight, ListVideo, Pencil, Trash2, Lock, Globe } from 'lucide-react';
import type { Playlist } from '@/types/playlist.type';
import { format } from 'date-fns';

interface PlaylistCardProps {
  playlist: Playlist;
  coverImage: string | null;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistCard({ playlist, onOpen, onEdit, onDelete }: PlaylistCardProps) {
  // Handle both old mock data format (name, items) and new backend format (playlistName, totalTracks)
  const name = playlist.playlistName || (playlist as any).name || 'Untitled';
  const description = playlist.description || (playlist as any).description || '';
  const trackCount = playlist.totalTracks || (playlist as any).items?.length || 0;
  const updatedAt = playlist.updatedAt || (playlist as any).updatedAt || new Date().toISOString();

  // Format date
  const formattedDate = (() => {
    try {
      return format(new Date(updatedAt), 'MMM d, yyyy');
    } catch {
      return 'Recently';
    }
  })();

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-all duration-200">
      {/* Cover */}
      <div
        className="relative h-44 sm:h-48 cursor-pointer overflow-hidden bg-secondary"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onOpen();
        }}
        aria-label={`Open ${name}`}
      >
        {trackCount === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo size={36} className="text-muted-foreground/30" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
            <ListVideo size={36} className="text-primary/50" />
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Count badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-bold px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full border border-white/10 tabular-nums">
            {trackCount} {trackCount === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <div className="p-2 bg-primary rounded-full shadow-lg">
            <ChevronRight size={13} className="text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight truncate hover:text-primary transition-colors">
                {name}
              </h3>
              {playlist.isPublic ? (
                <Globe size={12} className="text-muted-foreground shrink-0" />
              ) : (
                <Lock size={12} className="text-muted-foreground shrink-0" />
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {/* Edit / delete — always visible on mobile, hover on desktop */}
          <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="cursor-pointer p-1.5 rounded-lg text-yellow-400 sm:text-muted-foreground sm:hover:text-yellow-400 sm:hover:bg-yellow-400/10 transition-colors bg-yellow-400/10 sm:bg-transparent"
              aria-label="Edit playlist"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="cursor-pointer p-1.5 rounded-lg text-red-400 sm:text-muted-foreground sm:hover:text-red-400 sm:hover:bg-red-400/10 transition-colors bg-red-400/10 sm:bg-transparent"
              aria-label="Delete playlist"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 tabular-nums">Updated {formattedDate}</p>
      </div>
    </div>
  );
}