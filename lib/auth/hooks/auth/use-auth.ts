'use client';

import { useSession } from 'next-auth/react';
import type { UseAuthReturn } from './types';

export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    status
  };
};
