// UI Components
export { default as AuthError } from './ui/auth-error';
export { default as AuthStatus } from './ui/auth-status';
export { default as Loading } from './ui/loading';

// Forms
export { default as LoginForm } from './forms/login-form';
export { default as SignOutButton } from './sign-out-button';
export { default as UserAuthForm } from './forms/user-auth-form';
export { default as GoogleAuthButton } from './google-auth-button';

// Guards
export { default as Protected } from './guards/protected';
export { WorkspaceGuard } from './guards/workspace-guard';
export { ClientPermissionGuard } from './guards/client-permission-guard';

// Verification
export { default as VerifyEmail } from './verification/verify-email';
export { VerifyPhone } from './verification/verify-phone';
export { VerificationLayout } from './verification/verification-layout';

// Providers
export { default as AuthProvider } from './auth-provider';
export { VerificationProvider } from './contexts/verification-context';

// Types
export type { AuthErrorType } from './types/auth-errors';
export type { BaseGuardProps } from './types/guard';
