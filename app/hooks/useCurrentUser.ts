"use client";

import { useEffect, useState } from 'react';

type CurrentUser = { id?: string; email?: string; name?: string; avatar?: string };

// Browser state is only a UI hint; API routes must verify authentication independently.
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(stored && typeof stored === 'object' ? stored : null);
      } catch {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('userLoggedIn', syncUser);
    window.addEventListener('userLoggedOut', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userLoggedIn', syncUser);
      window.removeEventListener('userLoggedOut', syncUser);
    };
  }, []);
  return user;
}
