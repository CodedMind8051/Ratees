import { useState, useMemo, useRef, useEffect } from 'react';
import { Flame, Sparkles, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import { allContent, ContentItem, WatchlistEntry, ALL_GENRES } from '@/data/mockData';
import ContentCard from '@/components/ContentCard';
import HeroBanner from './HeroBanner';
import { FETCH_CONTENTS_FOR_HOMEPAGE } from "@/functions/fetchContainlist.function";
import { useLazyQuery } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

interface HomePageContentProps {
  onSelectMovie: (content: ContentItem) => void;
  watchlist: WatchlistEntry[];
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

// Horizontal scroll row with arrow buttons on desktop
function ScrollRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden sm:flex absolute hover:cursor-pointer -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Scroll container */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide snap-x snap-mandatory"
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden sm:flex absolute hover:cursor-pointer -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200"
      >
        <ChevronRight size={16} />
      </button>

      {/* Fade-out edge hint on mobile */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-background to-transparent sm:hidden" />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  showSeeAll,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  showSeeAll?: boolean;
}) {

  const [fetchContents, { loading, error, data }] = useLazyQuery(FETCH_CONTENTS_FOR_HOMEPAGE);
  console.log(data)
  const contents = (data as any)?.FetchContentsForHomepage ?? [];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {showSeeAll && (
        <button
          className="flex items-center gap-1 hover:cursor-pointer text-xs sm:text-sm text-primary hover:text-amber-400 transition-colors font-medium">
          See all <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}



export default function HomePageContent({ onSelectMovie, watchlist, onStatusChange }: HomePageContentProps) {

  const [activeGenre, setActiveGenre] = useState('All');
  const [contentk, setcontentk] = useState([])

  const filteredContent = useMemo(() => {
    if (activeGenre === 'All') return allContent;
    return allContent.filter(c => c.genre.includes(activeGenre));
  }, [activeGenre]);

  const featuredContent = allContent[0];

  const { loading, error, data } = useQuery(
    FETCH_CONTENTS_FOR_HOMEPAGE,
    {
      variables: { page: 1 },
    }
  );
  console.log(data)
  useEffect(() => {
    if (data) {
      setcontentk(
        (data as any)?.FetchContentsForHomepage ?? []
      );
    }
  }, [data]);
  const trendingContent = allContent.slice(0, 6);
  const newReleases = allContent.filter(c => c.year >= 2024).slice(0, 6);

  const getWatchStatus = (contentId: string) =>
    watchlist.find(w => w.contentId === contentId)?.status ?? null;

  // Snap-friendly card wrapper
  const snapCard = (content: ContentItem, keyPrefix: string) => (
    <div key={`${keyPrefix}-${content.id}`} className="shrink-0 w-[140px] sm:w-[160px] snap-start">
      <ContentCard
        content={content}
        onClick={onSelectMovie}
        watchStatus={getWatchStatus(content.id)}
      />
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-10">

      {/* ── Hero ── */}
      <HeroBanner
        content={featuredContent}
        onViewDetails={() => onSelectMovie(featuredContent)}
        watchStatus={getWatchStatus(featuredContent.id)}
        onStatusChange={onStatusChange}
      />

      {/* ── Genre filter ── */}
      <div className="-mx-4 sm:mx-0">
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-1 scrollbar-hide">
          {ALL_GENRES.map(genre => (
            <button
              key={`genre-${genre}`}
              onClick={() => setActiveGenre(genre)}
              className={[
                'shrink-0 px-3.5 hover:cursor-pointer py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 active:scale-95',
                activeGenre === genre
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                  : 'bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:border-muted',
              ].join(' ')}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trending Now ── */}
      {activeGenre === 'All' && (
        <section>
          <SectionHeader icon={Flame} iconClass="text-accent" title="Trending Now" showSeeAll />
          <ScrollRow>
            {contentk.map(c => snapCard(c, 'trending'))}
          </ScrollRow>
        </section>
      )}

      {/* ── New Releases ── */}
      {activeGenre === 'All' && newReleases.length > 0 && (
        <section>
          <SectionHeader icon={Sparkles} iconClass="text-primary" title="New Releases" showSeeAll />
          <ScrollRow>
            {newReleases.map(c => snapCard(c, 'new'))}
          </ScrollRow>
        </section>
      )}

      {/* ── All / Filtered titles ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              {activeGenre === 'All' ? 'All Titles' : `${activeGenre}`}
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground/70 tabular-nums">
              ({filteredContent.length})
            </span>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-16 sm:py-24 border border-dashed border-border rounded-2xl">
            <LayoutGrid size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">
              No {activeGenre} titles yet
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
              We're always adding more. Check back soon or explore another genre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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