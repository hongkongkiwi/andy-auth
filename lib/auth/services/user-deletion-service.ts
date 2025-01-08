import { transaction } from '@/lib/db/index';
import type { TransactionClient } from '@/lib/db/types';
import { sendEmail, EmailTemplate } from '@/lib/email/send-email';
import { createUserAuditLog } from './audit-service';
import {
  AuditLogEventType,
  UserStatus,
  EntityStatus,
  Role,
  Permission,
  AuditSeverityLevel
} from '@prisma/client';
import type { User } from 'better-auth/types';
import { AUTH_ERRORS } from '../errors';
import { handleAuthError } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import prettyMs from 'pretty-ms';
import { getProtectedDb } from '@/lib/db/index';
import { createServiceAuditLog } from './audit-service';
import { AuditLogResourceType } from '@prisma/client';
import { checkPermission, Operation } from '../utils/permissions';

const TIME = {
  HOUR: 60 * 60
};

interface DeleteUserData {
  user: {
    id: string;
  };
  url?: string;
  token?: string;
}

export const sendDeleteAccountVerification = async (
  data: {
    user: User;
    url: string;
    token: string;
  },
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: data.user.id },
      select: {
        id: true,
        email: true,
        userProfile: true,
        status: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        message: 'User not found',
        context: 'sendDeleteAccountVerification',
        metadata: { userId: data.user.id }
      });
    }

    if (!user.email) {
      throw AUTH_ERRORS.BAD_REQUEST('User has no email address', {
        context: 'sendDeleteAccountVerification',
        metadata: { userId: user.id }
      });
    }

    await sendEmail({
      to: user.email,
      template: EmailTemplate.DELETE_ACCOUNT_VERIFICATION,
      data: {
        name: user.userProfile?.firstName || 'User',
        deletionUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.ACCOUNT_DELETION * 1000, {
          verbose: true
        })
      }
    });

    await createUserAuditLog(
      {
        userId: user.id,
        eventType: AuditLogEventType.ACCOUNT_DELETION_REQUESTED,
        description: 'Account deletion verification sent',
        severity: AuditSeverityLevel.WARNING,
        metadata: {
          email: user.email,
          verificationSent: true,
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );
  });
};

export const handleBeforeDelete = async (user: User, request?: Request) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    try {
      const canDelete = await checkPermission(
        user.id,
        Operation.Delete,
        undefined
      );

      if (!canDelete) {
        throw AUTH_ERRORS.UNAUTHORIZED({
          message: 'User cannot be deleted',
          context: 'handleBeforeDelete',
          metadata: { userId: user.id }
        });
      }

      // Check if user owns any workspaces
      const workspaceMembers = await tx.resourceMember.findMany({
        where: {
          userId: user.id,
          role: Role.OWNER,
          workspaceId: { not: null }
        },
        include: {
          workspace: {
            select: {
              name: true,
              status: true
            }
          }
        }
      });

      const activeOwnedWorkspaces = workspaceMembers.filter(
        (member) => member.workspace?.status === EntityStatus.ACTIVE
      );

      if (activeOwnedWorkspaces.length > 0) {
        throw AUTH_ERRORS.BAD_REQUEST('User owns active workspaces', {
          context: 'handleBeforeDelete',
          metadata: {
            userId: user.id,
            workspaces: activeOwnedWorkspaces.map((m) => ({
              id: m.workspaceId,
              name: m.workspace?.name
            }))
          }
        });
      }

      // Update workspace permissions - transfer to admins
      await tx.resourceMember.updateMany({
        where: {
          workspaceId: { in: workspaceMembers.map((m) => m.workspaceId!) },
          role: Role.ADMIN,
          userId: { not: user.id }
        },
        data: {
          role: Role.OWNER,
          permissions: [
            Permission.WORKSPACE_SETTINGS,
            Permission.WORKSPACE_MEMBERS,
            Permission.WORKSPACE_BILLING,
            Permission.WORKSPACE_CLIENTS
          ]
        }
      });

      // Delete all user's permissions
      await tx.resourceMember.deleteMany({
        where: { userId: user.id }
      });

      // Delete all auth sessions
      await tx.authSession.deleteMany({
        where: { userId: user.id }
      });

      // Mark user for deletion
      await tx.user.update({
        where: { id: user.id },
        data: {
          status: UserStatus.PENDING_DELETION,
          deletedAt: new Date(),
          deletedBy: user.id
        }
      });

      await createServiceAuditLog(
        {
          userId: user.id,
          eventType: AuditLogEventType.ACCOUNT_DELETION_REQUESTED,
          description: 'User account marked for deletion',
          resourceType: AuditLogResourceType.USER,
          resourceId: user.id,
          severity: AuditSeverityLevel.WARNING,
          metadata: {
            ownedWorkspaces: workspaceMembers.length
          },
          request
        },
        tx
      );
    } catch (error) {
      await logAuthError(error, {
        userId: user.id,
        context: 'user-deletion',
        action: 'handleBeforeDelete',
        request,
        metadata: { userId: user.id }
      });
      throw handleAuthError(error);
    }
  });
};

export const handleAfterDelete = async (user: User, request?: Request) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    try {
      await createUserAuditLog(
        {
          userId: user.id,
          eventType: AuditLogEventType.ACCOUNT_DELETED,
          description: 'Account and associated data deleted',
          severity: AuditSeverityLevel.WARNING,
          metadata: {
            requestPath: request?.url,
            requestMethod: request?.method
          }
        },
        tx
      );
    } catch (error) {
      await logAuthError(error, {
        userId: user.id,
        context: 'user-deletion',
        action: 'handleAfterDelete',
        request,
        metadata: { userId: user.id }
      });
      throw handleAuthError(error);
    }
  });
};

export const deleteUser = async (data: DeleteUserData) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: data.user.id }
      // ... rest of the code
    });
  });
};
