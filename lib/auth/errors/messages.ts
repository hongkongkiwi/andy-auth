import { AuthErrorCode } from './codes';

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode | string, string> = {
  // Authentication
  [AuthErrorCode.AUTHENTICATION_FAILED]: 'Authentication failed',
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [AuthErrorCode.SESSION_REQUIRED]: 'Authentication required',

  // Workspace
  [AuthErrorCode.WORKSPACE_ACCESS_DENIED]: 'Access to workspace denied',
  [AuthErrorCode.WORKSPACE_STATE_ERROR]: 'Workspace state error',
  [AuthErrorCode.INVALID_WORKSPACE]: 'Invalid workspace',

  // Permissions
  [AuthErrorCode.PERMISSION_DENIED]: 'Permission denied',

  // User
  [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email verification required',

  // Validation
  [AuthErrorCode.INVALID_EMAIL]: 'Please enter a valid email address',
  [AuthErrorCode.INVALID_PASSWORD]: 'Password must be at least 6 characters',

  // Rate Limiting
  [AuthErrorCode.RATE_LIMITED]: 'Too many attempts, please try again later',
  [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Too many attempts',

  // Verification
  [AuthErrorCode.VERIFICATION_FAILED]: 'Verification failed',
  [AuthErrorCode.VERIFICATION_ERROR]: 'Verification error',
  [AuthErrorCode.VERIFICATION_EXPIRED]: 'Verification token has expired',

  // Default messages
  Default: 'An unexpected error occurred',
  CredentialsSignin: 'Invalid email or password',

  // Additional messages
  [AuthErrorCode.ACCOUNT_LOCKED]: 'Account is locked',
  [AuthErrorCode.INVALID_CODE]: 'Invalid verification code',
  [AuthErrorCode.CODE_EXPIRED]: 'Verification code has expired',
  [AuthErrorCode.INVALID_USER_DATA]: 'Invalid user data provided',

  // New messages
  [AuthErrorCode.TOKEN_EXPIRED]: 'Verification token has expired',
  [AuthErrorCode.TOKEN_INVALID]: 'Invalid verification token',
  [AuthErrorCode.TOKEN_NOT_FOUND]: 'Verification token not found',
  [AuthErrorCode.TOKEN_ALREADY_USED]:
    'Verification token has already been used',
  [AuthErrorCode.INVALID_TOKEN_TYPE]: 'Invalid verification token type',
  [AuthErrorCode.TOKEN_GENERATION_FAILED]:
    'Failed to generate verification token',
  [AuthErrorCode.RATE_LIMIT_EXCEEDED]:
    'Rate limit exceeded, please try again later',
  [AuthErrorCode.INVALID_IDENTIFIER]: 'Invalid email or phone number'
} as const;
