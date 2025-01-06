import { useCallback } from 'react';
import { usePermissions } from './usePermissions';
import { enhance } from '@zenstackhq/runtime';
import { prisma } from '@/lib/db';
import { useAuth } from '../auth-context';
import type { PermissionType } from '@prisma/client';

export const useUnifiedPermissions = () => {
  const { checkPermission } = usePermissions();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const checkUnifiedPermission = useCallback(
    async ({
      rbac,
      model
    }: {
      rbac?: {
        type: PermissionType;
        resourceId?: string;
      };
      model?: {
        name: string;
        operation: 'read' | 'create' | 'update' | 'delete';
      };
    }) => {
      if (!userId) return false;

      // Check RBAC first if configured
      if (rbac) {
        const hasRbacPermission = await checkPermission(
          rbac.type,
          rbac.resourceId
        );
        if (!hasRbacPermission) return false;
      }

      // Check Zenstack permissions if configured
      if (model) {
        const db = enhance(prisma, { user: { id: userId } });
        const modelInstance = (db as any)[model.name.toLowerCase()];

        if (!modelInstance) {
          console.error(`Invalid model: ${model.name}`);
          return false;
        }

        const hasModelPermission = await modelInstance.hasAccess(
          model.operation
        );
        if (!hasModelPermission) return false;
      }

      return true;
    },
    [userId, checkPermission]
  );

  return { checkUnifiedPermission };
};
