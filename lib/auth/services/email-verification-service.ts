import { sendEmail, EmailTemplate } from '@/lib/email/send-email';
import { createAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  VerificationTokenType,
  UserStatus
} from '@prisma/client';
import type { User, VerificationToken } from '@prisma/client';
import { AUTH_ERRORS, handleAuthError } from '../errors';
import { AUTH_CONFIG } from '../config/better-auth';
import { logAuthError } from '../utils/error-logging';
import prettyMs from 'pretty-ms';
import { generateToken } from '../utils/crypto';
import { transaction } from '@/lib/db/index';
import type { TransactionClient } from '@/lib/db/types';
import { validateEmail } from '../utils/validation';
import { createServiceAuditLog } from './audit-service';
import {
  checkPermission,
  checkTransactionPermission,
  Operation
} from '../utils/permissions';
import { interactiveTransaction } from '@/lib/db/index';
import { safeTransaction } from '@/lib/db/index';
import { getProtectedDb } from '@/lib/db/index';
import { TransactionCallback } from '@/lib/db/types';

interface VerificationEmailData {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  };
  url: string;
  token: string;
}

interface ChangeEmailVerificationData {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  };
  newEmail: string;
  url: string;
  token: string;
}

interface VerificationTokenData {
  type: VerificationTokenType;
  email: string;
  userId: string;
}

interface UserSelect {
  id: string;
  email: string;
  name: string | null;
  status: UserStatus;
}

export const sendVerificationEmail = async (
  data: VerificationEmailData,
  request?: Request
) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<void> = async (tx) => {
    const canRead = await checkTransactionPermission(
      data.user.id,
      Operation.Read,
      undefined,
      tx
    );

    if (!canRead) {
      throw AUTH_ERRORS.UNAUTHORIZED({
        message: 'Cannot verify email',
        context: 'sendVerificationEmail',
        metadata: { userId: data.user.id }
      });
    }

    // Create verification token
    const verificationToken = await tx.verificationToken.create({
      data: {
        userId: data.user.id,
        identifier: data.user.email!,
        token: data.token,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION
        ),
        attempts: 0
      }
    });

    // Send email
    await sendEmail({
      to: data.user.email!,
      template: EmailTemplate.EMAIL_VERIFICATION,
      data: {
        name: data.user.name || 'User',
        verificationUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION, {
          verbose: true
        })
      }
    });

    await createServiceAuditLog(
      {
        userId: data.user.id,
        eventType: AuditLogEventType.EMAIL_VERIFICATION_REQUESTED,
        description: 'Email verification requested',
        resourceType: AuditLogResourceType.VERIFICATION,
        resourceId: verificationToken.id,
        severity: AuditSeverityLevel.INFO,
        metadata: {
          email: data.user.email,
          tokenId: verificationToken.id
        },
        request
      },
      tx
    );
  };
  return interactiveTransaction(db, callback);
};

export const createVerificationToken = async (data: VerificationTokenData) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<VerificationToken> = async (tx) => {
    if (!validateEmail(data.email)) {
      throw AUTH_ERRORS.BAD_REQUEST('Invalid email format', {
        context: 'createVerificationToken',
        email: data.email
      });
    }

    const token = await tx.verificationToken.create({
      data: {
        userId: data.userId,
        identifier: data.email,
        token: generateToken(),
        type: data.type,
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION
        ),
        attempts: 0
      }
    });

    await createServiceAuditLog(
      {
        userId: data.userId,
        eventType: AuditLogEventType.VERIFICATION_TOKEN_CREATED,
        description: `Created ${data.type} verification token`,
        resourceType: AuditLogResourceType.VERIFICATION,
        resourceId: token.id,
        severity: AuditSeverityLevel.INFO
      },
      tx
    );

    return token;
  };
  return interactiveTransaction(db, callback);
};

export const sendChangeEmailVerification = async (
  data: ChangeEmailVerificationData,
  request?: Request
) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<void> = async (tx) => {
    // First check user permissions
    const canUpdate = await checkPermission(data.user.id, Operation.Update, {
      email: data.newEmail
    });

    if (!canUpdate) {
      throw AUTH_ERRORS.UNAUTHORIZED({
        message: 'Cannot change email',
        context: 'sendChangeEmailVerification',
        metadata: {
          userId: data.user.id,
          newEmail: data.newEmail
        }
      });
    }

    const user = await tx.user.findUnique({
      where: { id: data.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });

    if (!user) {
      throw AUTH_ERRORS.USER_NOT_FOUND({
        context: 'sendChangeEmailVerification',
        userId: data.user.id
      });
    }

    await sendEmail({
      to: data.newEmail,
      template: EmailTemplate.CHANGE_EMAIL_VERIFICATION,
      data: {
        name: user.name || 'User',
        verificationUrl: `${data.url}?token=${data.token}`,
        expiresIn: prettyMs(AUTH_CONFIG.EXPIRATION.EMAIL_VERIFICATION, {
          verbose: true
        }),
        currentEmail: user.email,
        newEmail: data.newEmail
      }
    });

    await createServiceAuditLog(
      {
        userId: user.id,
        eventType: AuditLogEventType.EMAIL_UPDATE_REQUESTED,
        description: 'Email change verification sent',
        resourceType: AuditLogResourceType.USER,
        resourceId: user.id,
        severity: AuditSeverityLevel.INFO,
        metadata: {
          currentEmail: user.email,
          newEmail: data.newEmail
        },
        request
      },
      tx
    );
  };
  return interactiveTransaction(db, callback);
};
