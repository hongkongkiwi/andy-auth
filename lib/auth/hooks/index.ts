/**
 * Authentication and workspace management hooks
 * @module auth/hooks
 */

// Core Authentication
export { useAuth } from './auth/use-auth';
export { useAuthState } from './auth/use-auth-state';
export { useAuthError } from './auth/use-auth-error';

// Types
export type {
  LoginCredentials,
  UseAuthReturn,
  UseAuthStateReturn,
  UseAuthErrorReturn
} from './auth/types';

// Session Management
export { useSessionExpiry } from './session/use-session-expiry';
export { useSessionRecovery } from './session/use-session-recovery';
export { useSessionPersistence } from './session/use-session-persistence';

// Workspace Management
export { useWorkspace } from './workspace/use-workspace';
export { useWorkspaceState } from './workspace/use-workspace-state';
export { useWorkspacePermissions } from './workspace/use-workspace-permissions';
export { useWorkspacePersistence } from './workspace/use-workspace-persistence';

// Permission Management
export { usePermissions } from './permissions/use-permissions';
