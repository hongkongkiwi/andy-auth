import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth/types';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getProtectedDb, getUnprotectedDb } from '@/lib/db/index';
import {
  sendVerificationEmail,
  sendChangeEmailVerification
} from '../services/email-verification-service';
import {
  sendDeleteAccountVerification,
  handleBeforeDelete,
  handleAfterDelete
} from '../services/user-deletion-service';
import { hashPassword, verifyPasswordForAuth } from '../utils/crypto';
import { onBeforeAuth, onAfterAuth } from '../services/security-service';
import { isProduction } from '@/lib/utils/env';

const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
} as const;

export const AUTH_CONFIG = {
  DB_TABLE_NAMES: {
    USER: 'user',
    ACCOUNT: 'oauthAccount',
    VERIFICATION: 'verificationToken',
    SESSION: 'authSession'
  },

  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    MAX_RESET_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * TIME.MINUTE,
    VERIFICATION_CODE_LENGTH: 6,
    MFA_CODE_LENGTH: 6,
    BCRYPT_SALT_ROUNDS: 12,
    SCRYPT_COST_FACTOR: 16384,
    SCRYPT_BLOCK_SIZE: 8,
    SCRYPT_PARALLELIZATION: 1,
    HASH_LENGTH: 64
  },

  EXPIRATION: {
    EMAIL_VERIFICATION: 24 * TIME.HOUR,
    PHONE_VERIFICATION: 10 * TIME.MINUTE,
    PASSWORD_RESET: 1 * TIME.HOUR,
    ACCOUNT_DELETION: 24 * TIME.HOUR,
    SESSION: 24 * TIME.HOUR,
    SESSION_UPDATE: 15 * TIME.MINUTE
  },

  RATE_LIMITS: {
    MAX_VERIFICATION_ATTEMPTS: 3,
    MAX_PASSWORD_RESET_ATTEMPTS: 3,
    MAX_MFA_ATTEMPTS: 3,
    WINDOW: 1 * TIME.HOUR
  },

  COOKIES: {
    SESSION: {
      name: 'session',
      options: {
        httpOnly: true,
        secure: isProduction(),
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 24 * 60 * 60
      }
    }
  },

  PROVIDERS: {
    GOOGLE: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    GITHUB: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  }
} as const;

export type AuthConfig = typeof AUTH_CONFIG;

export const { EXPIRATION, SECURITY, RATE_LIMITS, COOKIES, PROVIDERS } =
  AUTH_CONFIG;

const config: BetterAuthOptions = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',

  database: prismaAdapter(getUnprotectedDb(), {
    provider: 'postgresql'
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 255,
    password: {
      hash: hashPassword,
      verify: verifyPasswordForAuth
    },
    autoSignIn: true
  },

  emailVerification: {
    sendVerificationEmail,
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },

  user: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.USER,
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification,
      beforeDelete: handleBeforeDelete,
      afterDelete: handleAfterDelete
    }
  },

  session: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.SESSION,
    expiresIn: AUTH_CONFIG.EXPIRATION.SESSION,
    updateAge: AUTH_CONFIG.EXPIRATION.SESSION_UPDATE,
    additionalFields: {
      ipAddress: { type: 'string' },
      userAgent: { type: 'string' }
    }
  },

  account: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.ACCOUNT,
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github']
    }
  },

  verification: {
    modelName: AUTH_CONFIG.DB_TABLE_NAMES.VERIFICATION
  },

  hooks: {
    before: onBeforeAuth,
    after: onAfterAuth
  }
};

export const auth = betterAuth(config);
