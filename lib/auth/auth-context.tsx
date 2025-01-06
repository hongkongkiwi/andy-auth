'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode
} from 'react';
import { authClient } from './client';
import { AUTH_ERRORS, handleAuthError } from './errors';
import { toast, Toaster } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { APIError } from 'better-auth/api';
import { ROUTES } from './config/routes';
import type { AuthUser } from './types';

// Move these interfaces from types/index.ts to here
type AuthSession = typeof authClient.useSession extends () => { data: infer T }
  ? T
  : never;

interface AuthState {
  session: AuthSession;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  handleError: (error: unknown) => void;
  signOut: (options?: { redirect?: string }) => Promise<void>;
  signIn: typeof authClient.signIn;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  loginPath?: string;
  onAuthStateChange?: (state: AuthState) => void;
}

export const AuthProvider = React.memo(
  ({
    children,
    fallback,
    requireAuth = false,
    loginPath = ROUTES.SIGN_IN.BASE,
    onAuthStateChange
  }: AuthProviderProps): React.ReactNode => {
    const {
      data: session,
      isPending: isLoading,
      error
    } = authClient.useSession();
    const router = useRouter();
    const isAuthenticated = Boolean(session);

    const handleError = (error: unknown): void => {
      try {
        handleAuthError(error);
      } catch (apiError) {
        if (apiError instanceof APIError) {
          toast.error('Authentication Error', {
            description: apiError.message,
            duration: 5000,
            dismissible: true
          });
        }
      }
    };

    const signOut = async (options?: { redirect?: string }): Promise<void> => {
      try {
        await authClient.signOut();
        const redirectPath = options?.redirect ?? ROUTES.SIGN_IN.BASE;
        router.push(redirectPath);
      } catch (error) {
        handleError(
          AUTH_ERRORS.INTERNAL_ERROR({
            action: 'signOut',
            context: 'AuthProvider'
          })
        );
        router.push(ROUTES.AUTH.ERROR);
      }
    };

    useEffect(() => {
      const state: AuthState = { session, isLoading, error, isAuthenticated };
      onAuthStateChange?.(state);
    }, [session, isLoading, error, isAuthenticated, onAuthStateChange]);

    // Handle loading state
    if (isLoading) {
      return (
        fallback || (
          <div
            className="flex h-screen w-screen items-center justify-center"
            role="status"
          >
            <LoadingSpinner
              size="lg"
              aria-label="Loading authentication state"
              className="text-primary"
            />
          </div>
        )
      );
    }

    // Handle authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(loginPath);
      return fallback || null;
    }

    const value: AuthContextType = {
      session,
      isLoading,
      error,
      isAuthenticated,
      handleError,
      signOut,
      signIn: authClient.signIn
    };

    return (
      <AuthContext.Provider value={value}>
        <Toaster
          richColors
          position="top-right"
          closeButton
          expand
          visibleToasts={3}
          theme="system"
        />
        {children}
      </AuthContext.Provider>
    );
  }
);

AuthProvider.displayName = 'AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
