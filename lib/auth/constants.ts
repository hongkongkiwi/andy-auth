export const AUTH_LIMITS = {
  VERIFICATION: {
    EXPIRY_MINUTES: 10,
    MAX_ATTEMPTS: 3,
    CODE_LENGTH: 6
  },
  LOGIN: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_MINUTES: 15
  }
} as const;

export const SESSION_CONFIG = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
  defaultExpiryMs: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
} as const;

export const VERIFICATION = {
  isValidCode: (code: string) => /^\d{6}$/.test(code),
  generateCode: () => Math.floor(100000 + Math.random() * 900000).toString()
} as const;

export const AUTH_STORAGE = {
  LOGIN: {
    STORAGE_KEY: (identifier: string, type: string) =>
      `login:${type}:${identifier}`,
    RATE_LIMIT_KEY: (identifier: string) => `ratelimit:login:${identifier}`
  },
  VERIFICATION: {
    STORAGE_KEY: (identifier: string, type: string) =>
      `verification:${type}:${identifier}`,
    RATE_LIMIT_KEY: (identifier: string) => `ratelimit:${identifier}`
  }
} as const;

// Base user select without password
export const USER_SELECT = {
  select: {
    id: true,
    emailAddress: true,
    emailAddressVerifiedAt: true,
    phoneNumber: true,
    phoneNumberVerifiedAt: true,
    userStatus: true,
    languageLocale: true,
    timezone: true,
    personProfile: {
      select: {
        firstName: true,
        lastName: true,
        profileImage: true
      }
    },
    workspacePermissions: {
      select: {
        workspace: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
            workspaceStatus: true,
            slug: true,
            companyName: true,
            notes: true
          }
        },
        permissions: true
      }
    }
  }
} as const;

// Extended select with password for auth
export const USER_WITH_PASSWORD_SELECT = {
  select: {
    ...USER_SELECT.select,
    userPassword: true
  }
} as const;

// Type exports
export type UserSelect = typeof USER_SELECT;
export type SessionConfig = typeof SESSION_CONFIG;
export type AuthLimits = typeof AUTH_LIMITS;
