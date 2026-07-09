/**
 * Environment variable validation for production
 * Throws clear errors if required variables are missing
 */

interface EnvConfig {
  VITE_SERVER_BASE_URI: string;
  VITE_BETTER_AUTH_URL: string;
  VITE_TMDB_POSTER_BASE_URL: string;
  VITE_TMDB_BACKDROP_BASE_URL: string;
}

const requiredEnvVars: (keyof EnvConfig)[] = [
  'VITE_SERVER_BASE_URI',
  'VITE_BETTER_AUTH_URL',
  'VITE_TMDB_POSTER_BASE_URL',
  'VITE_TMDB_BACKDROP_BASE_URL',
];

function validateEnvVars(): void {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n${missing
        .map((v) => `  - ${v}`)
        .join('\n')}\n\nPlease check your .env file.`
    );

    if (import.meta.env.PROD) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
}

// Validate on import
validateEnvVars();

// Export safe accessors
export const env = {
  get serverBaseUri() {
    return import.meta.env.VITE_SERVER_BASE_URI;
  },
  get betterAuthUrl() {
    return import.meta.env.VITE_BETTER_AUTH_URL;
  },
  get tmdbPosterBaseUrl() {
    return import.meta.env.VITE_TMDB_POSTER_BASE_URL;
  },
  get tmdbBackdropBaseUrl() {
    return import.meta.env.VITE_TMDB_BACKDROP_BASE_URL;
  },
  get isProduction() {
    return import.meta.env.PROD;
  },
  get isDevelopment() {
    return import.meta.env.DEV;
  },
};

export default env;