import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth/types';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/db';
import {
  sendVerificationEmail,
  sendChangeEmailVerification
} from '../services/email-verification-service';
import {
  sendDeleteAccountVerification,
  handleBeforeDelete,
  handleAfterDelete
} from '../services/user-deletion-service';
import { sendResetPassword } from '../services/password-service';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { onBeforeAuth, onAfterAuth } from '../services/security-service';
import { NextRequest } from 'next/server';

const TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000
} as const;

export const AUTH_CONFIG = {
  // Database
  DB_TABLE_NAMES: {
    USER: 'platformUser',
    ACCOUNT: 'oauthAccount',
    VERIFICATION: 'platformUserVerificationToken',
    SESSION: 'authSession'
  },

  // Security Limits
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * TIME.MINUTE,
    PASSWORD_RESET_EXPIRES: 30 * TIME.MINUTE,
    VERIFICATION_CODE_LENGTH: 6,
    MFA_CODE_LENGTH: 6
  },

  // Token Expiration
  EXPIRATION: {
    EMAIL_VERIFICATION: 24 * TIME.HOUR,
    PHONE_VERIFICATION: 10 * TIME.MINUTE,
    PASSWORD_RESET: 1 * TIME.HOUR,
    ACCOUNT_DELETION: 1 * TIME.HOUR,
    SESSION: 30 * TIME.DAY,
    SESSION_UPDATE: 10 * TIME.MINUTE
  },

  // Rate Limiting
  RATE_LIMITS: {
    MAX_LOGIN_ATTEMPTS: 5,
    MAX_VERIFICATION_ATTEMPTS: 3,
    LOCKOUT_DURATION: TIME.HOUR,
    RESET_AFTER: TIME.HOUR * 24
  },

  // Timeouts
  TIMEOUTS: {
    SESSION_FETCH: 5, // seconds
    RATE_LIMIT_WINDOW: 60 // seconds
  }
} as const;

