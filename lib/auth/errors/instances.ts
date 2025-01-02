import { AuthError } from './auth-error';
import { AuthErrorCode } from './codes';
import { AUTH_ERROR_STATUS_CODES } from './status-codes';

export type AuthErrors = {
  readonly INVALID_CREDENTIALS: AuthError;
  readonly AUTHENTICATION_FAILED: AuthError;
  readonly SESSION_REQUIRED: AuthError;
  readonly EMAIL_NOT_VERIFIED: AuthError;
  readonly WORKSPACE_ACCESS_DENIED: AuthError;
  readonly USER_NOT_FOUND: AuthError;
  readonly VERIFICATION_FAILED: AuthError;
  readonly TOO_MANY_ATTEMPTS: AuthError;
  readonly ACCOUNT_LOCKED: AuthError;
  readonly INVALID_CODE: AuthError;
  readonly CODE_EXPIRED: AuthError;
  readonly AUTH_REQUIRED: AuthError;
  readonly TOKEN_EXPIRED: AuthError;
  readonly TOKEN_INVALID: AuthError;
  readonly TOKEN_NOT_FOUND: AuthError;
  readonly TOKEN_ALREADY_USED: AuthError;
  readonly INVALID_TOKEN_TYPE: AuthError;
  readonly TOKEN_GENERATION_FAILED: AuthError;
  readonly RATE_LIMIT_EXCEEDED: AuthError;
  readonly INVALID_IDENTIFIER: AuthError;
};

export const AUTH_ERRORS: AuthErrors = {
  INVALID_CREDENTIALS: new AuthError(AuthErrorCode.INVALID_CREDENTIALS, {
    message: 'Invalid credentials',
    statusCode: AUTH_ERROR_STATUS_CODES.INVALID_CREDENTIALS
  }),
  AUTHENTICATION_FAILED: new AuthError(AuthErrorCode.AUTHENTICATION_FAILED, {
    message: 'Authentication failed',
    statusCode: AUTH_ERROR_STATUS_CODES.AUTHENTICATION_FAILED
  }),
  SESSION_REQUIRED: new AuthError(AuthErrorCode.SESSION_REQUIRED, {
    message: 'Authentication required',
    statusCode: AUTH_ERROR_STATUS_CODES.SESSION_REQUIRED
  }),
  EMAIL_NOT_VERIFIED: new AuthError(AuthErrorCode.EMAIL_NOT_VERIFIED, {
    message: 'Email verification required',
    statusCode: AUTH_ERROR_STATUS_CODES.EMAIL_NOT_VERIFIED
  }),
  WORKSPACE_ACCESS_DENIED: new AuthError(
    AuthErrorCode.WORKSPACE_ACCESS_DENIED,
    {
      message: 'Access to workspace denied',
      statusCode: AUTH_ERROR_STATUS_CODES.WORKSPACE_ACCESS_DENIED
    }
  ),
  USER_NOT_FOUND: new AuthError(AuthErrorCode.USER_NOT_FOUND, {
    message: 'User not found',
    statusCode: AUTH_ERROR_STATUS_CODES.USER_NOT_FOUND
  }),
  VERIFICATION_FAILED: new AuthError(AuthErrorCode.VERIFICATION_FAILED, {
    message: 'Verification failed',
    statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_FAILED
  }),
  TOO_MANY_ATTEMPTS: new AuthError(AuthErrorCode.TOO_MANY_ATTEMPTS, {
    message: 'Too many failed attempts. Please try again later.',
    statusCode: AUTH_ERROR_STATUS_CODES.TOO_MANY_ATTEMPTS
  }),
  ACCOUNT_LOCKED: new AuthError(AuthErrorCode.ACCOUNT_LOCKED, {
    message: 'Account is locked',
    statusCode: AUTH_ERROR_STATUS_CODES.ACCOUNT_LOCKED
  }),
  INVALID_CODE: new AuthError(AuthErrorCode.INVALID_CODE, {
    message: 'Invalid verification code',
    statusCode: AUTH_ERROR_STATUS_CODES.INVALID_CODE
  }),
  CODE_EXPIRED: new AuthError(AuthErrorCode.CODE_EXPIRED, {
    message: 'Verification code has expired',
    statusCode: AUTH_ERROR_STATUS_CODES.CODE_EXPIRED
  }),
  AUTH_REQUIRED: new AuthError(AuthErrorCode.AUTH_REQUIRED, {
    message: 'Authentication required to access this resource',
    statusCode: AUTH_ERROR_STATUS_CODES.AUTH_REQUIRED
  }),
  TOKEN_EXPIRED: new AuthError(AuthErrorCode.TOKEN_EXPIRED, {
    message: 'Verification token has expired',
    statusCode: AUTH_ERROR_STATUS_CODES.TOKEN_EXPIRED
  }),
  TOKEN_INVALID: new AuthError(AuthErrorCode.TOKEN_INVALID, {
    message: 'Invalid verification token',
    statusCode: AUTH_ERROR_STATUS_CODES.TOKEN_INVALID
  }),
  TOKEN_NOT_FOUND: new AuthError(AuthErrorCode.TOKEN_NOT_FOUND, {
    message: 'Verification token not found',
    statusCode: AUTH_ERROR_STATUS_CODES.TOKEN_NOT_FOUND
  }),
  TOKEN_ALREADY_USED: new AuthError(AuthErrorCode.TOKEN_ALREADY_USED, {
    message: 'Verification token has already been used',
    statusCode: AUTH_ERROR_STATUS_CODES.TOKEN_ALREADY_USED
  }),
  INVALID_TOKEN_TYPE: new AuthError(AuthErrorCode.INVALID_TOKEN_TYPE, {
    message: 'Invalid verification token type',
    statusCode: AUTH_ERROR_STATUS_CODES.INVALID_TOKEN_TYPE
  }),
  TOKEN_GENERATION_FAILED: new AuthError(
    AuthErrorCode.TOKEN_GENERATION_FAILED,
    {
      message: 'Failed to generate verification token',
      statusCode: AUTH_ERROR_STATUS_CODES.TOKEN_GENERATION_FAILED
    }
  ),
  RATE_LIMIT_EXCEEDED: new AuthError(AuthErrorCode.RATE_LIMIT_EXCEEDED, {
    message: 'Rate limit exceeded, please try again later',
    statusCode: AUTH_ERROR_STATUS_CODES.RATE_LIMIT_EXCEEDED
  }),
  INVALID_IDENTIFIER: new AuthError(AuthErrorCode.INVALID_IDENTIFIER, {
    message: 'Invalid email or phone number',
    statusCode: AUTH_ERROR_STATUS_CODES.INVALID_IDENTIFIER
  })
} as const;
