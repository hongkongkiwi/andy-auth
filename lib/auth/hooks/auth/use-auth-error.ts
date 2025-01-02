'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTE_CONFIG } from '../../routes';
import { AuthError, AuthErrorCode } from '../../errors';
import { AUTH_ERROR_MESSAGES } from '../../errors/messages';
import type { UseAuthErrorReturn } from './types';

export const useAuthError = (): UseAuthErrorReturn => {
  const router = useRouter();

  const handleAuthError = useCallback(
    (error: AuthError | Error): void => {
      const isAuthError = error instanceof AuthError;
      console.error('Auth error:', error);

      if (isAuthError && error.code) {
        const message =
          AUTH_ERROR_MESSAGES[error.code as AuthErrorCode] || error.message;
        toast.error(message);

        switch (error.code as AuthErrorCode) {
          case AuthErrorCode.SESSION_REQUIRED:
            router.push(
              `${AUTH_ROUTE_CONFIG.routes.public.login}?error=SessionRequired`
            );
            break;
          case AuthErrorCode.EMAIL_NOT_VERIFIED:
            router.push(AUTH_ROUTE_CONFIG.routes.protected.verify);
            break;
          case AuthErrorCode.WORKSPACE_ACCESS_DENIED:
            router.push(
              `${AUTH_ROUTE_CONFIG.routes.public.error}?error=WorkspaceAccessDenied`
            );
            break;
        }
      } else {
        toast.error(error.message || AUTH_ERROR_MESSAGES.Default);
      }
    },
    [router]
  );

  return { handleAuthError };
};
