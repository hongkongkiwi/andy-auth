'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth/hooks/use-auth';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { useSessionExpiry } from '@/lib/auth/hooks/use-session-expiry';
import { useSessionRecovery } from '@/lib/auth/hooks/use-session-recovery';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { AUTH_ERRORS } from '@/lib/auth/errors';
import Loading from '../ui/loading';
import type { BaseGuardProps } from '@/lib/auth/types';
import { useSessionPersistence } from '@/lib/auth/hooks/use-session-persistence';

interface ProtectedProps extends BaseGuardProps {
  requireVerification?: boolean;
}

const Protected = ({
  children,
  requireVerification = false,
  loadingClassName
}: ProtectedProps) => {
  const { user, isLoading, status } = useAuth();
  const { handleAuthError } = useAuthError();

  useSessionExpiry();
  useSessionRecovery();
  useSessionPersistence();

  React.useEffect(() => {
    try {
      if (status === 'unauthenticated') {
        throw AUTH_ERRORS.SESSION_REQUIRED;
      }

      if (requireVerification && user && !user.emailVerified) {
        throw AUTH_ERRORS.EMAIL_NOT_VERIFIED;
      }
    } catch (error) {
      handleAuthError(error as Error);
    }
  }, [status, user, requireVerification, handleAuthError]);

  if (isLoading) return <Loading className={loadingClassName} />;
  if (!user) return null;
  if (requireVerification && !user.emailVerified) return null;

  return (
    <ErrorBoundary
      FallbackComponent={AuthError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default Protected;