const config: BetterAuthOptions = {
  appName: 'Patrol6',

  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),

  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 255,
    sendResetPassword: async (data, request) => {
      await sendResetPassword(data, request as Request);
    },
    resetPasswordTokenExpiresIn: 10 * TIME.MINUTE,
    password: {
      hash: hashPassword,
      verify: verifyPassword
    },
    autoSignIn: true
  },

  emailVerification: {
    sendVerificationEmail: async (data, request) => {
      await sendVerificationEmail(data, request as Request);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },

  user: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.USER,
    additionalFields: {
      // // Core auth fields
      // phoneNumber: { type: 'string' },
      // phoneNumberVerifiedAt: { type: 'date' },
      // mfaEnabled: { type: 'boolean' },
      // authenticationMethods: { type: 'string[]' },
      // // Security tracking
      // lastLoginAt: { type: 'date' },
      // loginAttempts: { type: 'number' },
      // lastLoginAttemptAt: { type: 'date' },
      // lockedAt: { type: 'date' },
      // lockedReason: { type: 'string' },
      // failedLoginAttempts: { type: 'number' },
      // lastFailedLoginAt: { type: 'date' },
      // lockoutUntil: { type: 'date' },
      // passwordLastChanged: { type: 'date' },
      // requirePasswordChange: { type: 'boolean' },
      // // Profile and settings
      // status: { type: 'string' },
      // profilePictureId: { type: 'string' },
      // personProfileId: { type: 'string' },
      // // Audit fields
      // lastModifiedBy: { type: 'string' },
      // deletedAt: { type: 'date' },
      // deletedBy: { type: 'string' }
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification,
      beforeDelete: handleBeforeDelete,
      afterDelete: handleAfterDelete
    },
    fields: {
      email: 'emailAddress',
      emailVerified: 'emailAddressVerifiedAt',
      name: 'name',
      image: 'image',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },

  session: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.SESSION,
    expiresIn: AUTH_CONFIG.EXPIRATION.SESSION,
    updateAge: AUTH_CONFIG.EXPIRATION.SESSION_UPDATE,
    additionalFields: {
      ipAddress: { type: 'string' },
      userAgent: { type: 'string' }
    },
    storeSessionInDatabase: true,
    // cookieOptions: {
    //   name: 'auth_session',
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax' as const
    // },
    cookieCache: {
      maxAge: 30 * TIME.DAY,
      enabled: true
    },
    freshAge: 10 * TIME.MINUTE,
    fields: {
      token: 'token',
      expiresAt: 'expiresAt',
      userId: 'userId',
      ipAddress: 'ipAddress',
      userAgent: 'userAgent',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },

  account: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.ACCOUNT,
    accountLinking: {
      enabled: true,
      trustedProviders: [
        'google',
        'github',
        'apple',
        'facebook',
        'twitter',
        'linkedin',
        'microsoft',
        'spotify',
        'twitch',
        'discord',
        'slack',
        'telegram',
        'whatsapp',
        'zoom'
      ]
    },
    fields: {
      userId: 'userId',
      providerId: 'providerId',
      accountId: 'accountId',
      password: 'password',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      accessTokenExpiresAt: 'accessTokenExpiresAt',
      refreshTokenExpiresAt: 'refreshTokenExpiresAt',
      scope: 'scope',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },

  verification: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.VERIFICATION,
    fields: {
      value: 'token',
      expiresAt: 'expiresAt',
      identifier: 'userId',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },

  advanced: {
    generateId: false
  },

  hooks: {
    before: onBeforeAuth,
    after: onAfterAuth
  }

  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user: User) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: user.id,
  //             type: AuditLogEventType.ACCOUNT_CREATED,
  //             description: 'User account created',
  //             resourceType: AuditLogResourceType.USER,
  //             resourceId: user.id,
  //             success: true,
  //             metadata: {
  //               email: user.email,
  //               name: user.name,
  //               createdAt: user.createdAt
  //             }
  //           }
  //         });
  //       }
  //     },
  //     update: {
  //       after: async (user: User) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: user.id,
  //             type: AuditLogEventType.ACCOUNT_UPDATED,
  //             description: 'User account updated',
  //             resourceType: AuditLogResourceType.USER,
  //             resourceId: user.id,
  //             success: true,
  //             metadata: {
  //               email: user.email,
  //               name: user.name,
  //               updatedAt: user.updatedAt
  //             }
  //           }
  //         });
  //       }
  //     }
  //   },
  //   account: {
  //     create: {
  //       after: async (account: Account) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: account.userId,
  //             type: AuditLogEventType.ACCOUNT_LINKED,
  //             description: 'OAuth account linked',
  //             resourceType: AuditLogResourceType.OAUTH_ACCOUNT,
  //             resourceId: account.id,
  //             success: true,
  //             metadata: {
  //               providerId: account.providerId,
  //               createdAt: account.createdAt
  //             }
  //           }
  //         });
  //       }
  //     },
  //     update: {
  //       after: async (account: Account) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: account.userId,
  //             type: AuditLogEventType.ACCOUNT_UPDATED,
  //             description: 'OAuth account updated',
  //             resourceType: AuditLogResourceType.OAUTH_ACCOUNT,
  //             resourceId: account.id,
  //             success: true,
  //             metadata: {
  //               providerId: account.providerId,
  //               updatedAt: account.updatedAt
  //             }
  //           }
  //         });
  //       }
  //     }
  //   },
  //   verification: {
  //     create: {
  //       after: async (verification: Verification) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: verification.identifier,
  //             type: AuditLogEventType.EMAIL_VERIFICATION_REQUESTED,
  //             description: 'Verification token created',
  //             resourceType: AuditLogResourceType.VERIFICATION,
  //             resourceId: verification.id,
  //             success: true,
  //             metadata: {
  //               expiresAt: verification.expiresAt,
  //               createdAt: verification.createdAt
  //             }
  //           }
  //         });
  //       }
  //     },
  //     update: {
  //       after: async (verification: Verification) => {
  //         await prisma.auditLog.create({
  //           data: {
  //             userId: verification.identifier,
  //             type: AuditLogEventType.EMAIL_VERIFICATION_REQUESTED,
  //             description: 'Verification token updated',
  //             resourceType: AuditLogResourceType.VERIFICATION,
  //             resourceId: verification.id,
  //             success: true,
  //             metadata: {
  //               expiresAt: verification.expiresAt,
  //               updatedAt: verification.updatedAt
  //             }
  //           }
  //         });
  //       }
  //     }
  //   }
  // }
};

export const auth = betterAuth(config);
