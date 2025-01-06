import { PermissionType } from '@prisma/client';
import type { UnifiedPermissionConfig } from '../middleware/unified-permission-middleware';

export const createModelPermission = (
  modelName: string,
  operation: 'read' | 'create' | 'update' | 'delete'
) => ({
  model: {
    name: modelName,
    operation
  }
});

export const createWorkspacePermission = (
  type: PermissionType,
  workspaceId: string
) => ({
  rbac: {
    type,
    resourceId: workspaceId,
    allowInheritance: true
  }
});

export const combinePermissions = (
  modelPermission: UnifiedPermissionConfig['model'],
  rbacPermission: UnifiedPermissionConfig['rbac']
): UnifiedPermissionConfig => ({
  model: modelPermission,
  rbac: rbacPermission
});

// Helper for common workspace + model permission combinations
export const createWorkspaceModelPermission = (
  workspaceId: string,
  modelName: string,
  operation: 'read' | 'create' | 'update' | 'delete'
): UnifiedPermissionConfig => {
  const permissionType = getPermissionTypeForOperation(operation);

  return combinePermissions(
    createModelPermission(modelName, operation).model,
    createWorkspacePermission(permissionType, workspaceId).rbac
  );
};

// Maps CRUD operations to appropriate permission types
const getPermissionTypeForOperation = (
  operation: 'read' | 'create' | 'update' | 'delete'
): PermissionType => {
  switch (operation) {
    case 'read':
      return PermissionType.WORKSPACE_VIEWER;
    case 'create':
    case 'update':
      return PermissionType.WORKSPACE_EDITOR;
    case 'delete':
      return PermissionType.WORKSPACE_ADMIN;
    default:
      return PermissionType.WORKSPACE_VIEWER;
  }
};
