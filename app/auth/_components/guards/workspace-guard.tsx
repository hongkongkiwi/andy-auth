'use client';

import * as React from 'react';
import { WorkspacePermissionType } from '.prisma/client';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { usePermissions } from '@/lib/auth/hooks/use-permissions';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import Loading from '../ui/loading';
import type { BaseGuardProps } from '@/lib/auth/types';

interface WorkspaceGuardProps extends BaseGuardProps {
  workspaceId: string;
  requiredPermissions?: WorkspacePermissionType[];
}

export const WorkspaceGuard = ({
  children,
  workspaceId,
  requiredPermissions = [WorkspacePermissionType.READ],
  loadingClassName
}: WorkspaceGuardProps) => {
  const { checkWorkspacePermissions, isLoading } = usePermissions(workspaceId);
  const { handleAuthError } = useAuthError();

  React.useEffect(() => {
    if (!isLoading) {
      try {
        checkWorkspacePermissions(requiredPermissions);
      } catch (error) {
        handleAuthError(error as Error);
      }
    }
  }, [
    workspaceId,
    requiredPermissions,
    checkWorkspacePermissions,
    isLoading,
    handleAuthError
  ]);

  if (isLoading) return <Loading className={loadingClassName} />;

  return (
    <ErrorBoundary
      FallbackComponent={AuthError}
      onError={handleAuthError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
};
