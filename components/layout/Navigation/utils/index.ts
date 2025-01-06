import { PermissionType } from '@prisma/client';

export const hasPermission = (
  permissions: { type: PermissionType }[],
  requiredType: PermissionType
): boolean => {
  return permissions.some(
    (p) => p.type === requiredType || p.type === 'PLATFORM_ADMIN'
  );
};

export const getHighestPermission = (
  scope: 'WORKSPACE' | 'CLIENT' | 'LOCATION',
  permissions: { type: PermissionType }[]
): 'ADMIN' | 'EDITOR' | 'VIEWER' | null => {
  const prefix = `${scope}_` as const;
  if (hasPermission(permissions, 'PLATFORM_ADMIN')) return 'ADMIN';
  if (hasPermission(permissions, `${prefix}ADMIN` as PermissionType))
    return 'ADMIN';
  if (hasPermission(permissions, `${prefix}EDITOR` as PermissionType))
    return 'EDITOR';
  if (hasPermission(permissions, `${prefix}VIEWER` as PermissionType))
    return 'VIEWER';
  return null;
};

export const canAccessScope = (
  scope: 'WORKSPACE' | 'CLIENT' | 'LOCATION',
  permissions: { type: PermissionType }[]
): boolean => {
  return getHighestPermission(scope, permissions) !== null;
};
