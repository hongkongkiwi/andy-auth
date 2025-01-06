import { prisma } from '@/lib/db';
import { sendEmail, EmailTemplate } from '@/lib/email/send-email';
import { createAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditSeverityLevel,
  VerificationTokenType,
  AuditLogResourceType
} from '@prisma/client';
import type { User } from 'better-auth/types';
import { AUTH_ERRORS } from '../errors';
import { handleAuthError } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import type { NextRequest } from 'next/server';
import prettyMs from 'pretty-ms';

export const sendVerificationEmail = async (
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
        context: 'sendVerificationEmail',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: platformUser.emailAddress!,
      template: EmailTemplate.EMAIL_VERIFICATION,
      data: {
        name: platformUser.personProfile?.firstName || 'User',
        verificationUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION, {
          verbose: true
        })
      }
    });

    await storeVerificationToken({
      userId: platformUser.id,
      email: platformUser.emailAddress!,
      token: data.token,
      type: VerificationTokenType.EMAIL_LOGIN
    });

    await createAuditLog({
      userId: platformUser.id,
      eventType: AuditLogEventType.LOGIN,
      description: 'Email verification requested',
      resourceId: platformUser.id,
      resourceType: AuditLogResourceType.USER,
      tableName: 'platformUser',
      severity: AuditSeverityLevel.INFO,
      metadata: {
        email: platformUser.emailAddress,
        verificationSent: true,
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION
        ).toISOString(),
        requestPath: request?.url,
        requestMethod: request?.method
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: data.user.id,
      context: 'email-verification',
      action: 'sendVerificationEmail',
      request,
      metadata: {
        email: platformUser?.emailAddress
      }
    });
    throw handleAuthError(error);
  }
};

export const sendChangeEmailVerification = async (
  data: {
    user: User;
    newEmail: string;
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
        context: 'sendChangeEmailVerification',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: data.newEmail,
      template: EmailTemplate.CHANGE_EMAIL_VERIFICATION,
      data: {
        name: platformUser.personProfile?.firstName || 'User',
        verificationUrl: `${data.url}?token=${data.token}`,
        currentEmail: platformUser.emailAddress,
        newEmail: data.newEmail,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION, {
          verbose: true
        })
      }
    });

    await createAuditLog({
      userId: platformUser.id,
      eventType: AuditLogEventType.LOGIN,
      description: 'Email change verification requested',
      resourceId: platformUser.id,
      resourceType: AuditLogResourceType.USER,
      tableName: 'platformUser',
      severity: AuditSeverityLevel.INFO,
      metadata: {
        oldEmail: platformUser.emailAddress,
        newEmail: data.newEmail,
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION
        ).toISOString(),
        requestPath: request?.url,
        requestMethod: request?.method
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: data.user.id,
      context: 'email-verification',
      action: 'sendChangeEmailVerification',
      request,
      metadata: {
        currentEmail: platformUser?.emailAddress,
        newEmail: data.newEmail
      }
    });
    throw handleAuthError(error);
  }
};

export const verifyEmail = async (
  userId: string,
  token: string,
  request?: NextRequest
) => {
  try {
    const verificationToken =
      await prisma.platformUserVerificationToken.findFirst({
        where: {
          userId,
          value: token,
          type: VerificationTokenType.EMAIL_LOGIN,
          expiresAt: { gt: new Date() }
        }
      });

    if (verificationToken) {
      // Update user's email verification status
      await prisma.platformUser.update({
        where: { id: userId },
        data: { emailAddressVerifiedAt: new Date() }
      });

      // Delete the used token
      await prisma.platformUserVerificationToken.delete({
        where: {
          identifier_value: {
            identifier: verificationToken.identifier,
            value: token
          }
        }
      });

      await createAuditLog({
        userId,
        eventType: AuditLogEventType.LOGIN,
        description: 'Email address verified successfully',
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'platformUser',
        severity: AuditSeverityLevel.INFO,
        metadata: {
          success: true,
          requestPath: request?.url,
          requestMethod: request?.method
        }
      });

      return true;
    } else {
      await createAuditLog({
        userId,
        eventType: AuditLogEventType.LOGIN_FAILED,
        description: 'Email verification failed - invalid or expired token',
        resourceId: userId,
        resourceType: AuditLogResourceType.USER,
        tableName: 'platformUser',
        severity: AuditSeverityLevel.WARNING,
        metadata: {
          reason: 'INVALID_TOKEN',
          requestPath: request?.url,
          requestMethod: request?.method
        }
      });

      return false;
    }
  } catch (error) {
    await logAuthError(error, {
      userId,
      context: 'email-verification',
      action: 'verifyEmail',
      request,
      metadata: { token }
    });
    throw handleAuthError(error);
  }
};

const storeVerificationToken = async (data: {
  userId: string;
  email: string;
  token: string;
  type: VerificationTokenType;
}) => {
  return prisma.platformUserVerificationToken.create({
    data: {
      identifier: data.email,
      value: data.token,
      type: data.type,
      userId: data.userId,
      expiresAt: new Date(
        Date.now() + AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION
      )
    }
  });
};
