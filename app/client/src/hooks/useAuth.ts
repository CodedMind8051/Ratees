import { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';

/**
 * Hook to get the current authenticated user
 * Handles session polling to detect login/logout
 */
export function useAuth() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const session = await authClient.getSession();

      // Response structure: { data: { user: {...} }, error: null }
      // or: { data: null, error: {...} }
      const sessionData = session as any;

      if (sessionData?.data?.user) {
        // Success - user is logged in
        const userData = sessionData.data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image || undefined,
        });
        setError(null);
      } else if (sessionData?.error) {
        // Error in session
        setError(sessionData.error.message || 'Session error');
        setUser(null);
      } else {
        // No session (logged out)
        setUser(null);
      }
    } catch (err: any) {
      console.error('[Auth] Session check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkSession();

    // Poll for session changes
    const interval = setInterval(checkSession, 2000);

    return () => clearInterval(interval);
  }, [checkSession]);

  return { user, loading, error, refetch: checkSession };
}

export default useAuth;