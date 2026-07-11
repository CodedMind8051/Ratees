import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        const sessionData = session as unknown as { data?: { user?: SessionUser }; error?: { message: string } };

        if (!mountedRef.current) return;

        if (sessionData?.data?.user) {
          const userData = sessionData.data.user;
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image || undefined,
          });
          setError(null);
        } else if (sessionData?.error) {
          setError(sessionData.error.message || 'Session error');
          setUser(null);
        } else {
          setUser(null);
        }
      } catch (err: unknown) {
        if (mountedRef.current) {
          console.error('[Auth] Session check failed:', err);
          setUser(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const interval = setInterval(checkSession, 2000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const refetch = () => {
    setLoading(true);
    return authClient.getSession().then((session) => {
      const sessionData = session as unknown as { data?: { user?: SessionUser }; error?: { message: string } };
      if (sessionData?.data?.user) {
        const userData = sessionData.data.user;
        setUser({ id: userData.id, name: userData.name, email: userData.email, image: userData.image || undefined });
        setError(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  };

  return { user, loading, error, refetch };
}

export default useAuth;