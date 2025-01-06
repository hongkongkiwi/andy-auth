import { PermissionType } from '@prisma/client';

export const PERMISSIONS = {
  PLATFORM: [PermissionType.PLATFORM_ADMIN, PermissionType.PLATFORM_USER],
  WORKSPACE: [
    PermissionType.WORKSPACE_ADMIN,
    PermissionType.WORKSPACE_EDITOR,
    PermissionType.WORKSPACE_VIEWER
  ],
  CLIENT: [
    PermissionType.CLIENT_ADMIN,
    PermissionType.CLIENT_EDITOR,
    PermissionType.CLIENT_VIEWER
  ],
  LOCATION: [
    PermissionType.LOCATION_ADMIN,
    PermissionType.LOCATION_EDITOR,
    PermissionType.LOCATION_VIEWER
  ]
} as const;

export const CAN_MANAGE_UI = [
  PermissionType.PLATFORM_ADMIN,
  PermissionType.WORKSPACE_ADMIN,
  PermissionType.WORKSPACE_EDITOR
] as const;
