'use client';

import { useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAuthStore } from '../../stores/auth-store';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { AUTH_ROUTE_CONFIG } from '../../routes';
import { AuthError, AuthErrorCode, AUTH_ERRORS } from '../../errors';
import type { SignInResponse } from 'next-auth/react';
import type { LoginCredentials, UseAuthStateReturn } from './types';

export const useAuthState = (): UseAuthStateReturn => {
  const router = useRouter();
  const { status } = useSession();
  const { setError, setLoading } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        setLoading(true);
        const result = (await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password
        })) as SignInResponse;

        if (!result?.ok) {
          throw new AuthError(
            result?.error || 'Authentication failed',
            AuthErrorCode.AUTHENTICATION_FAILED
          );
        }

        toast.success('Successfully signed in');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Authentication failed';
        toast.error(message);
        setError(error instanceof Error ? error : new Error(message));
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      router.push(AUTH_ROUTE_CONFIG.routes.public.login);
      toast.success('Successfully signed out');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(message));
    } finally {
      setLoading(false);
    }
  }, [router, setError, setLoading]);

  return {
    login,
    logout,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    status
  };
};
