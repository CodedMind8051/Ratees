
export function getPosterUrl(poster: string | undefined | null): string {
  if (!poster || poster === 'N/A') return '/assets/images/no_image.png';
  if (poster.startsWith('/')) return `${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${poster}`;
  return poster;
}
