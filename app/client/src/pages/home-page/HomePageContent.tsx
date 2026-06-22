import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Flame, Sparkles, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import { WatchlistEntry } from '@/data/mockData';
import ContentCard, { ContentCardSkeleton } from '@/components/ContentCard';
import HeroBanner from './HeroBanner';
import type { ContentItemTypeHomePage   , ContentFullDetailType} from '@/types/Content.types';
import { FETCH_COMPLETE_HOME_PAGE_DATA, FETCH_GENERAL_CONTENTS_FOR_HOME_PAGE } from '@/lib/graphql/query/content.query';
import { useQuery, useLazyQuery } from '@apollo/client/react';

interface HomePageContentProps {
  onSelectMovie: (content: any) => void;
  watchlist: WatchlistEntry[];
  onStatusChange: (contentId: string, status: 'watched' | 'watching' | 'watchlater' | null) => void;
}

interface HomePageQueryData {
  FetchTrendingContents: ContentItemTypeHomePage[];
  FetchNewReleaseContents: ContentItemTypeHomePage[];
  FetchGeneralContentsForHomepage: ContentItemTypeHomePage[];
}

interface GeneralContentQueryData {
  FetchGeneralContentsForHomepage: ContentItemTypeHomePage[];
}

const ALL_GENRES = ['All', 'Drama', 'Crime', 'Thriller', 'Sci-Fi', 'Comedy', 'Action', 'Romance', 'Horror', 'Biography', 'History', 'Mystery', 'Fantasy', 'Sport'];


const LOAD_MORE_SKELETON_COUNT = 6;
const SKELETON_COUNT = 10;

