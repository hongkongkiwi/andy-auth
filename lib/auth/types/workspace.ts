import type {
  WorkspaceStatus,
  WorkspacePermissionType
} from '@zenstackhq/runtime/models';

export interface WorkspaceWithPermissions {
  id: string;
  displayName: string;
  imageUrl: string | null;
  status: WorkspaceStatus;
  slug: string;
  companyName: string;
  notes: string | null;
  permissions: readonly WorkspacePermissionType[];
}

// For backwards compatibility and clarity
export type Workspace = WorkspaceWithPermissions;
