import type { AuthMethod } from '../../types';
import type { AuthStatus, AuthUser } from '../types/auth';
import type { AuthError } from '../../errors';

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
  method?: AuthMethod;
}

export interface UseAuthReturn extends AuthStatus, AuthUser {}

export interface UseAuthStateReturn extends AuthStatus {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface UseAuthErrorReturn {
  handleAuthError: (error: AuthError | Error) => void;
}
