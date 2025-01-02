'use client';

import * as React from 'react';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { AUTH_ERROR_MESSAGES } from '../types/auth-errors';

interface LoginViewPageProps {
  callbackUrl?: string;
  className?: string;
}

const LoginViewPage = ({ callbackUrl, className }: LoginViewPageProps) => {
  const { handleAuthError } = useAuthError();

  return (
    <ErrorBoundary FallbackComponent={AuthError} onError={handleAuthError}>
      {/* Your login UI */}
    </ErrorBoundary>
  );
};

export default LoginViewPage;
