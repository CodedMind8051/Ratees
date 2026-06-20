import { useState, useMemo, useRef, useCallback, } from 'react';
import { Flame, Sparkles, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import { WatchlistEntry } from '@/data/mockData';
import ContentCard, { ContentCardSkeleton } from '@/components/ContentCard';
import HeroBanner from './HeroBanner';
import { ContentItemTypeHomePage } from '@/types/Content.types';
import { FETCH_COMPLETE_HOME_PAGE_DATA } from '@/lib/graphql/query/content.query';
import { useQuery } from '@apollo/client/react';


interface HomePageContentProps {
  onSelectMovie: (content: ContentItemTypeHomePage) => void;
  watchlist: WatchlistEntry[];
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

const ALL_GENRES = ['All', 'Drama', 'Crime', 'Thriller', 'Sci-Fi', 'Comedy', 'Action', 'Romance', 'Horror', 'Biography', 'History', 'Mystery', 'Fantasy', 'Sport'];


function ScrollRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <div className="relative group/row">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden sm:flex absolute hover:cursor-pointer -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200"
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide snap-x snap-mandatory"
      >
        {children}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden sm:flex absolute hover:cursor-pointer -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200"
      >
        <ChevronRight size={16} />
      </button>

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
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {showSeeAll && (
        <button className="flex items-center gap-1 hover:cursor-pointer text-xs sm:text-sm text-primary hover:text-amber-400 transition-colors font-medium">
          See all <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}


const SKELETON_COUNT = 10;

function SkeletonRow() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="shrink-0 w-[140px] sm:w-[160px] snap-start">
          <ContentCardSkeleton />
        </div>
      ))}
    </>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </>
  );
}


export default function HomePageContent({ onSelectMovie, watchlist, onStatusChange }: HomePageContentProps) {
  const [activeGenre, setActiveGenre] = useState('All');

  const { loading, error, data } = useQuery<{
    FetchTrendingContents: ContentItemTypeHomePage[];
    FetchNewReleaseContents: ContentItemTypeHomePage[];
    FetchGeneralContentsForHomepage: ContentItemTypeHomePage[];
  }>(FETCH_COMPLETE_HOME_PAGE_DATA, {
    variables: {
      page: 1
    }
  });



  const TrendingContents: ContentItemTypeHomePage[] = data?.FetchTrendingContents ?? [];
  const NewReleaseContent: ContentItemTypeHomePage[] = data?.FetchNewReleaseContents ?? []
  const GeneralContent: ContentItemTypeHomePage[] = data?.FetchGeneralContentsForHomepage




  const filteredContent = useMemo(() => {
    if (activeGenre === 'All') return GeneralContent;
    return GeneralContent.filter(c =>
      Array.isArray(c?.genre)
        ? c?.genre.includes(activeGenre)
        : (c as any).genre === activeGenre
    );
  }, [activeGenre, GeneralContent]);

  const getWatchStatus = useCallback(
    (contentId: string) => watchlist.find(w => w.contentId === contentId)?.status ?? null,
    [watchlist]
  );

  const renderSnapCard = useCallback(
    (content: ContentItemTypeHomePage, keyPrefix: string) => (
      <div key={`${keyPrefix}-${content._id}`} className="shrink-0  w-[140px]  sm:w-[160px] snap-start">
        <ContentCard
          content={content}
          onClick={onSelectMovie}
          watchStatus={getWatchStatus(content._id)}
        />
      </div>
    ),
    [onSelectMovie, getWatchStatus]
  );


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4">
        <LayoutGrid size={36} className="text-muted-foreground/30" />
        <p className="text-sm font-semibold text-foreground">{error.message}</p>

        <button
          onClick={() => window.location.reload()}
          className="text-xs text-primary hover:underline hover:cursor-pointer"
        >
          Reload page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-10">

      <HeroBanner
        content={TrendingContents[0]}
        onViewDetails={() => TrendingContents[0] && onSelectMovie(TrendingContents[0])}
        watchStatus={TrendingContents[0] ? getWatchStatus(TrendingContents[0]._id) : null}
        onStatusChange={onStatusChange}
      />


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

      {activeGenre === 'All' && (
        <section>
          <SectionHeader icon={Flame} iconClass="text-accent" title="Trending Now" showSeeAll />
          <ScrollRow>
            {loading ? <SkeletonRow /> : TrendingContents.map(c => renderSnapCard(c, 'trending'))}
          </ScrollRow>
        </section>
      )}

      {activeGenre === 'All' && (loading || NewReleaseContent.length > 0) && (
        <section>
          <SectionHeader icon={Sparkles} iconClass="text-primary" title="New Releases" showSeeAll />
          <ScrollRow>
            {loading ? <SkeletonRow /> : NewReleaseContent.map(c => renderSnapCard(c, 'new'))}
          </ScrollRow>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              {activeGenre === 'All' ? 'All Titles' : activeGenre}
            </h2>
            {!loading && (
              <span className="text-xs sm:text-sm text-muted-foreground/70 tabular-nums">
                ({filteredContent.length})
              </span>
            )}
          </div>
        </div>


        {!loading && filteredContent.length === 0 ? (
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
            {loading
              ? <SkeletonGrid />
              : filteredContent.map(content => (
                <ContentCard
                  key={`all-${content._id}`}
                  content={content}
                  onClick={onSelectMovie}
                  watchStatus={getWatchStatus(content._id)}
                />
              ))
            }
          </div>
        )}
      </section>
    </div>
  );
}