import { createAuthClient } from 'better-auth/react';
import { logAuthError } from './utils/error-logging';
import type { APIError } from 'better-auth';
import type { JsonValue } from './types/types';

export interface AuthClient {
  id: string;
  name: string;
  secret: string;
  redirectUris: string[];
  metadata?: JsonValue;
}

export interface ClientConfig {
  baseURL: string;
  cookieName: string;
  onError?: (error: APIError) => void;
}

const config: ClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  cookieName: 'auth_session',
  onError: (error) => {
    logAuthError(error, {
      context: 'auth-client',
      action: 'auth-operation'
    });
  }
};

export const authClient = createAuthClient(config);

export const { signIn, signOut, useSession } = authClient;

// Type-safe hook for session
export const useAuth = () => {
  const { data: session, isPending: isLoading, ...rest } = useSession();

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading,
    ...rest
  };
};
