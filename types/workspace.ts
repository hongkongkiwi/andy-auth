import type {
  WorkspaceStatus,
  WorkspacePermissionType,
  ClientPermissionType
} from '@prisma/client';

export interface BaseWorkspace {
  id: string;
  displayName: string;
  slug: string;
  status: WorkspaceStatus;
  imageUrl?: string | null;
  companyName?: string | null;
}

export interface WorkspaceWithPermissions extends BaseWorkspace {
  permissions: WorkspacePermissionType[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  lastModifiedBy?: string | null;
  notes?: string | null;
}

export interface Client {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string | null;
  workspaceId: string;
  permissions: ClientPermissionType[];
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  status: 'active' | 'inactive';
}

export type WorkspaceVisibility = 'full' | 'limited' | 'none';

export type { WorkspaceStatus, WorkspacePermissionType, ClientPermissionType };
