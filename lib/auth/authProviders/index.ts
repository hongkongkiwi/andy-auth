/**
 * Authentication Providers Configuration
 *
 * Centralizes all authentication provider configurations:
 *
 * Supported Providers:
 * - Credentials: Email/password and phone authentication
 * - Google OAuth: Social authentication with Google
 *
 * Features:
 * - Type-safe provider configurations
 * - Centralized provider exports
 * - NextAuth.js integration
 * - Proper type inference for auth config
 *
 * @module auth/providers
 */

import type { NextAuthConfig } from 'next-auth';
import { credentialsProvider } from './credentials';
import { googleProvider } from './google';

/** Individual provider exports for flexible usage */
export { credentialsProvider } from './credentials';
export { googleProvider } from './google';

/**
 * Combined providers array for NextAuth configuration
 * Ensures type safety and proper provider initialization
 *
 * @const {NextAuthConfig["providers"]}
 */
export const authProviders = [
  credentialsProvider,
  googleProvider
] as const satisfies NextAuthConfig['providers'];

/** Type definition for supported auth providers */
export type AuthProviders = typeof authProviders;
