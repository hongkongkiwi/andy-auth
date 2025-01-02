import { prismaBase } from '../db/client';
import type { PrismaClient } from '@prisma/client';
import { DbError, DbErrorCode, mapPrismaError } from '../db/errors';
import {
  Prisma,
  PlatformUserStatus,
  VerificationTokenType,
  NextAuthAccountType
} from '@prisma/client';
import type {
  AdapterAccount,
  AdapterSession,
  VerificationToken
} from '@auth/core/adapters';
import type { AdapterAccountType } from '@auth/core/adapters';
import type { Adapter, AdapterUser } from './types/adapter';
import { mapUserToAuthUser } from './utils/auth-mappers';
import { USER_SELECT, SESSION_CONFIG } from './constants';
import { AuthError, AuthErrorCode } from './errors';
import { AUTH_ERROR_STATUS_CODES } from './errors/status-codes';
import { validateUserData } from './utils/validation';
import type { Awaitable } from '@auth/core/types';
import type { PlatformUser } from '@zenstackhq/runtime/models';
import type { AdapterUser as BaseAdapterUser } from '@auth/core/adapters';
import type { PlatformUserAccount } from '@prisma/client';
import { WorkspacePermission } from './utils/auth-mappers';

type ExtendedPrismaClient = Omit<PrismaClient, '$extends'> & {
  withRetry: <T>(fn: () => Promise<T>, maxRetries?: number) => Promise<T>;
};

// Add explicit type for the mapping constants
const AUTH_TYPE_MAPPING: Record<AdapterAccountType, NextAuthAccountType> = {
  oauth: NextAuthAccountType.OAUTH,
  oidc: NextAuthAccountType.OIDC,
  email: NextAuthAccountType.EMAIL,
  webauthn: NextAuthAccountType.WEBAUTHN
} as const;

const NEXT_AUTH_TYPE_MAPPING: Record<NextAuthAccountType, AdapterAccountType> =
  {
    [NextAuthAccountType.OAUTH]: 'oauth',
    [NextAuthAccountType.OIDC]: 'oidc',
    [NextAuthAccountType.EMAIL]: 'email',
    [NextAuthAccountType.WEBAUTHN]: 'webauthn'
  } as const;

// Add error handling for unknown types
const mapAuthNextAuthAccountType = (
  type: AdapterAccountType
): NextAuthAccountType => {
  const mappedType = AUTH_TYPE_MAPPING[type];
  if (!mappedType) {
    console.warn(
      `Unknown adapter account type: ${type}, falling back to OAUTH`
    );
    return NextAuthAccountType.OAUTH;
  }
  return mappedType;
};

const mapAuthAdapterAccountType = (
  type: NextAuthAccountType
): AdapterAccountType => {
  const mappedType = NEXT_AUTH_TYPE_MAPPING[type];
  if (!mappedType) {
    console.warn(
      `Unknown NextAuth account type: ${type}, falling back to oauth`
    );
    return 'oauth';
  }
  return mappedType;
};

// Expand OAuth token types to include common values
type OAuthTokenType = 'bearer' | 'mac' | 'basic' | undefined;

const mapToAdapterAccount = (account: PlatformUserAccount): AdapterAccount => {
  // Safely convert token type
  const tokenType = account.tokenType?.toLowerCase() as OAuthTokenType;

  // Safely handle expiry times
  const expiresAt = account.expiresAt ? Number(account.expiresAt) : undefined;

  return {
    provider: account.provider.toLowerCase(),
    type: mapAuthAdapterAccountType(account.type),
    providerAccountId: account.providerAccountId,
    access_token: account.accessToken ?? undefined,
    token_type: tokenType,
    id_token: account.idToken ?? undefined,
    refresh_token: account.refreshToken ?? undefined,
    scope: account.scope ?? undefined,
    session_state: account.sessionState ?? undefined,
    expires_at: expiresAt,
    userId: account.userId
  };
};

const getDefaultExpiry = (): Date =>
  new Date(Date.now() + SESSION_CONFIG.maxAge * 1000);

