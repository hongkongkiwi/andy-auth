import { transaction, getProtectedDb } from '@/lib/db/index';
import { createAuditLog } from './audit-service';
import {
  Prisma,
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  UserStatus
} from '@prisma/client';
import { AUTH_ERRORS } from '../errors';
import { logAuthError } from '../utils/error-logging';
import type {
  HookBeforeHandler,
  HookAfterHandler,
  HookEndpointContext
} from 'better-auth';
import { ROUTES } from '../config/routes';
import { AUTH_CONFIG } from '../config/better-auth';
import { handleAuthError } from '../errors';
import { createServiceAuditLog } from './audit-service';
import { checkPermission, Operation } from '../utils/permissions';
import { safeTransaction } from '@/lib/db/index';
import { createDatabaseError } from '@/lib/db/index';

interface AuthRequestBody {
  email?: string;
  [key: string]: unknown;
}

interface LoginAttemptData {
  userId: string;
  success: boolean;
  request?: Request;
}

const isUserLocked = (user: { lockoutUntil: Date | null } | null): boolean => {
  if (!user?.lockoutUntil) return false;
  return new Date(user.lockoutUntil) > new Date();
};

const hasExceededLoginAttempts = (
  user: { failedLoginAttempts: number | null } | null
): boolean => {
  return (
    (user?.failedLoginAttempts ?? 0) >= AUTH_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS
  );
};

export const recordLoginAttempt = async (data: LoginAttemptData) => {
  const db = await getProtectedDb();
  return safeTransaction(db, async (tx) => {
    try {
      // Check if user can be accessed
      const canAccess = await checkPermission(data.userId, Operation.Read);

      if (!canAccess) {
        throw AUTH_ERRORS.UNAUTHORIZED({
          message: 'Cannot access user',
          context: 'recordLoginAttempt',
          metadata: { userId: data.userId }
        });
      }

      // Get user details
      const user = await tx.user.findUnique({
        where: { id: data.userId },
        select: {
          id: true,
          email: true,
          failedLoginAttempts: true,
          status: true
        }
      });

      if (!user) {
        throw AUTH_ERRORS.USER_NOT_FOUND({
          context: 'recordLoginAttempt',
          userId: data.userId
        });
      }

      // Update auth session
      await tx.authSession.updateMany({
        where: {
          userId: data.userId,
          isRevoked: false
        },
        data: {
          lastActiveAt: new Date(),
          failedAttempts: data.success ? 0 : { increment: 1 }
        }
      });

      await createServiceAuditLog(
        {
          userId: data.userId,
          eventType: data.success
            ? AuditLogEventType.LOGIN_SUCCESS
            : AuditLogEventType.LOGIN_FAILURE,
          description: data.success
            ? 'Successful login'
            : 'Failed login attempt',
          resourceType: AuditLogResourceType.SECURITY_EVENT,
          resourceId: data.userId,
          severity: data.success
            ? AuditSeverityLevel.INFO
            : AuditSeverityLevel.WARNING,
          request: data.request
        },
        tx
      );
    } catch (error) {
      throw createDatabaseError(error);
    }
  });
};

export const onBeforeAuth: HookBeforeHandler = async (
  ctx: HookEndpointContext
) => {
  const db = await getProtectedDb();
  await transaction(db, async (tx) => {
    const body = ctx.body as AuthRequestBody;
    const email = body?.email;
    let user;

    try {
      if (ctx.path === ROUTES.SIGN_IN.EMAIL && email) {
        user = await tx.user.findUnique({
          where: { email },
          select: {
            id: true,
            failedLoginAttempts: true,
            lockoutUntil: true
          }
        });

        if (isUserLocked(user)) {
          throw AUTH_ERRORS.ACCOUNT_LOCKED({
            context: 'onBeforeAuth',
            userId: user?.id,
            lockoutUntil: user?.lockoutUntil
          });
        }

        if (hasExceededLoginAttempts(user)) {
          await tx.user.update({
            where: { id: user!.id },
            data: {
              failedLoginAttempts: 0,
              lockoutUntil: null
            }
          });
        }
      }
    } catch (error) {
      await logAuthError(error, {
        userId: user?.id ?? email ?? 'unknown',
        context: 'security',
        action: 'onBeforeAuth',
        request: ctx.request,
        metadata: { path: ctx.path, email }
      });
      throw createDatabaseError(error);
    }
  });
};

export const onAfterAuth: HookAfterHandler = async (
  ctx: HookEndpointContext
) => {
  const userId = ctx.context?.session?.user?.id;
  if (ctx.path.startsWith(ROUTES.SIGN_IN.BASE) && userId) {
    const db = await getProtectedDb();
    await transaction(db, async (tx) => {
      await createServiceAuditLog(
        {
          userId,
          eventType: AuditLogEventType.LOGIN_SUCCESS,
          description: 'Successful login',
          resourceType: AuditLogResourceType.SECURITY_EVENT,
          resourceId: userId,
          severity: AuditSeverityLevel.INFO,
          request: ctx.request
        },
        tx
      );
    });
  }
};

export const onAuthError: HookBeforeHandler = async (
  ctx: HookEndpointContext
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    let user;
    let body: AuthRequestBody = {};

    try {
      body = ctx.body as AuthRequestBody;
      if (ctx.path.startsWith(ROUTES.SIGN_IN.BASE) && body?.email) {
        user = await tx.user.findUnique({
          where: { email: body.email },
          select: {
            id: true,
            email: true,
            status: true,
            failedLoginAttempts: true
          }
        });

        if (user) {
          await recordLoginAttempt({
            userId: user.id,
            success: false,
            request: ctx.request
          });
        }
      }
    } catch (error) {
      await logAuthError(error, {
        userId: user?.id ?? body?.email ?? 'unknown',
        context: 'security',
        action: 'onAuthError',
        request: ctx.request,
        metadata: {
          path: ctx.path,
          email: body?.email
        }
      });
      throw handleAuthError(error);
    }
  });
};
