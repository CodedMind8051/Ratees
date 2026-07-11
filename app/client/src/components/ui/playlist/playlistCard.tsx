import { ChevronRight, ListVideo, Pencil, Trash2, Lock, Globe } from 'lucide-react';
import type { Playlist } from '@/types/playlist.type';
import { format } from 'date-fns';
import { getPosterUrl } from '@/utils/content.utils';

interface PlaylistCardProps {
  playlist: Playlist;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function CoverCollage({ images }: { images: string[] }) {
  const covers = images.filter(Boolean);
  const count = covers.length;

  const imgClass =
    'w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105';

  if (count === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
        <ListVideo size={32} className="text-muted-foreground/30" strokeWidth={1.5} />
      </div>
    );
  }

  if (count === 1) {
    return <img src={getPosterUrl(covers[0])} alt="" className={imgClass} />;
  }

  if (count === 2) {
    return (
      <div className="grid grid-rows-2 w-full h-full gap-0.5 bg-border overflow-hidden">
        {covers.slice(0, 2).map((img, i) => (
          <div key={i} className="min-h-0 min-w-0 overflow-hidden">
            <img src={getPosterUrl(img)} alt="" className={imgClass} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-rows-2 w-full h-full gap-0.5 bg-border overflow-hidden">
        <div className="min-h-0 min-w-0 overflow-hidden">
          <img src={getPosterUrl(covers[0])} alt="" className={imgClass} />
        </div>
        <div className="grid grid-cols-2 gap-0.5 min-h-0 min-w-0 overflow-hidden">
          <div className="min-h-0 min-w-0 overflow-hidden">
            <img src={getPosterUrl(covers[1])} alt="" className={imgClass} />
          </div>
          <div className="min-h-0 min-w-0 overflow-hidden">
            <img src={getPosterUrl(covers[2])} alt="" className={imgClass} />
          </div>
        </div>
      </div>
    );
  }

  // 4 or more — two rows, each split into two equal columns
  return (
    <div className="grid grid-rows-2 w-full h-full gap-0.5 bg-border overflow-hidden">
      <div className="grid grid-cols-2 gap-0.5 min-h-0 min-w-0 overflow-hidden">
        <div className="min-h-0 min-w-0 overflow-hidden">
          <img src={getPosterUrl(covers[0])} alt="" className={imgClass} />
        </div>
        <div className="min-h-0 min-w-0 overflow-hidden">
          <img src={getPosterUrl(covers[1])} alt="" className={imgClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-0.5 min-h-0 min-w-0 overflow-hidden">
        <div className="min-h-0 min-w-0 overflow-hidden">
          <img src={getPosterUrl(covers[2])} alt="" className={imgClass} />
        </div>
        <div className="min-h-0 min-w-0 overflow-hidden">
          <img src={getPosterUrl(covers[3])} alt="" className={imgClass} />
        </div>
      </div>
    </div>
  );
}

export function PlaylistCard({ playlist, onOpen, onEdit, onDelete }: PlaylistCardProps) {
  // Handle both old mock data format (name, items) and new backend format (playlistName, totalTracks)
  const name = playlist.playlistName || (playlist as any).name || 'Untitled';
  const description = playlist.description || (playlist as any).description || '';
  const trackCount = playlist.totalTracks || (playlist as any).items?.length || 0;
  const updatedAt = playlist.updatedAt || (playlist as any).updatedAt || new Date().toISOString();

  const formattedDate = (() => {
    try {
      return format(new Date(updatedAt), 'MMM d, yyyy');
    } catch {
      return 'Recently';
    }
  })();

  return (
    <div className="group bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 hover:border-border transition-all duration-300 hover:-translate-y-1">
      {/* Cover */}
      <div
        className="relative h-64 sm:h-72 cursor-pointer overflow-hidden bg-secondary"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onOpen();
        }}
        aria-label={`Open ${name}`}
      >
        <CoverCollage images={playlist.coverImage ?? []} />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

        {/* Top row: privacy + count */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center justify-center w-7 h-7 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
            {playlist.isPublic ? (
              <Globe size={12} className="text-white/90" />
            ) : (
              <Lock size={12} className="text-white/90" />
            )}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-black/50 backdrop-blur-md text-white rounded-full border border-white/10 tabular-nums tracking-wide">
            {trackCount} {trackCount === 1 ? 'TITLE' : 'TITLES'}
          </span>
        </div>

        {/* Title overlay on cover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pr-14">
          <h3 className="text-base font-bold text-white leading-tight line-clamp-1 drop-shadow-sm">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-white/70 mt-1 line-clamp-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <div className="p-2.5 bg-white rounded-full shadow-lg">
            <ChevronRight size={14} className="text-black" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/60 tabular-nums">
          Updated {formattedDate}
        </p>
        <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="cursor-pointer p-2 rounded-full text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
            aria-label="Edit playlist"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer p-2 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            aria-label="Delete playlist"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}