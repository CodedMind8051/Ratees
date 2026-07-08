import { useEffect, useRef, useState } from 'react';
import { ArrowUpDown, Film, Tv, X } from 'lucide-react';
import { WatchlistEntry, ContentItem } from '@/data/mockData';
import { RATING_LABELS } from '@/constants/rating.constant';
import { tabConfig } from '@/constants/watchlist.constant';


interface WatchlistCardProps {
  entry: WatchlistEntry;
  content: ContentItem;
  onViewDetails: () => void;
  onRemove: () => void;
  onMoveStatus: (status: 'watched' | 'watching' | 'watchlater') => void;
}

export function WatchlistCard({ entry, content, onViewDetails, onRemove, onMoveStatus }: WatchlistCardProps) {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const moveOptions = (['watched', 'watching', 'watchlater'] as const).filter(s => s !== entry.status);

  // Close move menu on outside click
  useEffect(() => {
    if (!moveMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMoveMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moveMenuOpen]);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-muted transition-all duration-200 flex flex-col">

      {/* ── Thumbnail ── */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={onViewDetails}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onViewDetails(); }}
      >
        <div className="aspect-[16/9] bg-secondary overflow-hidden">
          <img
            src={content.poster}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={[
            'flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm',
            content.type === 'Movie'
              ? 'bg-card/80 border-border text-muted-foreground'
              : 'bg-blue-500/20 border-blue-500/40 text-blue-400',
          ].join(' ')}>
            {content.type === 'Movie' ? <Film size={9} /> : <Tv size={9} />}
            {content.type}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove from watchlist"
          className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all active:scale-95"
        >
          <X size={12} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-start justify-between gap-2 mb-auto">
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold text-foreground leading-tight truncate cursor-pointer hover:text-primary transition-colors"
              onClick={onViewDetails}
            >
              {content.title}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {content.year} · {content.genre[0]}
            </p>
          </div>

          {/* Personal rating badge */}
          {entry.personalRating && (
            <span className={[
              'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border',
              entry.personalRating === 'masterpiece' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                entry.personalRating === 'good' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  entry.personalRating === 'timepass' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20',
            ].join(' ')}>
              {RATING_LABELS[entry.personalRating]}
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground/60 tabular-nums">
            {entry.dateAdded}
          </p>

          {/* Move to */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMoveMenuOpen(p => !p)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Move <ArrowUpDown size={10} />
            </button>
            {moveMenuOpen && (
              <div className="absolute bottom-full right-0 mb-1.5 bg-card border border-border rounded-xl shadow-2xl z-20 py-1 min-w-[130px] fade-in overflow-hidden">
                {moveOptions.map(status => {
                  const cfg = tabConfig[status];
                  const MoveIcon = cfg.icon;
                  return (
                    <button
                      key={`move-${status}`}
                      onClick={() => { setMoveMenuOpen(false); onMoveStatus(status); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary transition-colors ${cfg.color}`}
                    >
                      <MoveIcon size={12} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}