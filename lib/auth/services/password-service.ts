import { transaction } from '@/lib/db/index';
import type { TransactionClient } from '@/lib/db/types';
import { sendEmail, EmailTemplate } from '@/lib/email/send-email';
import { createAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { validatePassword } from '../utils/validation';
import { AUTH_ERRORS } from '../errors';
import type { User } from 'better-auth/types';
import { handleAuthError } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import type { AuthUser } from '../types/types';
import prettyMs from 'pretty-ms';
import { getProtectedDb } from '@/lib/db/index';

interface PasswordResetData {
  user: AuthUser;
  url: string;
  token: string;
}

export const hashUserPassword = async (password: string): Promise<string> => {
  try {
    if (!validatePassword(password)) {
      throw AUTH_ERRORS.INVALID_PASSWORD_FORMAT({
        context: 'hashUserPassword'
      });
    }
    return await hashPassword(password);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const verifyUserPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await verifyPassword(password, hash);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        email: true,
        userProfile: true,
        status: true
      }
    });

    if (!user?.password) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'changePassword',
        userId
      });
    }

    const isValid = await verifyUserPassword(oldPassword, user.password);
    if (!isValid) {
      throw AUTH_ERRORS.INVALID_CREDENTIALS({
        context: 'changePassword'
      });
    }

    const hash = await hashUserPassword(newPassword);

    await tx.user.update({
      where: { id: userId },
      data: {
        password: hash,
        passwordLastChanged: new Date(),
        requirePasswordChange: false,
        passwordResetAttempts: 0
      }
    });

    await createAuditLog(
      {
        userId,
        eventType: AuditLogEventType.PASSWORD_CHANGED,
        description: 'User changed their password',
        resourceType: AuditLogResourceType.USER,
        resourceId: userId,
        tableName: 'user',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );

    if (user.email) {
      await sendEmail({
        to: user.email,
        template: EmailTemplate.PASSWORD_CHANGED,
        data: {
          name: user.userProfile?.firstName || 'User'
        }
      });
    }
  });
};

export const sendResetPassword = async (
  data: PasswordResetData,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: data.user.id },
      select: {
        id: true,
        email: true,
        userProfile: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendResetPassword',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: user.email!,
      template: EmailTemplate.PASSWORD_RESET,
      data: {
        name: user.userProfile?.firstName || 'User',
        resetUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PASSWORD_RESET, {
          verbose: true
        })
      }
    });

    await createAuditLog(
      {
        userId: user.id,
        eventType: AuditLogEventType.PASSWORD_RESET_REQUESTED,
        description: 'Password reset email sent',
        resourceType: AuditLogResourceType.USER,
        resourceId: user.id,
        tableName: 'user',
        severity: AuditSeverityLevel.WARNING,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );
  });
};

export const resetPassword = async (
  userId: string,
  token: string,
  newPassword: string,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true,
        userProfile: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'resetPassword',
        userId
      });
    }

    const hash = await hashUserPassword(newPassword);

    await tx.user.update({
      where: { id: userId },
      data: {
        password: hash,
        passwordLastChanged: new Date(),
        requirePasswordChange: false,
        failedLoginAttempts: 0,
        lockoutUntil: null
      }
    });

    await createAuditLog(
      {
        userId,
        eventType: AuditLogEventType.PASSWORD_RESET,
        description: 'Password reset completed via recovery flow',
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'user',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );

    if (user.email) {
      await sendEmail({
        to: user.email,
        template: EmailTemplate.PASSWORD_RESET_COMPLETE,
        data: {
          name: user.userProfile?.firstName || 'User'
        }
      });
    }
  });
};

export const requirePasswordChange = async (
  userId: string,
  reason: string,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userProfile: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'requirePasswordChange',
        userId
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        requirePasswordChange: true
      }
    });

    await createAuditLog(
      {
        userId,
        eventType: AuditLogEventType.PASSWORD_CHANGE_REQUIRED,
        description: `Password change required: ${reason}`,
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'user',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );

    if (user.email) {
      await sendEmail({
        to: user.email,
        template: EmailTemplate.PASSWORD_CHANGE_REQUIRED,
        data: {
          name: user.userProfile?.firstName || 'User',
          reason
        }
      });
    }
  });
};

export const updatePassword = async (userId: string, password: string) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'updatePassword',
        userId
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        password,
        requirePasswordChange: false
      }
    });

    await createAuditLog(
      {
        userId,
        eventType: AuditLogEventType.PASSWORD_CHANGED,
        description: 'Password updated',
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'user',
        severity: AuditSeverityLevel.INFO
      },
      tx
    );
  });
};

export const sendPasswordReset = async (
  data: PasswordResetData,
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
        passwordResetAttempts: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendPasswordReset',
        userId: data.user.id
      });
    }

    if (!user.email) {
      throw AUTH_ERRORS.BAD_REQUEST('User has no email address', {
        context: 'sendPasswordReset',
        metadata: { userId: user.id }
      });
    }

    // Check reset attempts
    if (user.passwordResetAttempts >= AUTH_CONFIG.SECURITY.MAX_RESET_ATTEMPTS) {
      throw AUTH_ERRORS.TOO_MANY_REQUESTS({
        context: 'sendPasswordReset',
        metadata: {
          userId: user.id,
          attempts: user.passwordResetAttempts
        }
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        passwordResetAttempts: {
          increment: 1
        }
      }
    });

    await sendEmail({
      to: user.email,
      template: EmailTemplate.PASSWORD_RESET,
      data: {
        name: user.userProfile?.firstName || 'User',
        resetUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PASSWORD_RESET, {
          verbose: true
        })
      }
    });

    await createAuditLog(
      {
        userId: user.id,
        eventType: AuditLogEventType.PASSWORD_RESET_REQUESTED,
        description: 'Password reset requested',
        resourceType: AuditLogResourceType.USER,
        resourceId: user.id,
        tableName: 'user',
        severity: AuditSeverityLevel.WARNING,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      },
      tx
    );
  });
};
