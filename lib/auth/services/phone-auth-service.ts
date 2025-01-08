import {
  safeTransaction,
  interactiveTransaction,
  type TransactionClient
} from '@/lib/db/index';
import { createServiceAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  VerificationTokenType,
  type VerificationToken
} from '@prisma/client';
import { Operation } from '../utils/permissions';
import { AUTH_ERRORS } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import { getProtectedDb } from '@/lib/db/index';
import type { TransactionCallback } from '@/lib/db/types';
import { checkPermission } from '../utils/permissions';
import prettyMs from 'pretty-ms';
import { SMSError, sendSMS } from '@/lib/sms';
import { normalizePhoneNumber, validatePhoneNumber } from '../../utils/phone';
import { SMSTemplate } from '@/lib/auth/config/sms';
import { generateToken } from '../utils/crypto';

interface PhoneVerificationData {
  userId: string;
  phoneNumber: string;
  code: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  key: 'userId' | 'phoneNumber';
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  PHONE_VERIFICATION: {
    windowMs: 3600000, // 1 hour
    maxAttempts: AUTH_CONFIG.RATE_LIMITS.MAX_VERIFICATION_ATTEMPTS,
    key: 'userId'
  },
  PHONE_NUMBER: {
    windowMs: 3600000, // 1 hour
    maxAttempts: 3, // Max 3 attempts per phone number per hour
    key: 'phoneNumber'
  }
};

const checkRateLimit = async (
  tx: TransactionClient,
  data: { userId: string; phoneNumber: string },
  action: keyof typeof RATE_LIMITS
): Promise<void> => {
  const config = RATE_LIMITS[action];
  const where = {
    ...(config.key === 'userId'
      ? { userId: data.userId }
      : { phoneNumber: data.phoneNumber }),
    createdAt: { gt: new Date(Date.now() - config.windowMs) }
  };

  const attempts = await tx.verificationToken.count({ where });

  if (attempts >= config.maxAttempts) {
    throw AUTH_ERRORS.TOO_MANY_REQUESTS({
      context: action,
      metadata: {
        [config.key]: config.key === 'userId' ? data.userId : data.phoneNumber,
        attempts,
        windowMs: config.windowMs,
        maxAttempts: config.maxAttempts
      }
    });
  }
};

export const sendPhoneVerification = async (
  data: PhoneVerificationData,
  request?: Request
) => {
  const normalizedPhone = normalizePhoneNumber(data.phoneNumber);

  if (!validatePhoneNumber(normalizedPhone)) {
    throw AUTH_ERRORS.INVALID_PHONE_NUMBER({
      context: 'sendPhoneVerification',
      metadata: { phoneNumber: data.phoneNumber }
    });
  }

  const db = await getProtectedDb();
  const callback: TransactionCallback<VerificationToken> = async (tx) => {
    await checkRateLimit(
      tx,
      { userId: data.userId, phoneNumber: normalizedPhone },
      'PHONE_VERIFICATION'
    );
    await checkRateLimit(
      tx,
      { userId: data.userId, phoneNumber: normalizedPhone },
      'PHONE_NUMBER'
    );

    const canUpdate = await checkPermission(data.userId, Operation.Update, {
      phoneNumber: data.phoneNumber
    });

    if (!canUpdate) {
      throw AUTH_ERRORS.UNAUTHORIZED({
        message: 'Cannot verify phone',
        context: 'sendPhoneVerification',
        metadata: {
          userId: data.userId,
          phoneNumber: data.phoneNumber
        }
      });
    }

    const user = await tx.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        status: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendPhoneVerification',
        userId: data.userId
      });
    }

    const verificationToken = await tx.verificationToken.create({
      data: {
        userId: data.userId,
        identifier: data.phoneNumber,
        token: generateToken(),
        code: data.code,
        phoneNumber: data.phoneNumber,
        type: VerificationTokenType.PHONE_VERIFICATION,
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION
        ),
        attempts: 0
      }
    });

    try {
      const smsResult = await sendSMS({
        to: data.phoneNumber,
        template: SMSTemplate.VERIFICATION_CODE,
        data: {
          code: data.code,
          expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION)
        }
      });

      if (!smsResult.success) {
        throw new Error(smsResult.error || 'Failed to send verification SMS');
      }
    } catch (error: unknown) {
      await tx.verificationToken.delete({
        where: { id: verificationToken.id }
      });

      if (error instanceof SMSError) {
        throw AUTH_ERRORS.VERIFICATION_FAILED({
          message: error.message,
          context: 'sendPhoneVerification',
          metadata: {
            userId: data.userId,
            errorCode: error.code
          }
        });
      }
      // Re-throw as a generic verification error
      throw AUTH_ERRORS.VERIFICATION_FAILED({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send verification SMS',
        context: 'sendPhoneVerification',
        metadata: { userId: data.userId }
      });
    }

    await createServiceAuditLog(
      {
        userId: data.userId,
        eventType: AuditLogEventType.PHONE_VERIFICATION_REQUESTED,
        description: 'Phone verification code sent',
        resourceType: AuditLogResourceType.VERIFICATION,
        resourceId: verificationToken.id,
        severity: AuditSeverityLevel.INFO,
        metadata: {
          phoneNumber: data.phoneNumber,
          tokenId: verificationToken.id
        },
        request
      },
      tx
    );

    return verificationToken;
  };
  return interactiveTransaction(db, callback);
};

export const verifyPhone = async (
  data: PhoneVerificationData,
  request?: Request
) => {
  const normalizedPhone = normalizePhoneNumber(data.phoneNumber);

  if (!validatePhoneNumber(normalizedPhone)) {
    throw AUTH_ERRORS.INVALID_PHONE_NUMBER({
      context: 'verifyPhone',
      metadata: { phoneNumber: data.phoneNumber }
    });
  }

  const db = await getProtectedDb();
  const callback: TransactionCallback<boolean> = async (tx) => {
    const token = await tx.verificationToken.findFirst({
      where: {
        userId: data.userId,
        phoneNumber: normalizedPhone,
        code: data.code,
        type: VerificationTokenType.PHONE_VERIFICATION,
        expiresAt: { gt: new Date() },
        usedAt: null
      }
    });

    if (!token) {
      throw AUTH_ERRORS.INVALID_CODE({
        context: 'verifyPhone',
        metadata: { userId: data.userId }
      });
    }

    await tx.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() }
    });

    await tx.user.update({
      where: { id: data.userId },
      data: {
        phoneNumber: normalizedPhone,
        phoneVerified: new Date()
      }
    });

    await createServiceAuditLog(
      {
        userId: data.userId,
        eventType: AuditLogEventType.PHONE_VERIFIED,
        description: 'Phone number verified',
        resourceType: AuditLogResourceType.USER,
        resourceId: data.userId,
        severity: AuditSeverityLevel.INFO,
        metadata: { phoneNumber: normalizedPhone },
        request
      },
      tx
    );

    return true;
  };
  return safeTransaction(db, callback);
};
