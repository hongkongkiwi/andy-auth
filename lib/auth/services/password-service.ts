import { prisma } from '@/lib/db';
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
import type { AuthUser } from '../types';
import prettyMs from 'pretty-ms';

interface PasswordResetData {
  user: AuthUser;
  url: string;
  token: string;
}

/**
 * Hashes a user password with proper validation
 * @param password - The plain text password to hash
 * @returns Promise containing the hashed password string
 * @throws {APIError} If password format is invalid or hashing fails
 */
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

/**
 * Verifies a user's password against stored hash
 * @param password - The plain text password to verify
 * @param hash - The stored password hash
 * @param salt - The stored password salt
 * @returns Promise<boolean> indicating if password is valid
 * @throws {APIError} If verification fails
 */
export const verifyUserPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await verifyPassword({ password, hash });
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sends a password reset email to the user
 * @param data - Object containing user info, reset URL and token
 * @param request - Optional Request object for logging
 * @throws {APIError} If user not found or email sending fails
 */
export const sendResetPassword = async (
  data: PasswordResetData,
  request?: Request
) => {
  try {
    const platformUser = await prisma.platformUser.findUnique({
      where: { id: data.user.id },
      include: { personProfile: true }
    });

    if (!platformUser) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendResetPassword',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: platformUser.emailAddress!,
      template: EmailTemplate.PASSWORD_RESET,
      data: {
        name: platformUser.personProfile?.firstName || 'User',
        resetUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PASSWORD_RESET, {
          verbose: true
        })
      }
    });
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Changes a user's password with current password verification
 * @param userId - ID of user changing password
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @param request - Optional Request object for audit logging
 * @throws {APIError} If user not found, current password invalid, or new password format invalid
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  request?: Request
) => {
  try {
    const user = await prisma.platformUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
        emailAddress: true,
        personProfile: true
      }
    });

    if (!user?.passwordHash) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'changePassword',
        userId
      });
    }

    const isValid = await verifyUserPassword(
      currentPassword,
      user.passwordHash
    );
    if (!isValid) {
      throw AUTH_ERRORS.INVALID_CREDENTIALS({
        context: 'changePassword'
      });
    }

    if (!validatePassword(newPassword)) {
      throw AUTH_ERRORS.INVALID_PASSWORD_FORMAT({
        context: 'changePassword'
      });
    }

    const hash = await hashUserPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.platformUser.update({
        where: { id: userId },
        data: {
          passwordHash: hash,
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
          resourceId: userId,
          resourceType: AuditLogResourceType.USER,
          tableName: 'platformUser',
          severity: AuditSeverityLevel.INFO,
          metadata: {
            requestPath: request?.url,
            requestMethod: request?.method
          }
        },
        tx
      );
    });

    if (user.emailAddress) {
      await sendEmail({
        to: user.emailAddress,
        subject: 'Password Changed Successfully',
        template: EmailTemplate.PASSWORD_CHANGED,
        data: {
          name: user.personProfile?.firstName || 'User'
        }
      });
    }
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Resets a user's password without requiring current password verification
 * @param userId - ID of user to reset password for
 * @param newPassword - New password to set
 * @param request - Optional Request object for audit logging
 * @throws {AuthError} If user not found or new password invalid
 */
export const resetPassword = async (
  userId: string,
  newPassword: string,
  request?: Request
) => {
  try {
    const user = await prisma.platformUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        emailAddress: true,
        personProfile: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'resetPassword',
        userId
      });
    }

    const hash = await hashUserPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.platformUser.update({
        where: { id: userId },
        data: {
          passwordHash: hash,
          passwordLastChanged: new Date(),
          requirePasswordChange: false,
          failedLoginAttempts: 0,
          lockoutUntil: null
        }
      });

      await createAuditLog({
        userId,
        eventType: AuditLogEventType.PASSWORD_RESET,
        description: 'Password reset completed via recovery flow',
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'platformUser',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      });
    });

    if (user.emailAddress) {
      await sendEmail({
        to: user.emailAddress,
        subject: 'Your Password Has Been Reset',
        template: EmailTemplate.PASSWORD_RESET_COMPLETE,
        data: {
          name: user.personProfile?.firstName || 'User'
        }
      });
    }
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Marks a user account as requiring password change
 * @param userId - ID of user to require password change
 * @param reason - Reason for requiring password change
 * @param request - Optional Request object for audit logging
 * @throws {AuthError} If user not found
 */
export const requirePasswordChange = async (
  userId: string,
  reason: string,
  request?: Request
) => {
  try {
    const user = await prisma.platformUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        emailAddress: true,
        personProfile: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'requirePasswordChange',
        userId
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.platformUser.update({
        where: { id: userId },
        data: {
          requirePasswordChange: true
        }
      });

      await createAuditLog({
        userId,
        eventType: AuditLogEventType.PASSWORD_CHANGE_REQUIRED,
        description: `Password change required: ${reason}`,
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'platformUser',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          requestPath: request?.url,
          requestMethod: request?.method
        }
      });
    });

    if (user.emailAddress) {
      await sendEmail({
        to: user.emailAddress,
        subject: 'Password Change Required',
        template: EmailTemplate.PASSWORD_CHANGE_REQUIRED,
        data: {
          name: user.personProfile?.firstName || 'User',
          reason
        }
      });
    }
  } catch (error) {
    throw handleAuthError(error);
  }
};
