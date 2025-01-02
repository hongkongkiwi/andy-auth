'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTE_CONFIG } from '../routes';
import { toast } from 'sonner';
import { AUTH_ERROR_MESSAGES } from '@/app/auth/_components/types/auth-errors';

export const useSessionRecovery = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const recoverSession = useCallback(async () => {
    try {
      await update(); // Attempt to refresh the session
      toast.success('Session recovered');
    } catch (error) {
      console.error('Session recovery failed:', error);
      router.push(AUTH_ROUTE_CONFIG.routes.public.login);
    }
  }, [update, router]);

  useEffect(() => {
    if (status === 'unauthenticated' && session) {
      toast.warning(AUTH_ERROR_MESSAGES.SessionRequired);
      recoverSession();
    }
  }, [status, session, recoverSession]);

  return { recoverSession };
};