const ensureSessionExpiry = (date: Date | undefined | null): Date => {
  const defaultExpiry = getDefaultExpiry();
  if (!date) return defaultExpiry;

  const expiryDate = new Date(date);
  if (isNaN(expiryDate.getTime())) {
    console.warn('Invalid session expiry date, using default');
    return defaultExpiry;
  }

  return expiryDate < new Date() ? defaultExpiry : expiryDate;
};

/**
 * Maps database errors to auth-specific errors
 */
const mapDbErrorToAuthError = (error: unknown): never => {
  if (error instanceof DbError) {
    switch (error.code) {
      case DbErrorCode.RECORD_NOT_FOUND:
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND, {
          message: 'User not found',
          statusCode: AUTH_ERROR_STATUS_CODES.USER_NOT_FOUND,
          error: `Database error: ${error.code}`
        });
      case DbErrorCode.UNIQUE_CONSTRAINT:
        throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
          message: 'User already exists',
          statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA,
          error: `Database error: ${error.code}`
        });
      case DbErrorCode.CONNECTION_FAILED:
        throw new AuthError(AuthErrorCode.DATABASE_ERROR, {
          message: 'Database connection error',
          statusCode: AUTH_ERROR_STATUS_CODES.DATABASE_ERROR,
          error: `Database error: ${error.code}`
        });
      default:
        throw new AuthError(AuthErrorCode.DATABASE_ERROR, {
          message: error.message,
          statusCode: AUTH_ERROR_STATUS_CODES.DATABASE_ERROR,
          error: `Database error: ${error.code}`
        });
    }
  }

  // For Prisma errors that weren't caught by withRetry
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw mapPrismaError(error); // This will convert to DbError
  }

  throw new AuthError(AuthErrorCode.DATABASE_ERROR, {
    message: error instanceof Error ? error.message : 'Unknown database error',
    statusCode: AUTH_ERROR_STATUS_CODES.DATABASE_ERROR
  });
};

// Add this helper at the top with other utility functions
const ensureEmail = (email: string | null): string => email || '';

const mapUserWithWorkspaces = (user: PlatformUser): AdapterUser =>
  ({
    ...mapUserToAuthUser(user),
    email: ensureEmail(user.emailAddress),
    phoneNumber: user.phoneNumber,
    phoneVerified: user.phoneNumberVerifiedAt,
    userStatus: user.userStatus,
    workspaces:
      user.workspacePermissions?.map((wp: WorkspacePermission) => ({
        id: wp.workspace.id,
        displayName: wp.workspace.displayName,
        imageUrl: wp.workspace.imageUrl,
        status: wp.workspace.workspaceStatus,
        slug: wp.workspace.slug,
        companyName: wp.workspace.companyName,
        notes: wp.workspace.notes,
        permissions: wp.permissions
      })) ?? [],
    personProfile: user.personProfile
  }) as AdapterUser;

