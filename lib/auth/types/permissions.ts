import type { Role } from '@prisma/client';

// Core permission types
export type ModelName = 'workspace' | 'client' | 'patrol' | 'incident' | 'user';

export type Operation = 'create' | 'read' | 'update' | 'delete';

export interface PermissionCheck {
  model: ModelName;
  operation: Operation;
  data?: Record<string, unknown>;
}

export interface RoleCheck {
  role: Role;
  resourceId: string;
}

export interface PermissionResult {
  granted: boolean;
  reason?: string;
}

export type { Role };
