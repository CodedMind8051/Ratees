/**
 * App Configuration
 * Centralized configuration for the application
 */

export const appConfig = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_SERVER_BASE_URI || 'http://localhost:5000',
    graphqlEndpoint: `${import.meta.env.VITE_SERVER_BASE_URI}/graphql`,
  },

  // TMDB Configuration
  tmdb: {
    posterBaseUrl: import.meta.env.VITE_TMDB_POSTER_BASE_URL || 'https://image.tmdb.org/t/p/w500',
    backdropBaseUrl: import.meta.env.VITE_TMDB_BACKDROP_BASE_URL || 'https://image.tmdb.org/t/p/original',
  },

  // Auth Configuration
  auth: {
    baseUrl: import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:5000',
  },

  // App Settings
  app: {
    name: 'Ratees',
    version: '1.0.0',
    description: 'Rate and discover movies, TV shows, and more',
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
  },

  // Feature flags
  features: {
    enableAnalytics: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
    enableErrorTracking: !!import.meta.env.VITE_SENTRY_DSN,
  },
} as const;

export default appConfig;