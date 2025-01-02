'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthPersistence } from './use-auth-persistence';
import { useAuthError } from './use-auth-error';

export const useSessionPersistence = () => {
  const { data: session } = useSession();
  const { persistAuthState, clearAuthState } = useAuthPersistence();
  const { handleAuthError } = useAuthError();

  useEffect(() => {
    try {
      if (session?.user) {
        persistAuthState(session.user);
      } else {
        clearAuthState();
      }
    } catch (error) {
      handleAuthError(error as Error);
    }
  }, [session, persistAuthState, clearAuthState, handleAuthError]);
};
