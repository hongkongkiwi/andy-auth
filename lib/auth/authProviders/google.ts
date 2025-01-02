/**
 * Google OAuth Provider
 *
 * Configures and manages Google OAuth 2.0 authentication:
 * - Maps Google profile data to platform user model
 * - Handles email verification status
 * - Manages workspace associations
 * - Sets initial user status
 *
 * Configuration:
 * - Uses environment variables for client credentials
 * - Allows email account linking for existing users
 * - Provides type-safe profile mapping
 *
 * @module auth/providers/google
 */

import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { AuthMethod } from '../types/auth';
import { PlatformUserStatus, NextAuthAccountType } from '@prisma/client';

/**
 * Google provider configuration for NextAuth
 * Maps external Google profile to internal user model
 *
 * @property {string} clientId - Google OAuth client ID from env
 * @property {string} clientSecret - Google OAuth client secret from env
 * @property {boolean} allowDangerousEmailAccountLinking - Enables account merging
 */
export const googleProvider = GoogleProvider({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  profile(profile) {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      image: profile.picture,
      emailVerified: new Date(),
      phoneVerified: null,
      phoneNumber: null,
      authMethod: AuthMethod.OAUTH,
      workspaces: [],
      selectedWorkspaceId: null,
      userStatus: PlatformUserStatus.ACTIVE
    } as const;
  }
});
