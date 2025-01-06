import { prisma } from '@/lib/db';
import { createAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';
import { AUTH_ERRORS } from '../errors';
import { createAuthMiddleware } from 'better-auth/api';
import { ROUTES } from '../config/routes';
import { handleAuthError } from '../errors';
import { getRequestInfo } from '../utils/request';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import type {
  HookBeforeHandler,
  HookAfterHandler,
  HookEndpointContext,
  AuthContext
} from 'better-auth';

export const recordLoginAttempt = async (
  userId: string,
  success: boolean,
  request?: Request
) => {
  let user;
  try {
    user = await prisma.platformUser.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'recordLoginAttempt',
        userId
      });
    }

    if (success) {
      await prisma.$transaction(async (tx) => {
        await tx.platformUser.update({
          where: { id: userId },
          data: {
            failedLoginAttempts: 0,
            lastLoginAt: new Date(),
            lockoutUntil: null
          }
        });

        await createAuditLog(
          {
            userId,
            eventType: AuditLogEventType.LOGIN_SUCCESS,
            description: 'Successful login',
            resourceType: AuditLogResourceType.USER,
            resourceId: userId,
            tableName: 'platformUser',
            severity: AuditSeverityLevel.INFO,
            ...getRequestInfo(request)
          },
          tx
        );
      });
      return;
    }

    const failedAttempts = (user?.failedLoginAttempts ?? 0) + 1;
    const shouldLock =
      failedAttempts >= AUTH_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS;
    const lockoutUntil = new Date(
      Date.now() + AUTH_CONFIG.SECURITY.LOCKOUT_DURATION
    );

    await prisma.$transaction(async (tx) => {
      await tx.platformUser.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: failedAttempts,
          lastFailedLoginAt: new Date(),
          lockoutUntil: shouldLock ? lockoutUntil : null
        }
      });

      await createAuditLog(
        {
          userId,
          eventType: shouldLock
            ? AuditLogEventType.ACCOUNT_LOCKED
            : AuditLogEventType.LOGIN_FAILURE,
          description: shouldLock
            ? 'Account locked due to too many failed attempts'
            : 'Failed login attempt',
          resourceType: AuditLogResourceType.USER,
          resourceId: userId,
          tableName: 'platformUser',
          severity: AuditSeverityLevel.WARNING,
          ...getRequestInfo(request)
        },
        tx
      );
    });

    if (shouldLock) {
      throw AUTH_ERRORS.ACCOUNT_LOCKED({
        context: 'recordLoginAttempt',
        failedAttempts,
        lockoutUntil
      });
    }
  } catch (error) {
    await logAuthError(error, {
      userId,
      context: 'security',
      action: 'recordLoginAttempt',
      request,
      metadata: {
        success,
        failedAttempts: user?.failedLoginAttempts ?? 0
      }
    });
    throw handleAuthError(error);
  }
};

export const onBeforeAuth: HookBeforeHandler = async (
  ctx: HookEndpointContext<AuthContext>
) => {
  let user;
  try {
    // Email domain check
    const email = ctx.body?.email;
    if (ctx.path === ROUTES.SIGN_UP.EMAIL && email) {
      if (!email.endsWith('@example.com')) {
        throw AUTH_ERRORS.BAD_REQUEST('Email must end with @example.com', {
          context: 'onBeforeAuth',
          email
        });
      }
    }

    // Login attempt check
    if (ctx.path === ROUTES.SIGN_IN.EMAIL && email) {
      user = await prisma.platformUser.findUnique({
        where: { emailAddress: email },
        select: {
          id: true,
          failedLoginAttempts: true,
          lockoutUntil: true
        }
      });

      if (
        user &&
        user.failedLoginAttempts >= AUTH_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS
      ) {
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          throw AUTH_ERRORS.ACCOUNT_LOCKED({
            context: 'onBeforeAuth',
            userId: user.id,
            lockoutUntil: user.lockoutUntil
          });
        }
        await prisma.platformUser.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockoutUntil: null }
        });
      }
    }
  } catch (error) {
    await logAuthError(error, {
      userId: user?.id ?? ctx.body?.email,
      context: 'security',
      action: 'onBeforeAuth',
      request: ctx.request,
      metadata: {
        path: ctx.path,
        email: ctx.body?.email
      }
    });
    throw handleAuthError(error);
  }
};

export const onAfterAuth: HookAfterHandler = async (
  ctx: HookEndpointContext<AuthContext>
) => {
  const userId = ctx.context?.session?.user?.id;
  if (ctx.path.startsWith(ROUTES.SIGN_IN.BASE) && userId) {
    await recordLoginAttempt(userId, true, ctx.request);
  }
};

// // This middleware specifically handles auth errors
// export const onAuthError: HookErrorHandler = async (ctx: HookEndpointContext<AuthContext>) => {
//   let user;
//   try {
//     if (ctx.path.startsWith(ROUTES.SIGN_IN.BASE) && ctx.body?.email) {
//       user = await prisma.platformUser.findUnique({
//         where: { emailAddress: ctx.body.email }
//       });
//       if (user) {
//         await recordLoginAttempt(user.id, false, ctx.request);
//       }
//     }
//   } catch (error) {
//     await logAuthError(error, {
//       userId: user?.id || ctx.body?.email,
//       context: 'security',
//       action: 'onAuthError',
//       request: ctx.request,
//       metadata: {
//         path: ctx.path,
//         email: ctx.body?.email
//       }
//     });
//     throw handleAuthError(error);
//   }
// };
