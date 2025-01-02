export type AuthErrorSeverity = 'error' | 'warning' | 'info';

export interface AuthErrorConfig {
  message: string;
  severity: AuthErrorSeverity;
}

export const AUTH_ERROR_MESSAGES = {
  // OAuth Errors
  OAuthSignin: 'Error connecting to provider',
  OAuthCallback: 'Error receiving provider response',
  OAuthCreateAccount: 'Error creating account',
  OAuthAccountNotLinked: 'Email already used with different provider',
  Callback: 'Error during authentication callback',
  AccessDenied: 'Access denied by provider',

  // Credential Errors
  CredentialsSignin: 'Invalid email or password',
  InvalidEmail: 'Please enter a valid email address',
  InvalidPassword: 'Password must be at least 6 characters',

  // General Errors
  Default: 'An error occurred during authentication',
  RateLimited: 'Too many attempts, please try again later'
} as const;

export type AuthErrorType = keyof typeof AUTH_ERROR_MESSAGES;
