import { AuthErrorCode } from './codes';

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    public details: {
      message?: string;
      error?: string;
      statusCode?: number;
    } = {}
  ) {
    super(details.message || code);
    this.name = 'AuthError';
  }
}

export interface AuthErrorContext {
  message?: string;
  email?: string;
  provider?: string;
  type?: string;
  userId?: string;
  sessionToken?: string;
  error?: string;
}
