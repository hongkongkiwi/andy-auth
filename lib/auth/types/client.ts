import type {
  ClientStatus,
  ClientPermissionType,
  Client as DbClient
} from '@zenstackhq/runtime/models';

// Use a subset of the DB Client model with permissions
export interface Client {
  id: string;
  workspaceId: string;
  displayName: string;
  imageUrl: string | null;
  status: ClientStatus;
  permissions: readonly ClientPermissionType[];
}