function getContentGenres(content: ContentItemTypeHomePage): string[] {
  const genre = (content as { genre?: string | string[] }).genre;
  if (Array.isArray(genre)) return genre;
  if (typeof genre === 'string') return [genre];
  return [];
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <div className="relative group/row">
      <button
        type="button"
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
        type="button"
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
  onSeeAll,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {showSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center gap-1 hover:cursor-pointer text-xs sm:text-sm text-primary hover:text-amber-400 transition-colors font-medium"
        >
          See all <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

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

function SkeletonGrid({ count = 21 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </>
  );
}

export default function HomePageContent({ onSelectMovie, watchlist, onStatusChange }: HomePageContentProps) {
  const [activeGenre, setActiveGenre] = useState('All');
  const [generalContent, setGeneralContent] = useState<ContentItemTypeHomePage[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [sectionView, setSectionView] = useState<'home' | 'trending' | 'newReleases'>('home');

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const pageRef = useRef(1);
  const isFetchingMoreRef = useRef(false);

  const { loading, error, data } = useQuery<HomePageQueryData>(FETCH_COMPLETE_HOME_PAGE_DATA, {
    variables: { page: 1 },
  });

  const [
    fetchMoreGeneralContent,
    { loading: loadingGeneralContent, error: generalContentError, data: generalContentData },
  ] = useLazyQuery<GeneralContentQueryData>(FETCH_GENERAL_CONTENTS_FOR_HOME_PAGE);

  const trendingContents: ContentItemTypeHomePage[] = data?.FetchTrendingContents ?? [];
  const newReleaseContent: ContentItemTypeHomePage[] = data?.FetchNewReleaseContents ?? [];


  useEffect(() => {
    if (loading || !data) return;

    const initialContent = data.FetchGeneralContentsForHomepage ?? [];
    setGeneralContent(initialContent);
    if (initialContent.length === 0) {
      setHasMore(false);
    }
  }, [loading, data]);


  useEffect(() => {
    if (loadingGeneralContent) return;
    const newItems = generalContentData?.FetchGeneralContentsForHomepage;
    if (!newItems) return;

    setGeneralContent(prev => {
      const existingIds = new Set(prev.map(item => item._id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item._id));
      return [...prev, ...uniqueNewItems];
    });

    if (newItems.length === 0) {
      setHasMore(false);
    }
    isFetchingMoreRef.current = false;
  }, [loadingGeneralContent, generalContentData]);


  useEffect(() => {
    if (generalContentError) {
      isFetchingMoreRef.current = false;
      pageRef.current = Math.max(1, pageRef.current - 1);
    }
  }, [generalContentError]);


  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (loading || !hasMore || isFetchingMoreRef.current) return;

        isFetchingMoreRef.current = true;
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;

        fetchMoreGeneralContent({ variables: { page: nextPage } });
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore, fetchMoreGeneralContent]);

  const filteredContent = useMemo(() => {
    if (activeGenre === 'All') return generalContent;
    return generalContent.filter(c => getContentGenres(c).includes(activeGenre));
  }, [activeGenre, generalContent]);

  const getWatchStatus = useCallback(
    (contentId: string) => watchlist.find(w => w.contentId === contentId)?.status ?? null,
    [watchlist]
  );

  const renderSnapCard = useCallback(
    (content: ContentItemTypeHomePage, keyPrefix: string) => (
      <div key={`${keyPrefix}-${content._id}`} className="shrink-0 w-[140px] sm:w-[160px] snap-start">
        <ContentCard content={content} onClick={onSelectMovie} watchStatus={getWatchStatus(content._id)} />
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
          type="button"
          onClick={() => window.location.reload()}
          className="text-xs text-primary hover:underline hover:cursor-pointer"
        >
          Reload page
        </button>
      </div>
    );
  }


  if (sectionView !== 'home') {
    const isTrending = sectionView === 'trending';
    const items = isTrending ? trendingContents : newReleaseContent;
    const SectionIcon = isTrending ? Flame : Sparkles;
    const iconClass = isTrending ? 'text-accent' : 'text-primary';
    const title = isTrending ? 'Trending Now' : 'New Releases';

    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-6">
        <button
          type="button"
          onClick={() => setSectionView('home')}
          className="flex items-center gap-1 hover:cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2">
          <SectionIcon size={18} className={iconClass} />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          {!loading && (
            <span className="text-xs sm:text-sm text-muted-foreground/70 tabular-nums">({items.length})</span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            <SkeletonGrid />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 sm:py-24 border border-dashed border-border rounded-2xl">
            <LayoutGrid size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">Nothing here yet</p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {items.map(content => (
              <ContentCard
                key={`${sectionView}-${content._id}`}
                content={content}
                onClick={onSelectMovie}
                watchStatus={getWatchStatus(content._id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-10">
      <HeroBanner
        content={trendingContents[0]}
        onViewDetails={() => trendingContents[0] && onSelectMovie(trendingContents[0])}
        watchStatus={trendingContents[0] ? getWatchStatus(trendingContents[0]._id) : null}
        onStatusChange={onStatusChange}
      />

      <div className="-mx-4 sm:mx-0">
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-1 scrollbar-hide">
          {ALL_GENRES.map(genre => (
            <button
              type="button"
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
          <SectionHeader
            icon={Flame}
            iconClass="text-accent"
            title="Trending Now"
            showSeeAll
            onSeeAll={() => setSectionView('trending')}
          />
          <ScrollRow>
            {loading ? <SkeletonRow /> : trendingContents.map(c => renderSnapCard(c, 'trending'))}
          </ScrollRow>
        </section>
      )}

      {activeGenre === 'All' && (loading || newReleaseContent.length > 0) && (
        <section>
          <SectionHeader
            icon={Sparkles}
            iconClass="text-primary"
            title="New Releases"
            showSeeAll
            onSeeAll={() => setSectionView('newReleases')}
          />
          <ScrollRow>
            {loading ? <SkeletonRow /> : newReleaseContent.map(c => renderSnapCard(c, 'new'))}
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
            <p className="text-sm font-semibold text-foreground mb-1">No {activeGenre} titles yet</p>
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
                ))}
          </div>
        )}
        <div className="h-px w-full" ref={loadMoreRef} aria-hidden="true" />

        {!loading && loadingGeneralContent && hasMore && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-4">
            <SkeletonGrid count={LOAD_MORE_SKELETON_COUNT} />
          </div>
        )}
      </section>
    </div>
  );
}