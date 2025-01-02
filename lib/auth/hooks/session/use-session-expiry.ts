'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { AUTH_ERROR_MESSAGES } from '../types/auth-errors';

const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export const useSessionExpiry = () => {
  const { data: session } = useSession();

  const checkExpiry = useCallback(() => {
    if (session?.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const timeLeft = expiryTime - Date.now();

      if (timeLeft < WARNING_THRESHOLD) {
        toast.warning(AUTH_ERROR_MESSAGES.SessionExpiring);
      }
    }
  }, [session?.expires]);

  useEffect(() => {
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkExpiry]);
};
