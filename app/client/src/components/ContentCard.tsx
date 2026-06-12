import { Film, Tv, Eye } from 'lucide-react';
import { ContentItem, RATING_LABELS, RATING_COLORS, RatingKey } from '../data/mockData';

interface ContentCardProps {
  content: ContentItem;
  onClick: (content: ContentItem) => void;
  watchStatus?: 'watched' | 'watching' | 'watchlater' | null;
}

const ratingBorderColor: Record<RatingKey, string> = {
  waste: 'border-red-500/60',
  timepass: 'border-orange-500/60',
  good: 'border-yellow-500/60',
  masterpiece: 'border-green-500/60',
};

export default function ContentCard({ content, onClick, watchStatus }: ContentCardProps) {
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
          src={content.poster}
          alt={`${content.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
            content.type === 'Movie' ?'bg-card/90 border-border text-muted-foreground' :'bg-blue-500/20 border-blue-500/40 text-blue-400'
          }`}>
            {content.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
            {content.type}
          </span>
        </div>

        {/* Watch status */}
        {watchStatus && (
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              watchStatus === 'watched' ? 'bg-green-500/20 border-green-500/40 text-green-400' :
              watchStatus === 'watching'? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-primary/20 border-primary/40 text-primary'
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
        <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{content.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{content.year}</span>
          <span
            className="text-xs font-semibold"
            style={{ color: RATING_COLORS[content.aggregateRating] }}
          >
            {RATING_LABELS[content.aggregateRating].split(' ')[0]}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {content.genre.slice(0, 2).map(g => (
            <span key={`card-genre-${content.id}-${g}`} className="text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}