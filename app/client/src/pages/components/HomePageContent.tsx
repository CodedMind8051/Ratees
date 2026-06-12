import  { useState, useMemo } from 'react';
import { Flame, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { allContent, ContentItem, WatchlistEntry } from '@/data/mockData';
import { ALL_GENRES } from '@/data/mockData';
import ContentCard from '@/components/ContentCard';
import HeroBanner from './HeroBanner';

interface HomePageContentProps {
  onSelectMovie: (content: ContentItem) => void;
  watchlist: WatchlistEntry[];
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

export default function HomePageContent({ onSelectMovie, watchlist, onStatusChange }: HomePageContentProps) {
  const [activeGenre, setActiveGenre] = useState('All');

  const filteredContent = useMemo(() => {
    if (activeGenre === 'All') return allContent;
    return allContent.filter(c => c.genre.includes(activeGenre));
  }, [activeGenre]);

  const featuredContent = allContent[0];
  const trendingContent = allContent.slice(0, 6);
  const newReleases = allContent.filter(c => c.year >= 2024).slice(0, 6);

  const getWatchStatus = (contentId: string) => {
    return watchlist.find(w => w.contentId === contentId)?.status ?? null;
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {/* Hero Banner */}
      <HeroBanner
        content={featuredContent}
        onViewDetails={() => onSelectMovie(featuredContent)}
        watchStatus={getWatchStatus(featuredContent.id)}
        onStatusChange={onStatusChange}
      />

      {/* Genre Filter */}
      <div className="mt-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ALL_GENRES.map(genre => (
            <button
              key={`genre-chip-${genre}`}
              onClick={() => setActiveGenre(genre)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                activeGenre === genre
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      {activeGenre === 'All' && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Trending Now</h2>
            </div>
            <button className="flex items-center gap-1 text-sm text-primary hover:text-amber-400 transition-colors">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
            {trendingContent.map(content => (
              <ContentCard
                key={`trending-${content.id}`}
                content={content}
                onClick={onSelectMovie}
                watchStatus={getWatchStatus(content.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {activeGenre === 'All' && newReleases.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">New Releases</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
            {newReleases.map(content => (
              <ContentCard
                key={`new-${content.id}`}
                content={content}
                onClick={onSelectMovie}
                watchStatus={getWatchStatus(content.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All / Filtered Content */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              {activeGenre === 'All' ? 'All Titles' : `${activeGenre} Titles`}
            </h2>
            <span className="text-sm text-muted-foreground">({filteredContent.length})</span>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <TrendingUp size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground mb-1">No {activeGenre} titles yet</p>
            <p className="text-sm text-muted-foreground">We&apos;re always adding more content. Check back soon or explore another genre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
            {filteredContent.map(content => (
              <ContentCard
                key={`all-${content.id}`}
                content={content}
                onClick={onSelectMovie}
                watchStatus={getWatchStatus(content.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}