import { prisma } from '@/lib/db';
import { AUTH_ERRORS } from '../errors';
import { createAuditLog } from './audit-service';
import {
  PermissionType,
  Permission,
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';

interface CheckPermissionOptions {
  userId: string;
  type: PermissionType;
  resourceId?: string;
  request?: Request;
}

export const checkPermission = async (options: CheckPermissionOptions) => {
  const { userId, type, resourceId, request } = options;

  const permission = await prisma.permission.findFirst({
    where: {
      userId,
      type,
      OR: resourceId
        ? [
            { workspaceId: resourceId },
            { clientId: resourceId },
            { locationId: resourceId }
          ]
        : undefined
    }
  });

  if (!permission) {
    await createAuditLog({
      userId,
      eventType: AuditLogEventType.ACCESS_DENIED,
      description: `Permission check failed for ${type}`,
      resourceType: AuditLogResourceType.PERMISSION,
      resourceId: resourceId || 'unknown',
      tableName: 'permission',
      severity: AuditSeverityLevel.WARNING,
      metadata: {
        permissionType: type,
        resourceId
      }
    });

    throw AUTH_ERRORS.PERMISSION_DENIED({
      context: 'checkPermission',
      permissionType: type,
      resourceId
    });
  }

  // Update last accessed
  await prisma.permission.update({
    where: { id: permission.id },
    data: { lastAccessedAt: new Date() }
  });

  return permission;
};

// Helper to check if user has platform admin access
export const isPlatformAdmin = async (userId: string): Promise<boolean> => {
  const permission = await prisma.permission.findFirst({
    where: {
      userId,
      type: PermissionType.PLATFORM_ADMIN
    }
  });
  return !!permission;
};

// Helper to get all permissions for a user
export const getUserPermissions = async (userId: string) => {
  return prisma.permission.findMany({
    where: { userId }
  });
};

// Workspace permission helpers
export const checkWorkspacePermission = async (
  userId: string,
  workspaceId: string,
  type: PermissionType
) => {
  return checkPermission({ userId, type, resourceId: workspaceId });
};

// Client permission helpers
export const checkClientPermission = async (
  userId: string,
  clientId: string,
  type: PermissionType
) => {
  return checkPermission({ userId, type, resourceId: clientId });
};

// Location permission helpers
export const checkLocationPermission = async (
  userId: string,
  locationId: string,
  type: PermissionType
) => {
  return checkPermission({ userId, type, resourceId: locationId });
};

// Get all permissions for a specific resource
export const getResourcePermissions = async (
  resourceId: string,
  type: 'workspace' | 'client' | 'location'
) => {
  return prisma.permission.findMany({
    where: {
      OR: [
        { workspaceId: type === 'workspace' ? resourceId : undefined },
        { clientId: type === 'client' ? resourceId : undefined },
        { locationId: type === 'location' ? resourceId : undefined }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          emailAddress: true
        }
      }
    }
  });
};

// Check if user has any permission for a resource
export const hasAnyPermission = async (
  userId: string,
  resourceId: string
): Promise<boolean> => {
  const permission = await prisma.permission.findFirst({
    where: {
      userId,
      OR: [
        { workspaceId: resourceId },
        { clientId: resourceId },
        { locationId: resourceId }
      ]
    }
  });
  return !!permission;
};
