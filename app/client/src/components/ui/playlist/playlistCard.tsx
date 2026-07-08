import { allContent } from '@/data/mockData';
import { ContentItemsType } from '@/types/content.types';
import { ArrowLeft, ChevronRight, Film, GripVertical, ListVideo, Pencil, Plus, Trash2, Tv, X } from 'lucide-react';
import type { Playlist } from '@/types/playlist.type';


interface PlaylistCardProps {
  playlist: Playlist;
  coverImage: string | null;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistCard({ playlist, onOpen, onEdit, onDelete }: PlaylistCardProps) {
  const itemPreviews = playlist.items
    .slice(0, 4)
    .map(id => allContent.find(c => c.id === id))
    .filter(Boolean) as ContentItemsType[];

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-all duration-200">
      {/* Cover */}
      <div
        className="relative h-44 sm:h-48 cursor-pointer overflow-hidden bg-secondary"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onOpen(); }}
        aria-label={`Open ${playlist.name}`}
      >
        {playlist.items.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo size={36} className="text-muted-foreground/30" />
          </div>
        ) : itemPreviews.length === 1 ? (
          <img
            src={itemPreviews[0].poster}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid grid-cols-2 h-full gap-0.5">
            {Array.from({ length: 4 }).map((_, idx) => {
              const item = itemPreviews[idx];
              return item ? (
                <div key={`cover-${playlist.id}-${item._id}`} className="overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div key={`cover-${playlist.id}-empty-${idx}`} className="bg-secondary/60 flex items-center justify-center">
                  <ListVideo size={16} className="text-muted-foreground/20" />
                </div>
              );
            })}
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Count badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-bold px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full border border-white/10 tabular-nums">
            {playlist.items.length} {playlist.items.length === 1 ? 'title' : 'titles'}
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
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate hover:text-primary transition-colors">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">
                {playlist.description}
              </p>
            )}
          </div>
          {/* Edit / delete — always visible on mobile, hover on desktop */}
          <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Edit playlist"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
              aria-label="Delete playlist"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 tabular-nums">Updated {playlist.updatedAt}</p>
      </div>
    </div>
  );
}

