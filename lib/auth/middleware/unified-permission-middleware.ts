import { NextResponse, type NextRequest } from 'next/server';
import { enhance } from '@zenstackhq/runtime';
import { prisma } from '@/lib/db';
import { checkPermission } from '../services/permission-service';
import { PermissionType } from '@prisma/client';
import { AUTH_ERRORS } from '../errors';

interface UnifiedPermissionConfig {
  // High-level role-based permission
  rbac?: {
    type: PermissionType;
    resourceId?: string;
    allowInheritance?: boolean;
  };
  // Zenstack model-level permission
  model?: {
    name: string; // e.g., 'Post', 'Comment'
    operation: 'read' | 'create' | 'update' | 'delete';
  };
}

export const withUnifiedPermission = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: UnifiedPermissionConfig
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
      // 1. Check RBAC permissions first if configured
      if (config.rbac) {
        await checkPermission({
          userId,
          type: config.rbac.type,
          resourceId: config.rbac.resourceId,
          request: req
        });
      }

      // 2. Check Zenstack model permissions if configured
      if (config.model) {
        const db = enhance(prisma, { user: { id: userId } });
        const model = (db as any)[config.model.name.toLowerCase()];

        // Verify the model exists
        if (!model) {
          throw AUTH_ERRORS.BAD_REQUEST(`Invalid model: ${config.model.name}`, {
            context: 'withUnifiedPermission'
          });
        }

        // For read operations, we'll apply the filter in the handler
        if (config.model.operation !== 'read') {
          // For write operations, we can check access here
          const canAccess = await model.hasAccess(config.model.operation);
          if (!canAccess) {
            throw AUTH_ERRORS.PERMISSION_DENIED({
              context: 'withUnifiedPermission',
              permissionType: config.model.operation,
              resourceId: config.model.name
            });
          }
        }
      }

      // Both permission checks passed, enhance request with Zenstack db
      if (config.model) {
        const db = enhance(prisma, { user: { id: userId } });
        (req as any).zenstackDb = db;
      }

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

// Helper to create a handler with both RBAC and Zenstack permissions
export const createProtectedHandler = (
  config: UnifiedPermissionConfig,
  handler: (req: NextRequest & { zenstackDb?: any }) => Promise<NextResponse>
) => {
  return withUnifiedPermission(handler, config);
};
