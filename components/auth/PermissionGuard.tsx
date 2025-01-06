'use client';

import { PermissionType } from '@prisma/client';
import { hasPermission } from '@/components/layout/Navigation/utils';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: { type: PermissionType }[];
  requiredPermission: PermissionType;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  children,
  permissions,
  requiredPermission,
  fallback = null
}: PermissionGuardProps) => {
  const allowed = hasPermission(permissions, requiredPermission);
  return allowed ? <>{children}</> : <>{fallback}</>;
};
