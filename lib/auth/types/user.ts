import type { PlatformUserStatus } from '@zenstackhq/runtime/models';
import type { WorkspaceWithPermissions } from './workspace';
import type { AuthMethod } from './auth';

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  phoneNumber: string | null;
  phoneVerified: Date | null;
  userStatus: PlatformUserStatus;
  workspaces: WorkspaceWithPermissions[];
  selectedWorkspaceId: string | null;
  authMethod: AuthMethod;
  languageLocale: string;
  timezone: string;
}
