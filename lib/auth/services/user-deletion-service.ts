import { prisma } from '@/lib/db';
import { sendEmail, EmailTemplate } from '@/lib/email/send-email';
import { createUserAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  PlatformUserStatus,
  WorkspacePermissionRole,
  EntityStatus
} from '@prisma/client';
import type { User } from 'better-auth/types';
import { AUTH_ERRORS } from '../errors';
import { handleAuthError } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import type { NextRequest } from 'next/server';
import prettyMs from 'pretty-ms';

const TIME = {
  HOUR: 60 * 60
};

export const sendDeleteAccountVerification = async (
  data: {
    user: User;
    url: string;
    token: string;
  },
  request?: Request
) => {
  let platformUser;
  try {
    platformUser = await prisma.platformUser.findUnique({
      where: { id: data.user.id },
      include: { personProfile: true }
    });

    if (!platformUser) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendDeleteAccountVerification',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: platformUser.emailAddress!,
      template: EmailTemplate.DELETE_ACCOUNT_VERIFICATION,
      data: {
        name: platformUser.personProfile?.firstName || 'User',
        deletionUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.ACCOUNT_DELETION * 1000, {
          verbose: true
        })
      }
    });

    await createUserAuditLog({
      userId: platformUser.id,
      eventType: AuditLogEventType.ACCOUNT_DELETION_REQUESTED,
      description: 'Account deletion verification sent',
      resourceId: platformUser.id,
      request: request as NextRequest | undefined,
      metadata: {
        email: platformUser.emailAddress,
        verificationSent: true
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: data.user.id,
      context: 'user-deletion',
      action: 'sendDeleteAccountVerification',
      request,
      metadata: {
        email: platformUser?.emailAddress
      }
    });
    throw handleAuthError(error);
  }
};

export const handleBeforeDelete = async (
  user: User,
  request?: Request
): Promise<void> => {
  let platformUser;
  try {
    platformUser = await prisma.platformUser.findUnique({
      where: { id: user.id },
      include: {
        workspacePermissions: true,
        clientPermissions: true,
        locationPermissions: true,
        personProfile: true
      }
    });

    if (!platformUser) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'handleBeforeDelete',
        userId: user.id
      });
    }

    // First check if user owns any workspaces
    const ownedWorkspaces = await prisma.workspacePermission.findMany({
      where: {
        userId: user.id,
        role: WorkspacePermissionRole.OWNER
      },
      include: {
        workspace: {
          select: {
            name: true
          }
        }
      }
    });

    if (ownedWorkspaces.length > 0) {
      throw new Error(
        `Cannot delete user: They are the owner of ${ownedWorkspaces.length} workspace(s). ` +
          `Please transfer ownership of the following workspaces first: ` +
          ownedWorkspaces.map((wp) => wp.workspace.name).join(', ')
      );
    }

    await prisma.$transaction([
      // First promote admins to owners in affected workspaces
      prisma.workspacePermission.updateMany({
        where: {
          workspace: {
            permissions: {
              some: {
                userId: user.id,
                role: WorkspacePermissionRole.OWNER
              }
            }
          },
          role: WorkspacePermissionRole.ADMIN,
          NOT: {
            userId: user.id
          }
        },
        data: {
          role: WorkspacePermissionRole.OWNER
        }
      }),
      // Then delete user's permissions
      prisma.workspacePermission.deleteMany({
        where: { userId: user.id }
      }),
      prisma.clientPermission.deleteMany({
        where: { userId: user.id }
      }),
      prisma.locationPermission.deleteMany({
        where: { userId: user.id }
      }),
      prisma.platformUser.update({
        where: { id: user.id },
        data: {
          status: PlatformUserStatus.PENDING_DELETION,
          deletedAt: new Date(),
          deletedBy: user.id
        }
      })
    ]);
  } catch (error) {
    await logAuthError(error, {
      userId: user.id,
      context: 'user-deletion',
      action: 'handleBeforeDelete',
      request,
      metadata: {
        email: platformUser?.emailAddress,
        status: platformUser?.status
      }
    });
    throw handleAuthError(error);
  }
};

export const handleAfterDelete = async (user: User, request?: Request) => {
  let platformUser;
  try {
    platformUser = await prisma.platformUser.findUnique({
      where: { id: user.id },
      include: { personProfile: true }
    });

    if (!platformUser) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'handleAfterDelete',
        userId: user.id
      });
    }

    if (platformUser?.emailAddress) {
      await sendEmail({
        to: platformUser.emailAddress,
        template: EmailTemplate.ACCOUNT_DELETED_CONFIRMATION,
        data: {
          name: platformUser.personProfile?.firstName || 'User',
          email: platformUser.emailAddress,
          deletedAt: new Date().toISOString()
        }
      });
    }

    await createUserAuditLog({
      userId: user.id,
      eventType: AuditLogEventType.ACCOUNT_DELETED,
      description: 'User account deleted',
      resourceId: user.id,
      request: request as NextRequest | undefined,
      metadata: {
        reason: 'Account deleted',
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: user.id,
      context: 'user-deletion',
      action: 'handleAfterDelete',
      request,
      metadata: {
        email: platformUser?.emailAddress,
        deletedAt: new Date().toISOString()
      }
    });
    throw handleAuthError(error);
  }
};
