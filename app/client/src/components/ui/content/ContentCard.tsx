import { Film, Tv, HelpCircle, Eye, Check, Play, Clock } from 'lucide-react';
import type { ContentItemsType } from '@/types/content.types';
import { ContentCardSkeleton } from './ContentCard.skeleton';
import { getPosterUrl } from '@/utils/content.utils';

interface ContentCardProps {
  content: ContentItemsType;
  onClick: (content: ContentItemsType) => void;
  watchStatus?: 'watched' | 'watching' | 'watchlater' | null;
}




const CONTENT_TYPE_META = {
  movie: { label: 'Movie', Icon: Film, className: 'bg-card/90 border-border text-muted-foreground' },
  tv: { label: 'TV', Icon: Tv, className: 'bg-blue-500/20 border-blue-500/40 text-blue-400' },
} as const;

const WATCH_STATUS_META = {
  watched: { label: 'Watched', Icon: Check, className: 'bg-green-500/20 border-green-500/40 text-green-400' },
  watching: { label: 'Watching', Icon: Play, className: 'bg-blue-500/20 border-blue-500/40 text-blue-400' },
  watchlater: { label: 'Watch later', Icon: Clock, className: 'bg-primary/20 border-primary/40 text-primary' },
} as const;


export default function ContentCard({ content, onClick, watchStatus }: ContentCardProps) {
  if (!content) return <ContentCardSkeleton />;

  const typeMeta = content.Content_Type ? CONTENT_TYPE_META[content.Content_Type as keyof typeof CONTENT_TYPE_META] : null;
  const statusMeta = watchStatus ? WATCH_STATUS_META[watchStatus] : null;
  const genres = content.genre ?? [];

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(content);
    }
  }

  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer card-hover"
      onClick={() => onClick(content)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${content?.title}`}
    >

      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        <img
          src={getPosterUrl(content?.poster)}
          alt={`${content?.title} poster`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => {
            const img = e.currentTarget;
            if (img.src !== '/assets/images/no_image.png') {
              img.src = '/assets/images/no_image.png';
            }
          }}
        />

        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {typeMeta ? (
          <div className="absolute top-2 left-2">
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${typeMeta.className}`}
              aria-label={typeMeta.label}
            >
              <typeMeta.Icon size={10} aria-hidden="true" />
              {typeMeta.label}
            </span>
          </div>
        ) : content?.Content_Type ? (

          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border bg-card/90 border-border text-muted-foreground">
              <HelpCircle size={10} aria-hidden="true" />
              {content?.Content_Type}
            </span>
          </div>
        ) : null}

        {statusMeta && (
          <div className="absolute top-2 right-2">
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusMeta.className}`}
              aria-label={statusMeta.label}
            >
              <statusMeta.Icon size={10} aria-hidden="true" />
              <span className="sr-only">{statusMeta.label}</span>
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white">
            <Eye size={13} aria-hidden="true" />
            <span className="text-xs font-medium">View Details</span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
          {content?.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {content?.release_date}
          </span>
        </div>

        {genres?.length > 0 && (
          <div className="flex flex-nowrap gap-1 mt-1.5 overflow-hidden">
            {genres?.slice(0, 2).map(g => (
              <span
                key={`card-genre-${content?._id}-${g}`}
                className="truncate text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground flex-1 min-w-0 text-center"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}