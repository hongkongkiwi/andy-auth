'use client';

import { useState, useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { hasPermission } from '@/components/layout/Navigation/utils';
import { CAN_MANAGE_UI } from '@/lib/constants/permissions';

export interface CollapsedState {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
}

export const useCollapsedState = (
  permissions: { type: PermissionType }[]
): CollapsedState => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    // Only allow toggle if user has appropriate permissions
    if (canManageLayout(permissions)) {
      setIsCollapsed((prev) => !prev);
    }
  }, [permissions]);

  return {
    isCollapsed,
    setIsCollapsed: (value: boolean) => {
      if (canManageLayout(permissions)) {
        setIsCollapsed(value);
      }
    },
    toggleCollapsed
  };
};

const canManageLayout = (permissions: { type: PermissionType }[]) => {
  return permissions.some((p) => CAN_MANAGE_UI.includes(p.type));
};
