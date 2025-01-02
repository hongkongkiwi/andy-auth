import type { Session } from 'next-auth';

// Shared auth status type
export interface AuthStatus {
  isLoading: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

// Shared auth user type
export interface AuthUser {
  user: Session['user'] | null;
}
