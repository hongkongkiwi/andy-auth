import { prisma } from '@/lib/db';
import { AUTH_ERRORS, handleAuthError } from '../errors';
import { validatePhone } from '../utils/validation';
import { sendSMS } from '@/lib/sms/send-sms';
import { getRequestInfo } from '../utils/request';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import {
  createVerificationAuditLog,
  createAuthAuditLog
} from './audit-service';
import type { NextRequest } from 'next/server';
import {
  AuditLogEventType,
  PlatformUserStatus,
  VerificationTokenType,
  AuthenticationMethod
} from '@prisma/client';
import { hashToken } from '../utils/crypto';
import { SMSTemplate } from '../config/sms';
import prettyMs from 'pretty-ms';

// Add interfaces at the top
interface PhoneVerificationData {
  phone: string;
  code: string;
  expiresIn?: string;
}

interface VerificationTokenData {
  phone: string;
  code: string;
  type: VerificationTokenType;
  expiresAt?: Date;
}

const TIME = {
  HOUR: 3600
};

/**
 * Send OTP code via SMS
 */
export const sendPhoneVerification = async (
  data: PhoneVerificationData,
  request?: NextRequest
): Promise<void> => {
  try {
    await checkRateLimit(data.phone, 'sendPhoneVerification');

    if (!validatePhone(data.phone)) {
      throw AUTH_ERRORS.BAD_REQUEST('Invalid phone number format', {
        service: 'phone-auth-service',
        action: 'sendPhoneVerification',
        phone: data.phone
      });
    }

    const result = await sendSMS({
      to: data.phone,
      template: SMSTemplate.VERIFICATION_CODE,
      data: {
        code: data.code,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION, {
          compact: true
        })
      }
    });

    if (!result.success) {
      throw AUTH_ERRORS.INTERNAL_ERROR({
        action: 'sendPhoneVerification',
        error: result.error
      });
    }

    // Store verification token
    const expiresAt = new Date(
      Date.now() + AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION
    );
    await storeVerificationToken({
      phone: data.phone,
      code: data.code,
      type: VerificationTokenType.PHONE_CHANGE,
      expiresAt
    });

    await createVerificationAuditLog({
      userId: data.phone,
      eventType: AuditLogEventType.PHONE_VERIFICATION_REQUESTED,
      description: 'Phone verification code sent',
      resourceId: result.messageId ?? 'unknown',
      request,
      metadata: {
        phone: data.phone,
        messageId: result.messageId
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: data.phone, // Use phone as identifier
      context: 'phone-auth',
      action: 'sendPhoneVerification',
      request,
      metadata: {
        phone: data.phone
      }
    });
    throw handleAuthError(error);
  }
};

/**
 * Send login code via SMS
 */
export const sendLoginCode = async (
  data: {
    phone: string;
    code: string;
    expiresIn?: string;
  },
  request?: NextRequest
) => {
  let user;
  try {
    if (!validatePhone(data.phone)) {
      throw AUTH_ERRORS.BAD_REQUEST('Invalid phone number format', {
        service: 'phone-auth-service',
        action: 'sendLoginCode',
        phone: data.phone
      });
    }

    user = await prisma.platformUser.findFirst({
      where: { phoneNumber: data.phone }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendLoginCode',
        phone: data.phone
      });
    }

    const result = await sendSMS({
      to: data.phone,
      template: SMSTemplate.LOGIN_CODE,
      data: {
        code: data.code,
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION, {
          compact: true
        })
      }
    });

    if (!result.success) {
      throw AUTH_ERRORS.INTERNAL_ERROR({
        action: 'sendLoginCode',
        error: result.error
      });
    }

    await createVerificationAuditLog({
      userId: user.id,
      eventType: AuditLogEventType.PHONE_VERIFICATION_REQUESTED,
      description: 'Login code sent via SMS',
      resourceId: user.id,
      request,
      metadata: {
        phone: data.phone,
        messageId: result.messageId
      }
    });
  } catch (error) {
    await logAuthError(error, {
      userId: user?.id || data.phone,
      context: 'phone-auth',
      action: 'sendLoginCode',
      request,
      metadata: {
        phone: data.phone
      }
    });
    throw handleAuthError(error);
  }
};

/**
 * Verify phone login code and create session
 */
