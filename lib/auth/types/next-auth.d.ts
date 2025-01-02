import type { WorkspaceWithPermissions } from './workspace';
import type { PlatformUserStatus } from '@zenstackhq/runtime/models';
import type { AuthMethod } from './auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
    phoneNumber: string | null;
    phoneVerified: Date | null;
    userStatus: PlatformUserStatus;
    workspaces: readonly WorkspaceWithPermissions[];
    authMethod: AuthMethod;
    selectedWorkspaceId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    phoneNumber: string | null;
    phoneVerified: Date | null;
    userStatus: PlatformUserStatus;
    workspaces: readonly WorkspaceWithPermissions[];
    authMethod: AuthMethod;
    selectedWorkspaceId: string | null;
  }
}
