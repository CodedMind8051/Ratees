import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Film, Tv, Check } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_CONTENT } from '@/lib/graphql/query/content.query';
import type { ContentItemsType } from '@/types/content.types';
import MovieDetailModal from "@/components/ui/content/ContentDetailModal"

const TRENDING_TAGS = ['Thriller', 'Science Fiction', 'Drama', 'Korean', 'Crime', 'Animation'] as const;

interface SearchOverlayProps {
  onClose: () => void;
  onSelectMovie?: (content: ContentItemsType) => void;
  onSelectMovieOnly?: boolean; // When true, only calls onSelectMovie without opening detail modal
}

function getPosterUrl(poster: string | undefined | null): string {
  if (!poster || poster === 'N/A') return '/assets/images/no_image.png';
  if (poster.startsWith('/')) return `${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${poster}`;
  return poster;
}

function SearchSkeleton() {
  return (
    <div className="py-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3">
          <div className="w-10 h-14 rounded-md bg-secondary animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-secondary animate-pulse rounded-full w-3/4" />
            <div className="h-2.5 bg-secondary animate-pulse rounded-full w-1/3" />
          </div>
          <div className="w-12 h-3 bg-secondary animate-pulse rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function SearchOverlay({ onClose, onSelectMovie, onSelectMovieOnly }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setselected] = useState(false)
  const [selectedContent, setselectedContent] = useState("")
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<{ getContentsList: ContentItemsType[] }>(
    SEARCH_CONTENT,
    { variables: { query: submittedQuery, page: 1 }, skip: !submittedQuery }
  );

  const results: ContentItemsType[] = data?.getContentsList ?? [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setHasSearched(true);
    if (trimmed === submittedQuery) refetch();
  }, [query, submittedQuery, refetch]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleTagClick(tag: string) {
    setQuery(tag);
    setSubmittedQuery(tag);
    setHasSearched(true);

  }

  function handleSelectItem(item: ContentItemsType) {
    // Show animation feedback when clicking to add
    setAddingItemId(item._id);

    // Small delay to show animation before calling the callback
    setTimeout(() => {
      onSelectMovie?.(item);
      // Only open detail modal if onSelectMovieOnly is not true
      if (!onSelectMovieOnly) {
        setselected(true)
        setselectedContent(item?._id)
      }
      setAddingItemId(null);
    }, 300);
  }


  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col items-center pt-16 sm:pt-20 px-3 sm:px-4"
        onClick={onClose}
      >


        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <div
          className="relative w-full max-w-2xl fade-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">

            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
              <Search size={18} className="text-muted-foreground shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, series, genres..."
                className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
                aria-label="Search content"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!query.trim()}
                className="px-2.5 sm:px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            {loading ? (
              <SearchSkeleton />
            ) : hasSearched ? (
              results.length > 0 ? (
                <div className="py-2 max-h-[55vh] sm:max-h-96 overflow-y-auto overscroll-contain">
                  {results.map(item => (
                    <button
                      key={item._id}
                      type="button"
                      className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-secondary transition-all text-left cursor-pointer relative ${
                        addingItemId === item._id ? 'bg-primary/10 scale-[0.98]' : ''
                      }`}
                      onClick={() => handleSelectItem(item)}
                      disabled={addingItemId !== null}
                    >
                      <div className="w-9 sm:w-10 h-12 sm:h-14 rounded-md overflow-hidden shrink-0 bg-secondary">
                        <img
                          src={getPosterUrl(item.poster)}
                          alt={`${item.title} poster`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={e => {
                            const img = e.currentTarget;
                            if (img.src !== '/assets/images/no_image.png') {
                              img.src = '/assets/images/no_image.png';
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.release_date}
                          {item.genre?.[0] ? ` · ${item.genre[0]}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {addingItemId === item._id ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : item.Content_Type === 'movie' ? (
                          <>
                            <Film size={12} className="text-primary" aria-hidden="true" />
                            <span className="text-xs text-muted-foreground hidden sm:block">Movie</span>
                          </>
                        ) : (
                          <>
                            <Tv size={12} className="text-blue-400" aria-hidden="true" />
                            <span className="text-xs text-muted-foreground hidden sm:block">TV</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center px-4">
                  <Search size={28} className="text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    No results for <span className="text-foreground font-medium">"{submittedQuery}"</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different title </p>
                </div>
              )
            ) : (
              <div className="py-6 sm:py-8 px-4 sm:px-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 flex-wrap">
                  <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Enter</kbd>
                  or click <span className="font-medium text-foreground">Search</span> to find content
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
      {selectedContent && (
        <MovieDetailModal
          contentId={selectedContent}
          onClose={() => setselectedContent("")}
        />
      )}
    </>
  );
}