export const verifyLoginCode = async (
  data: Pick<PhoneVerificationData, 'phone' | 'code'>,
  request?: NextRequest
) => {
  let user;
  try {
    await checkRateLimit(data.phone, 'verifyLoginCode');

    if (!validatePhone(data.phone)) {
      throw AUTH_ERRORS.BAD_REQUEST('Invalid phone number format', {
        service: 'phone-auth-service',
        action: 'verifyLoginCode',
        phone: data.phone
      });
    }

    user = await prisma.platformUser.findFirst({
      where: { phoneNumber: data.phone },
      include: {
        personProfile: true,
        workspacePermissions: true,
        clientPermissions: true,
        locationPermissions: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'verifyLoginCode',
        phone: data.phone
      });
    }

    if (user?.status !== PlatformUserStatus.ACTIVE) {
      throw AUTH_ERRORS.ACCOUNT_DISABLED({
        context: 'verifyLoginCode',
        userId: user?.id
      });
    }

    // Verify with hashed token
    const hashedCode = hashToken(data.code);
    await verifyStoredToken({
      phone: data.phone,
      code: hashedCode,
      type: VerificationTokenType.PHONE_LOGIN
    });

    // TODO: Add actual code verification logic here
    // This would typically check against a stored code in the database
    // For now, we'll just log the attempt

    await createAuthAuditLog({
      userId: user.id,
      eventType: AuditLogEventType.LOGIN_SUCCESS,
      description: 'Phone verification completed successfully',
      resourceId: user.id,
      request,
      metadata: {
        phone: data.phone,
        method: AuthenticationMethod.PHONE_OTP
      }
    });

    return {
      user,
      workspaces: user.workspacePermissions,
      clientPermissions: user.clientPermissions,
      locationPermissions: user.locationPermissions
    };
  } catch (error) {
    // Log failed verification attempt
    if (user) {
      await createAuthAuditLog({
        userId: user.id,
        eventType: AuditLogEventType.LOGIN_FAILURE,
        description: 'Phone verification failed',
        resourceId: user.id,
        request,
        success: false,
        metadata: {
          phone: data.phone,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
    await logAuthError(error, {
      userId: user?.id || data.phone,
      context: 'phone-auth',
      action: 'verifyLoginCode',
      request,
      metadata: {
        phone: data.phone
      }
    });
    throw handleAuthError(error);
  }
};

/**
 * Store verification token in database
 */
const storeVerificationToken = async (data: VerificationTokenData) => {
  const hashedCode = hashToken(data.code);
  return prisma.platformUserVerificationToken.create({
    data: {
      identifier: data.phone,
      value: hashedCode,
      type: data.type,
      expiresAt:
        data.expiresAt ||
        new Date(Date.now() + AUTH_CONFIG.EXPIRATION.PHONE_VERIFICATION)
    }
  });
};

/**
 * Verify stored token
 */
const verifyStoredToken = async (data: {
  phone: string;
  code: string;
  type: VerificationTokenType;
}) => {
  const token = await prisma.platformUserVerificationToken.findFirst({
    where: {
      identifier: data.phone,
      value: data.code,
      type: data.type,
      expiresAt: { gt: new Date() }
    }
  });

  if (!token) {
    throw AUTH_ERRORS.INVALID_CODE({
      context: 'verifyStoredToken',
      type: data.type
    });
  }

  // Delete the used token
  await prisma.platformUserVerificationToken.delete({
    where: {
      identifier_value: {
        identifier: data.phone,
        value: data.code
      }
    }
  });

  return token;
};

export const verifyPhoneLogin = async (
  userId: string,
  code: string,
  request?: NextRequest
): Promise<boolean> => {
  // Get attempts count at start
  const attempts = await prisma.platformUserLoginAttempt.count({
    where: {
      userId,
      createdAt: { gt: new Date(Date.now() - TIME.HOUR) },
      isLoginFailed: true,
      authMethod: AuthenticationMethod.PHONE_OTP
    }
  });

  // Check rate limiting
  if (attempts >= AUTH_CONFIG.RATE_LIMITS.MAX_VERIFICATION_ATTEMPTS) {
    throw AUTH_ERRORS.TOO_MANY_REQUESTS({
      context: 'verifyPhoneLogin',
      userId,
      attempts,
      timeWindow: 'hour'
    });
  }

  try {
    const user = await prisma.platformUser.findUnique({
      where: {
        id: userId,
        status: PlatformUserStatus.ACTIVE
      },
      select: {
        id: true,
        phoneNumber: true,
        status: true
      }
    });

    if (!user?.phoneNumber || user.status !== PlatformUserStatus.ACTIVE) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'verifyPhoneLogin',
        userId
      });
    }

    // Record the attempt before verification
    await prisma.platformUserLoginAttempt.create({
      data: {
        userId,
        authMethod: AuthenticationMethod.PHONE_OTP,
        isLoginFailed: false,
        ...getRequestInfo(request)
      }
    });

    // Verify the token
    await verifyStoredToken({
      phone: user.phoneNumber,
      code,
      type: VerificationTokenType.PHONE_LOGIN
    });

    await createAuthAuditLog({
      userId,
      eventType: AuditLogEventType.LOGIN_SUCCESS,
      description: 'Phone login verification successful',
      resourceId: userId,
      request,
      metadata: {
        method: AuthenticationMethod.PHONE_OTP,
        phone: user.phoneNumber,
        attempts: attempts + 1
      }
    });

    return true;
  } catch (error) {
    // Record failed attempt
    await prisma.platformUserLoginAttempt.create({
      data: {
        userId,
        authMethod: AuthenticationMethod.PHONE_OTP,
        isLoginFailed: true,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
        ...getRequestInfo(request)
      }
    });

    await createAuthAuditLog({
      userId,
      eventType: AuditLogEventType.LOGIN_FAILURE,
      description: 'Phone login verification failed',
      resourceId: userId,
      request,
      success: false,
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        attempts: attempts + 1
      }
    });
    throw handleAuthError(error);
  }
};

// Add rate limiting helper
const checkRateLimit = async (
  identifier: string,
  action: string
): Promise<void> => {
  const attempts = await prisma.platformUserLoginAttempt.count({
    where: {
      userId: identifier,
      createdAt: { gt: new Date(Date.now() - TIME.HOUR) },
      isLoginFailed: true,
      authMethod: AuthenticationMethod.PHONE_OTP
    }
  });

  if (attempts >= AUTH_CONFIG.RATE_LIMITS.MAX_VERIFICATION_ATTEMPTS) {
    throw AUTH_ERRORS.TOO_MANY_REQUESTS({
      context: action,
      identifier,
      attempts,
      timeWindow: prettyMs(TIME.HOUR, { compact: true })
    });
  }
};
