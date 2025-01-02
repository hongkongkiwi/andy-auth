import type { Session } from 'next-auth';
import type { AuthMethod } from '../../types';

// Shared auth types
export interface AuthStatus {
  isLoading: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

export interface AuthUser {
  user: Session['user'] | null;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
  method?: AuthMethod;
}
