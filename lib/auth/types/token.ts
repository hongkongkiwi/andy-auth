import type { DefaultJWT } from '@auth/core/jwt';
import type { PlatformUserStatus } from '@zenstackhq/runtime/models';
import { PlatformUserStatus as PlatformUserStatusEnum } from '@prisma/client';
import { AuthMethod } from '../types/auth';
import type { WorkspaceWithPermissions } from './workspace';

// Define base token type that includes NextAuth fields
export type BaseToken = {
  sub?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
};

// Define our extended JWT type
export interface JWT extends DefaultJWT {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  phoneNumber: string | null;
  phoneVerified: Date | null;
  userStatus: PlatformUserStatus;
  workspaces: WorkspaceWithPermissions[];
  authMethod: AuthMethod;
  selectedWorkspaceId: string | null;
}

// Type for incoming token data
export type TokenInput = {
  sub?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  phoneNumber?: string | null;
  phoneVerified?: Date | null;
  userStatus?: PlatformUserStatus;
  workspaces?: WorkspaceWithPermissions[];
  authMethod?: AuthMethod;
  selectedWorkspaceId?: string | null;
};

// Update default values to match the type
export const DEFAULT_TOKEN_VALUES: {
  id: string;
  name: null;
  email: null;
  emailVerified: null;
  image: null;
  phoneNumber: null;
  phoneVerified: null;
  userStatus: PlatformUserStatus;
  workspaces: WorkspaceWithPermissions[];
  authMethod: AuthMethod;
  selectedWorkspaceId: null;
} = {
  id: '',
  name: null,
  email: null,
  emailVerified: null,
  image: null,
  phoneNumber: null,
  phoneVerified: null,
  userStatus: PlatformUserStatusEnum.ACTIVE,
  workspaces: [],
  authMethod: AuthMethod.EMAIL,
  selectedWorkspaceId: null
} as const;

// Type guard for token workspaces
export const isWorkspaceArray = (
  value: unknown
): value is WorkspaceWithPermissions[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item): item is WorkspaceWithPermissions =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'permissions' in item
    )
  );
};
