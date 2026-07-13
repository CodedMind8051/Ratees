import { useState, useEffect, useRef, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

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

  const mountedRef = useRef(false);
  const checkingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSession = useCallback(async () => {
    if (!mountedRef.current || checkingRef.current) {
      return;
    }

    checkingRef.current = true;

    try {
      const session = await authClient.getSession();

      const sessionData = session as unknown as {
        data?: {
          user?: SessionUser;
        };
        error?: {
          message?: string;
        };
      };

      if (!mountedRef.current) return;

      if (sessionData?.data?.user) {
        const userData = sessionData.data.user;

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
        });

        setError(null);
      } else {
        setUser(null);

        if (sessionData?.error) {
          setError(sessionData.error.message ?? "Session error");
        } else {
          setError(null);
        }
      }
    } catch (err) {
      console.error("[Auth] Session check failed:", err);

      if (mountedRef.current) {
        setUser(null);
        setError("Failed to fetch session");
      }
    } finally {
      checkingRef.current = false;

      if (mountedRef.current) {
        setLoading(false);

        timeoutRef.current = setTimeout(() => {
          checkSession();
        }, 10000);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    checkSession();

    return () => {
      mountedRef.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkSession]);

  const refetch = async () => {
    if (checkingRef.current) return;

    setLoading(true);
    await checkSession();
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
}

export default useAuth
