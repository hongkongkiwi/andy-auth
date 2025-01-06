import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';
import { useAuth } from '../auth-context';

export const useSessionPermissions = () => {
  const { checkPermission } = usePermissions();
  const { session } = useAuth();

  const canViewSessions = useCallback(
    async (userId: string) => {
      // Users can view their own sessions
      if (session?.user?.id === userId) return true;

      // Platform admins can view all sessions
      return checkPermission(PermissionType.PLATFORM_ADMIN);
    },
    [session, checkPermission]
  );

  const canRevokeSessions = useCallback(
    async (userId: string) => {
      // Users can revoke their own sessions
      if (session?.user?.id === userId) return true;

      // Platform admins can revoke any session
      return checkPermission(PermissionType.PLATFORM_ADMIN);
    },
    [session, checkPermission]
  );

  const canManageMFA = useCallback(
    async (userId: string) => {
      // Users can manage their own MFA
      if (session?.user?.id === userId) return true;

      // Platform admins can manage MFA for any user
      return checkPermission(PermissionType.PLATFORM_ADMIN);
    },
    [session, checkPermission]
  );

  return {
    canViewSessions,
    canRevokeSessions,
    canManageMFA
  };
};
