import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-6xl sm:text-8xl font-black text-primary mb-4">404</h1>
      <p className="text-lg sm:text-xl font-semibold mb-2">Page not found</p>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
      >
        Go Home
      </Link>
    </div>
  );
}
