import { NextResponse, type NextRequest } from 'next/server';
import {
  PermissionType,
  PlatformUserStatus,
  Prisma,
  EntityStatus
} from '@prisma/client';
import { prisma } from '@/lib/db';
import { AUTH_ERRORS } from '../errors';
import { createAuditLog } from '../services/audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';

interface PermissionConfig {
  type: PermissionType;
  resourceId?: string;
  allowInheritance?: boolean;
  requireActive?: boolean;
}

// Helper to get inherited permission types
const getInheritedTypes = (type: PermissionType): PermissionType[] => {
  switch (type) {
    case PermissionType.WORKSPACE_VIEWER:
      return [PermissionType.WORKSPACE_EDITOR, PermissionType.WORKSPACE_ADMIN];
    case PermissionType.WORKSPACE_EDITOR:
      return [PermissionType.WORKSPACE_ADMIN];
    case PermissionType.CLIENT_VIEWER:
      return [
        PermissionType.CLIENT_EDITOR,
        PermissionType.CLIENT_ADMIN,
        PermissionType.WORKSPACE_ADMIN
      ];
    case PermissionType.CLIENT_EDITOR:
      return [PermissionType.CLIENT_ADMIN, PermissionType.WORKSPACE_ADMIN];
    case PermissionType.LOCATION_VIEWER:
      return [
        PermissionType.LOCATION_EDITOR,
        PermissionType.LOCATION_ADMIN,
        PermissionType.CLIENT_ADMIN,
        PermissionType.WORKSPACE_ADMIN
      ];
    case PermissionType.LOCATION_EDITOR:
      return [
        PermissionType.LOCATION_ADMIN,
        PermissionType.CLIENT_ADMIN,
        PermissionType.WORKSPACE_ADMIN
      ];
    default:
      return [];
  }
};

// Updated type definition with optional relations
type PermissionWithRelations = Prisma.PermissionGetPayload<{
  include: {
    user: true;
    workspace: true;
    client: true;
    location: true;
  };
}>;

const checkPermission = async (
  userId: string,
  config: PermissionConfig,
  request?: NextRequest
): Promise<PermissionWithRelations> => {
  // First check if user is active if required
  if (config.requireActive) {
    const user = await prisma.platformUser.findUnique({
      where: { id: userId }
    });

    if (!user || user.status !== PlatformUserStatus.ACTIVE) {
      throw AUTH_ERRORS.INACTIVE_USER({
        userId,
        status: user?.status || PlatformUserStatus.INACTIVE
      });
    }
  }

  const types = config.allowInheritance
    ? [config.type, ...getInheritedTypes(config.type)]
    : [config.type];

  const permission = await prisma.permission.findFirstOrThrow({
    where: {
      userId,
      type: { in: types },
      OR: config.resourceId
        ? [
            { workspaceId: config.resourceId },
            { clientId: config.resourceId },
            { locationId: config.resourceId }
          ]
        : undefined
    },
    include: {
      user: true,
      workspace: config.resourceId || false,
      client: config.resourceId || false,
      location: config.resourceId || false
    }
  });

  if (!permission) {
    await createAuditLog({
      userId,
      eventType: AuditLogEventType.ACCESS_DENIED,
      description: `Permission check failed for ${config.type}`,
      resourceType: AuditLogResourceType.PERMISSION,
      resourceId: config.resourceId || 'unknown',
      tableName: 'permission',
      severity: AuditSeverityLevel.WARNING,
      metadata: {
        requiredPermission: config.type,
        resourceId: config.resourceId,
        allowedTypes: types,
        request: request
          ? {
              method: request.method,
              url: request.url,
              headers: Object.fromEntries(request.headers)
            }
          : undefined
      }
    });

    throw AUTH_ERRORS.PERMISSION_DENIED({
      context: 'checkPermission',
      permissionType: config.type,
      resourceId: config.resourceId
    });
  }

  // Check if resource is active
  if (config.resourceId) {
    type ResourceWithStatus = {
      id: string;
      name: string;
      status: EntityStatus;
    };

    const resource = (permission.workspace ||
      permission.client ||
      permission.location) as ResourceWithStatus | null;
    if (resource && resource.status !== EntityStatus.ACTIVE) {
      throw AUTH_ERRORS.INACTIVE_RESOURCE({
        resourceId: config.resourceId,
        resourceType: permission.workspace
          ? 'workspace'
          : permission.client
            ? 'client'
            : permission.location
              ? 'location'
              : 'platform',
        status: resource.status
      });
    }
  }

  // Update last accessed
  await prisma.permission.update({
    where: { id: permission.id },
    data: { lastAccessedAt: new Date() }
  });

  return permission;
};

export const withPermission = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: PermissionConfig
) => {
  return async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    try {
      const permission = await checkPermission(userId, config, req);

      // Add permission context to request
      req.headers.set('x-permission-type', permission.type);
      req.headers.set('x-permission-id', permission.id);
      req.headers.set(
        'x-resource-type',
        permission.workspace
          ? 'workspace'
          : permission.client
            ? 'client'
            : permission.location
              ? 'location'
              : 'platform'
      );

      return handler(req);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message, code: 'PERMISSION_DENIED' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'Permission denied', code: 'PERMISSION_DENIED' },
        { status: 403 }
      );
    }
  };
};

// Convenience wrappers with inheritance enabled by default
export const withPlatformAdmin = (
  handler: (req: NextRequest) => Promise<NextResponse>
) =>
  withPermission(handler, {
    type: PermissionType.PLATFORM_ADMIN,
    allowInheritance: true,
    requireActive: true
  });

export const withWorkspaceAdmin = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  workspaceId: string
) =>
  withPermission(handler, {
    type: PermissionType.WORKSPACE_ADMIN,
    resourceId: workspaceId,
    allowInheritance: true,
    requireActive: true
  });

export const withClientAdmin = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  clientId: string
) =>
  withPermission(handler, {
    type: PermissionType.CLIENT_ADMIN,
    resourceId: clientId,
    allowInheritance: true,
    requireActive: true
  });

export const withLocationAdmin = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  locationId: string
) =>
  withPermission(handler, {
    type: PermissionType.LOCATION_ADMIN,
    resourceId: locationId,
    allowInheritance: true,
    requireActive: true
  });

export const withWorkspaceViewer = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  workspaceId: string
) =>
  withPermission(handler, {
    type: PermissionType.WORKSPACE_VIEWER,
    resourceId: workspaceId,
    allowInheritance: true,
    requireActive: true
  });

export const withClientViewer = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  clientId: string
) =>
  withPermission(handler, {
    type: PermissionType.CLIENT_VIEWER,
    resourceId: clientId,
    allowInheritance: true,
    requireActive: true
  });

export const withLocationViewer = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  locationId: string
) =>
  withPermission(handler, {
    type: PermissionType.LOCATION_VIEWER,
    resourceId: locationId,
    allowInheritance: true,
    requireActive: true
  });

export const withPlatformUser = (
  handler: (req: NextRequest) => Promise<NextResponse>
) =>
  withPermission(handler, {
    type: PermissionType.PLATFORM_USER,
    allowInheritance: true,
    requireActive: true
  });

export const checkClientPermission = async (
  userId: string,
  clientId: string,
  type: PermissionType
) => {
  return checkPermission(userId, {
    type,
    resourceId: clientId,
    allowInheritance: true,
    requireActive: true
  });
};
