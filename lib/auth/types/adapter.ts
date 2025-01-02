import type {
  Adapter as NextAuthAdapter,
  AdapterUser as BaseAdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken
} from '@auth/core/adapters';
import type {
  PlatformUserStatus,
  WorkspacePermissionType,
  WorkspaceStatus
} from '@zenstackhq/runtime/models';
import type { AuthMethod } from './auth';
import type { WorkspaceWithPermissions } from './workspace';

// Re-export adapter types from @auth/core
export type { AdapterAccount, AdapterSession, VerificationToken };

// Extend the base user type with our custom fields
export interface AdapterUser extends BaseAdapterUser {
  // Required fields from base type
  id: string;
  email: string;
  emailVerified: Date | null;

  // Our custom fields
  phoneNumber: string | null;
  phoneVerified: Date | null;
  userStatus: PlatformUserStatus;
  workspaces: readonly WorkspaceWithPermissions[];
  personProfile: {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  } | null;
  authMethod: AuthMethod;
  selectedWorkspaceId: string | null;
}

// Export the full adapter type
export interface Adapter extends NextAuthAdapter {}
