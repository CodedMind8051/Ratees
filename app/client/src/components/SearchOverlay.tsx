import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Film, Tv } from 'lucide-react';
import { allContent } from '@/data/mockData';
import type { ContentItem } from '@/data/mockData';

interface SearchOverlayProps {
  onClose: () => void;
  onSelectMovie?: (content: ContentItem) => void;
}

function SearchSkeleton() {
  return (
    <div className="py-2">
      {[...Array(5)].map((_, i) => (
        <div key={`skel-${i}`} className="flex items-center gap-4 px-5 py-3">
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

export default function SearchOverlay({ onClose, onSelectMovie }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof allContent>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setHasSearched(true);
    setLoading(true);
    setResults([]);
    // Simulate DB fetch delay
    await new Promise(r => setTimeout(r, 900));
    const found = allContent.filter(c =>
      c.title.toLowerCase().includes(trimmed.toLowerCase()) ||
      c.genre.some(g => g.toLowerCase().includes(trimmed.toLowerCase()))
    ).slice(0, 8);
    setResults(found);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Search input row */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Search size={20} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, series, genres..."
              className="flex-1 bg-transparent text-base text-foreground placeholder-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              Search
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <SearchSkeleton />
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="py-2 max-h-96 overflow-y-auto">
                {results.map(item => (
                  <button
                    key={`search-${item.id}`}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-secondary transition-colors text-left"
                    onClick={() => {
                      onSelectMovie?.(item);
                      onClose();
                    }}
                  >
                    <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-secondary">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.year} · {item.genre[0]}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.type === 'Movie' ? <Film size={12} className="text-primary" /> : <Tv size={12} className="text-blue-400" />}
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results for &quot;{submittedQuery}&quot;</p>
              </div>
            )
          ) : (
            <div className="py-8 px-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Thriller', 'Sci-Fi', 'Drama', 'Korean', 'Crime', 'Animation'].map(tag => (
                  <button
                    key={`trend-${tag}`}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Enter</kbd>
                or click <span className="font-medium text-foreground">Search</span> to find content
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Esc</kbd> to close</p>
      </div>
    </div>
  );
}