export const createPrismaAdapter = (db: ExtendedPrismaClient): Adapter => ({
  createUser: (user: BaseAdapterUser): Awaitable<AdapterUser> => {
    try {
      return db.withRetry(async () => {
        const newUser = await db.platformUser.create({
          data: {
            emailAddress: ensureEmail(user.email),
            emailAddressVerifiedAt: user.emailVerified,
            userStatus: PlatformUserStatus.ACTIVE,
            phoneNumber: null,
            phoneNumberVerifiedAt: null,
            languageLocale: 'en',
            timezone: 'UTC',
            personProfile: {
              create: {
                firstName: user.name?.split(' ')[0] ?? '',
                lastName: user.name?.split(' ').slice(1).join(' ') ?? '',
                profileImage: user.image ?? null
              }
            }
          },
          select: USER_SELECT.select
        });

        return {
          id: newUser.id,
          email: ensureEmail(newUser.emailAddress),
          emailVerified: newUser.emailAddressVerifiedAt,
          name: newUser.personProfile
            ? `${newUser.personProfile.firstName} ${newUser.personProfile.lastName}`.trim()
            : null,
          image: newUser.personProfile?.profileImage ?? null
        } as AdapterUser;
      });
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw mapDbErrorToAuthError(error);
    }
  },

  getUser: (id: string): Awaitable<AdapterUser | null> => {
    return db.withRetry(async () => {
      const user = await db.platformUser.findUnique({
        where: { id },
        select: USER_SELECT.select
      });
      if (!user) return null;
      return mapUserWithWorkspaces(user);
    });
  },

  getUserByEmail: (email: string): Awaitable<AdapterUser | null> => {
    return db.withRetry(async () => {
      const user = await db.platformUser.findUnique({
        where: { emailAddress: email },
        select: USER_SELECT.select
      });
      if (!user) return null;
      return mapUserWithWorkspaces(user);
    });
  },

  updateUser: (
    user: Partial<AdapterUser> & { id: string }
  ): Awaitable<AdapterUser> => {
    return db.withRetry(async () => {
      const updatedUser = await db.platformUser.update({
        where: { id: user.id },
        data: {
          emailAddress: user.email,
          emailAddressVerifiedAt: user.emailVerified,
          personProfile: {
            update: {
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ').slice(1).join(' '),
              profileImage: user.image
            }
          }
        },
        select: USER_SELECT.select
      });
      return mapUserWithWorkspaces(updatedUser);
    });
  },

  getSessionAndUser: async (
    sessionToken: string
  ): Promise<{ session: AdapterSession; user: AdapterUser } | null> => {
    try {
      const session = await db.withRetry(() =>
        db.platformUserSession.findUnique({
          where: { sessionToken },
          include: {
            user: {
              select: USER_SELECT.select
            }
          }
        })
      );
      if (!session) return null;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires:
            session.expiresAt ??
            new Date(Date.now() + SESSION_CONFIG.maxAge * 1000)
        },
        user: {
          ...mapUserToAuthUser(session.user),
          email: ensureEmail(session.user.emailAddress),
          phoneNumber: session.user.phoneNumber,
          phoneVerified: session.user.phoneNumberVerifiedAt,
          userStatus: session.user.userStatus,
          workspaces:
            session.user.workspacePermissions?.map(
              (wp: WorkspacePermission) => ({
                id: wp.workspace.id,
                displayName: wp.workspace.displayName,
                imageUrl: wp.workspace.imageUrl,
                status: wp.workspace.workspaceStatus,
                slug: wp.workspace.slug,
                companyName: wp.workspace.companyName,
                notes: wp.workspace.notes,
                permissions: wp.permissions
              })
            ) ?? [],
          personProfile: session.user.personProfile
        } as AdapterUser
      };
    } catch (error) {
      return mapDbErrorToAuthError(error);
    }
  },

  deleteUser: async (userId: string): Promise<AdapterUser | null> => {
    return db.withRetry(async () => {
      const user = await db.platformUser.findUnique({
        where: { id: userId },
        select: USER_SELECT.select
      });

      if (!user) return null;

      await db.$transaction([
        db.platformUserSession.deleteMany({ where: { userId } }),
        db.platformUserAccount.deleteMany({ where: { userId } }),
        db.platformUser.delete({ where: { id: userId } })
      ]);

      return {
        ...mapUserToAuthUser(user),
        email: ensureEmail(user.emailAddress),
        phoneNumber: user.phoneNumber,
        phoneVerified: user.phoneNumberVerifiedAt,
        userStatus: user.userStatus,
        workspaces:
          user.workspacePermissions?.map((wp: WorkspacePermission) => ({
            id: wp.workspace.id,
            displayName: wp.workspace.displayName,
            imageUrl: wp.workspace.imageUrl,
            status: wp.workspace.workspaceStatus,
            slug: wp.workspace.slug,
            companyName: wp.workspace.companyName,
            notes: wp.workspace.notes,
            permissions: wp.permissions
          })) ?? [],
        personProfile: user.personProfile
      } as AdapterUser;
    });
  },

  linkAccount: async (
    data: AdapterAccount
  ): Promise<AdapterAccount | null | undefined> => {
    return db.withRetry(async () => {
      try {
        const account = await db.platformUserAccount.create({
          data: {
            userId: data.userId,
            type: mapAuthNextAuthAccountType(data.type),
            provider: data.provider.toLowerCase(),
            providerAccountId: data.providerAccountId,
            refreshToken: data.refresh_token?.toString() ?? null,
            accessToken: data.access_token?.toString() ?? null,
            expiresAt: data.expires_at ?? null,
            tokenType: data.token_type?.toLowerCase() ?? null,
            scope: data.scope?.toString() ?? null,
            idToken: data.id_token?.toString() ?? null,
            sessionState: data.session_state?.toString() ?? null
          }
        });
        return mapToAdapterAccount(account);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return null;
        }
        return undefined;
      }
    });
  },

  unlinkAccount: async (providerAccountId: {
    provider: string;
    providerAccountId: string;
  }): Promise<void> => {
    try {
      await db.withRetry(async () => {
        await db.platformUserAccount.delete({
          where: {
            provider_providerAccountId: {
              provider: providerAccountId.provider.toLowerCase(),
              providerAccountId: providerAccountId.providerAccountId
            }
          }
        });
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  createSession: async (data: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }): Promise<AdapterSession> => {
    try {
      return db.withRetry(async () => {
        const session = await db.platformUserSession.create({
          data: {
            sessionToken: data.sessionToken,
            userId: data.userId,
            expiresAt: data.expires
          }
        });
        return {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: ensureSessionExpiry(session.expiresAt)
        };
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  updateSession: async (
    data: Partial<AdapterSession> & { sessionToken: string }
  ): Promise<AdapterSession | null> => {
    try {
      return db.withRetry(async () => {
        const session = await db.platformUserSession.update({
          where: { sessionToken: data.sessionToken },
          data: {
            expiresAt: data.expires
          }
        });
        return session
          ? {
              sessionToken: session.sessionToken,
              userId: session.userId,
              expires: ensureSessionExpiry(session.expiresAt)
            }
          : null;
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  deleteSession: async (
    sessionToken: string
  ): Promise<AdapterSession | null> => {
    try {
      return db.withRetry(async () => {
        const session = await db.platformUserSession.delete({
          where: { sessionToken }
        });
        return session
          ? {
              sessionToken: session.sessionToken,
              userId: session.userId,
              expires: ensureSessionExpiry(session.expiresAt)
            }
          : null;
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  getUserByAccount: async (provider_providerAccountId: {
    provider: string;
    providerAccountId: string;
  }): Promise<AdapterUser | null> => {
    try {
      return db.withRetry(async () => {
        const account = await db.platformUserAccount.findUnique({
          where: { provider_providerAccountId },
          select: { user: { select: USER_SELECT.select } }
        });
        if (!account?.user) return null;
        return mapUserWithWorkspaces(account.user);
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  createVerificationToken: async (data: {
    identifier: string;
    token: string;
    expires: Date;
  }): Promise<VerificationToken> => {
    try {
      const expires = data.expires ?? getDefaultExpiry();
      if (expires < new Date()) {
        throw new AuthError(AuthErrorCode.VERIFICATION_EXPIRED, {
          message: 'Verification token expired before creation',
          statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_EXPIRED
        });
      }

      return db.withRetry(async () => {
        const verificationToken = await db.platformUserVerificationToken.create(
          {
            data: {
              identifier: data.identifier,
              token: data.token,
              expiresAt: expires,
              type: VerificationTokenType.EMAIL_LOGIN
            }
          }
        );
        return {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
          expires: verificationToken.expiresAt ?? getDefaultExpiry()
        };
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  },

  useVerificationToken: async (params: {
    identifier: string;
    token: string;
  }): Promise<VerificationToken | null> => {
    try {
      return db.withRetry(async () => {
        const verificationToken = await db.platformUserVerificationToken.delete(
          {
            where: {
              identifier_token_type: {
                identifier: params.identifier,
                token: params.token,
                type: VerificationTokenType.EMAIL_LOGIN
              }
            }
          }
        );
        return verificationToken
          ? {
              identifier: verificationToken.identifier,
              token: verificationToken.token,
              expires: verificationToken.expiresAt ?? getDefaultExpiry()
            }
          : null;
      });
    } catch (error) {
      throw mapDbErrorToAuthError(error);
    }
  }
});
