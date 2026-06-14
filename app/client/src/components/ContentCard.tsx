import { Film, Tv, Eye, EyeOff } from 'lucide-react';
import { ContentItemTypeHomePage } from '@/types/HomePage.types';

interface ContentCardProps {
  content: ContentItemTypeHomePage;
  onClick: (content: ContentItemTypeHomePage) => void;
  watchStatus?: 'watched' | 'watching' | 'watchlater' | null;
}

export function ContentCardSkeleton() {
  return (
    <div className="relative bg-card border border-border rounded-xl overflow-hidden animate-pulse">

      {/* Poster — matches aspect-[2/3] of real card */}
      <div className="relative aspect-[2/3] bg-secondary">

        {/* Type badge — top-left */}
        <div className="absolute top-2 left-2 h-5 w-12 rounded-full bg-white/20" />

        {/* Watch status badge slot — top-right (always reserve space so layout doesn't shift) */}
        <div className="absolute top-2 right-2 h-5 w-6 rounded-full bg-white/15" />

      </div>

      {/* Info — matches p-3 of real card */}
      <div className="p-3">

        {/* Title */}
        <div className="h-3.5 w-[88%] rounded bg-muted" />

        {/* Date */}
        <div className="h-3 w-[40%] rounded bg-muted mt-2 opacity-70" />

        {/* Genre pills — 2 pills, matches slice(0, 2) */}
        <div className="flex gap-1 mt-1.5">
          <div className="h-[18px] w-12 rounded bg-secondary" />
          <div className="h-[18px] w-10 rounded bg-secondary" />
        </div>

      </div>
    </div>
  );
}


export default function ContentCard({ content, onClick, watchStatus }: ContentCardProps) {

  if (!content) {
    return <ContentCardSkeleton />
  }


  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer card-hover"
      onClick={() => onClick(content)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onClick(content); }}
      aria-label={`View details for ${content.title}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        <img
          src={
            content.poster?.startsWith("/")
              ? `${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${content.poster}`
              : content?.poster === "N/A" ? "/assets/images/no_image.png" : "/assets/images/no_image.png"
          }
          alt={`${content.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${content?.Content_Type === 'movie' ? 'bg-card/90 border-border text-muted-foreground' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
            }`}>
            {content?.Content_Type === 'movie' ? <Film size={10} /> : content?.Content_Type === "tv" ? <Tv size={10} /> : <EyeOff size={11} />}
            {content?.Content_Type}
          </span>
        </div>

        {/* Watch status */}
        {watchStatus && (
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${watchStatus === 'watched' ? 'bg-green-500/20 border-green-500/40 text-green-400' :
              watchStatus === 'watching' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-primary/20 border-primary/40 text-primary'
              }`}>
              {watchStatus === 'watched' ? '✓' : watchStatus === 'watching' ? '▶' : '⏱'}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white">
            <Eye size={13} />
            <span className="text-xs font-medium">View Details</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{content?.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{content?.release_date}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5 ">
          {content.genre.slice(0, 2).map(g => (
            <span key={`card-genre-${content?._id}-${g}`} className="truncate text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}