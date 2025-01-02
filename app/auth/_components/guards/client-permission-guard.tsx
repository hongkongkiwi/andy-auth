'use client';

import * as React from 'react';
import type { ClientPermissionType } from '@zenstackhq/runtime/models';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { usePermissions } from '@/lib/auth/hooks/use-permissions';
import Loading from '../ui/loading';
import type { BaseGuardProps } from '@/lib/auth/types';

interface ClientPermissionGuardProps extends BaseGuardProps {
  clientId: string;
  requiredPermissions?: ClientPermissionType[];
}

export const ClientPermissionGuard = ({
  children,
  clientId,
  requiredPermissions = ['read' as ClientPermissionType],
  loadingClassName
}: ClientPermissionGuardProps) => {
  const { checkClientPermissions, isLoading } = usePermissions(clientId);

  React.useEffect(() => {
    if (!isLoading) {
      checkClientPermissions(requiredPermissions);
    }
  }, [clientId, requiredPermissions, checkClientPermissions, isLoading]);

  if (isLoading) return <Loading className={loadingClassName} />;

  return (
    <ErrorBoundary
      FallbackComponent={AuthError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ClientPermissionGuard;
