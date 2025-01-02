/**
 * NextAuth Configuration
 *
 * Centralizes authentication configuration including:
 * - Provider setup (OAuth, Credentials)
 * - Session strategy and callbacks
 * - JWT handling and token customization
 * - Authorization logic and route protection
 * - Event handlers for auth lifecycle
 *
 * @module auth/config
 */

import type { NextAuthConfig } from 'next-auth';
import type { Session } from '../types/session';
import type { JWT } from '../types/token';
import type { JWT as NextAuthJWT } from '@auth/core/jwt';
import {
  PlatformUserStatus,
  WorkspaceStatus,
  WorkspacePermissionType
} from '@zenstackhq/runtime/models';
import type { SessionUser } from '../types/user';
import { AuthMethod } from '../types/auth';
import { SESSION_CONFIG } from '../constants';
import { DEFAULT_TOKEN_VALUES } from '../types/token';
import { authProviders } from '../authProviders';
import { createPrismaAdapter } from '../prisma-db-adapter';
import { Adapter } from '../types/adapter';
import { prisma } from '@/lib/db';
import { ensureString, ensureDate } from '../utils/string-utils';
import { AUTH_ROUTES } from './routes';
import { AuthErrorCode } from '../errors';
import { DEFAULT_ERROR_REDIRECT, DEFAULT_LOGIN_REDIRECT } from './routes';
import { isProtectedRoute, isPublicRoute } from './routes';
import type { TokenInput } from '../types/token';
import type { DefaultSession } from 'next-auth';

// Helper to create JWT payload
const createJWTPayload = (data: TokenInput): JWT =>
  ({
    ...DEFAULT_TOKEN_VALUES,
    id: String(data.sub ?? data.id ?? DEFAULT_TOKEN_VALUES.id),
    name: typeof data.name === 'string' ? data.name : null,
    email: data.email || '',
    emailVerified: data.emailVerified ?? DEFAULT_TOKEN_VALUES.emailVerified,
    image: typeof data.image === 'string' ? data.image : null,
    phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : null,
    phoneVerified: data.phoneVerified ?? DEFAULT_TOKEN_VALUES.phoneVerified,
    userStatus: (data.userStatus ??
      DEFAULT_TOKEN_VALUES.userStatus) as PlatformUserStatus,
    workspaces: Array.isArray(data.workspaces)
      ? data.workspaces
      : DEFAULT_TOKEN_VALUES.workspaces,
    authMethod: data.authMethod ?? DEFAULT_TOKEN_VALUES.authMethod,
    selectedWorkspaceId:
      typeof data.selectedWorkspaceId === 'string'
        ? data.selectedWorkspaceId
        : null
  }) satisfies JWT;

// Helper to create session user from JWT
const createSessionUser = (token: JWT): SessionUser => ({
  id: String(token.id),
  name: token.name,
  email: token.email,
  emailVerified: ensureDate(token.emailVerified),
  image: token.image,
  phoneNumber: token.phoneNumber,
  phoneVerified: token.phoneVerified,
  userStatus: token.userStatus,
  workspaces: token.workspaces,
  authMethod: token.authMethod,
  selectedWorkspaceId: token.selectedWorkspaceId,
  languageLocale: 'en',
  timezone: 'UTC'
});

export const authConfig = {
  providers: [...authProviders],
  adapter: createPrismaAdapter(prisma) as Adapter,
  session: SESSION_CONFIG,
  pages: {
    signIn: AUTH_ROUTES.public.login,
    signOut: AUTH_ROUTES.public.login,
    error: AUTH_ROUTES.public.error,
    verifyRequest: AUTH_ROUTES.public.verify
  },
  callbacks: {
    jwt: async ({
      token,
      user,
      account,
      trigger
    }: {
      token: JWT | NextAuthJWT;
      user?: any;
      account?: any;
      trigger?: string;
    }): Promise<JWT> => {
      if (!user) return createJWTPayload(token);

      const authUser = user as unknown as SessionUser;

      // Determine auth method based on the actual login type
      const authMethod = (() => {
        if (account?.type === 'oauth') return AuthMethod.OAUTH;
        if (trigger === 'signIn' && account?.type === 'credentials') {
          if (account.provider === 'phone-login') return AuthMethod.PHONE;
          if (account.provider === 'email-password') return AuthMethod.EMAIL;
        }
        // Ensure we always return a valid AuthMethod value
        return (
          (token.authMethod as AuthMethod) ??
          (authUser.authMethod as AuthMethod) ??
          AuthMethod.EMAIL
        );
      })();

      return createJWTPayload({
        ...token,
        ...authUser,
        userStatus: authUser.userStatus as PlatformUserStatus,
        workspaces: authUser.workspaces?.map((ws) => ({
          ...ws,
          status: ws.status as WorkspaceStatus,
          permissions: ws.permissions.map((p) => p as WorkspacePermissionType)
        })),
        authMethod
      });
    },
    session: async ({ session, token }): Promise<DefaultSession | Session> => {
      if (!token) return {} as Session;

      const jwtToken = createJWTPayload(token);

      return {
        expires: session.expires,
        user: createSessionUser(jwtToken)
      };
    },
    authorized: ({ auth, request: { nextUrl } }) => {
      try {
        const isLoggedIn = !!auth?.user;
        const path = nextUrl.pathname;
        const isAuthPage = path.startsWith('/auth');

        // Redirect authenticated users away from auth pages
        if (isAuthPage && isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        // Redirect unauthenticated users to login for protected routes
        if (!isLoggedIn && isProtectedRoute(path)) {
          const searchParams = new URLSearchParams({
            error: AuthErrorCode.AUTH_REQUIRED,
            callbackUrl: path
          });
          return Response.redirect(
            new URL(`${AUTH_ROUTES.public.login}?${searchParams}`, nextUrl)
          );
        }

        // Allow access to public routes and authenticated protected routes
        return isPublicRoute(path) || isLoggedIn;
      } catch (error) {
        console.error('Auth: Authorization error:', error);
        return Response.redirect(new URL(DEFAULT_ERROR_REDIRECT, nextUrl));
      }
    }
  },
  events: {
    signIn: async ({ user, account, isNewUser }) => {
      console.info('Auth: User signed in:', {
        userId: user.id,
        provider: account?.provider,
        isNewUser
      });
    },
    signOut: async () => {
      console.info('Auth: User signed out');
    },
    createUser: async ({ user }) => {
      console.info('Auth: New user created:', user.id);
    },
    updateUser: async ({ user }) => {
      console.info('Auth: User updated:', user.id);
    },
    linkAccount: async ({ user, account }) => {
      console.info('Auth: Account linked:', {
        userId: user.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId
      });
    },
    session: async ({ session }) => {
      console.info('Auth: Session updated:', {
        expires: session.expires
      });
    }
  }
} satisfies NextAuthConfig;

// Type assertion for the auth function
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: SessionUser;
  }
}
