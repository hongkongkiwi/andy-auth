/**
 * Credentials Authentication Provider
 *
 * Handles email/password and phone/code authentication flows.
 * Implements multiple authentication methods:
 * - Email + Password: Traditional login with email verification
 * - Phone + SMS Code: Two-factor authentication with phone
 * - Phone + Password: Alternative login for phone-verified users
 *
 * Features:
 * - Input validation using zod schemas
 * - Secure password comparison
 * - Error handling with custom AuthError types
 * - Session user creation with proper typing
 *
 * @module auth/providers/credentials
 */

import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthMethod } from '../types/auth';
import { isAuthCredentials } from '../utils/type-guards';
import { AuthError, AuthErrorCode, AUTH_ERRORS } from '../errors';
import type { SessionUser } from '../types/user';
import { LoginCredentialsSchema } from '../validations';
import { authenticationService } from '../services';
import type { User } from 'next-auth';
import type { UserWithPassword } from '../utils/auth-mappers';
import { NextAuthAccountType } from '@prisma/client';
import type { AuthUser } from '../types/auth';
import { WorkspaceStatus, WorkspacePermissionType } from '@prisma/client';

/**
 * Type for credentials that have been validated through zod schema
 * Used internally for type safety in authentication flow
 */
type ValidatedCredentials = {
  authMethod: AuthMethod;
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
};

/**
 * Credentials provider configuration for NextAuth
 * Handles validation and authentication of user credentials
 *
 * @throws {AuthError} When validation or authentication fails
 * @returns {Promise<SessionUser | null>} Authenticated user or null
 */
export const credentialsProvider = CredentialsProvider({
  id: 'credentials',
  name: 'Credentials',
  credentials: {
    authMethod: { type: 'text', required: true },
    email: { label: 'Email', type: 'email' },
    phone: { label: 'Phone', type: 'tel' },
    password: { label: 'Password', type: 'password' },
    code: { label: 'SMS Code', type: 'text' }
  },

  authorize: async (
    credentials: Partial<
      Record<'authMethod' | 'email' | 'phone' | 'password' | 'code', unknown>
    >,
    request: Request
  ): Promise<User | null> => {
    try {
      // Validate credentials format
      if (!credentials || !isAuthCredentials(credentials)) {
        throw AUTH_ERRORS.INVALID_CREDENTIALS;
      }

      // Parse and validate credentials
      const validatedCreds =
        await LoginCredentialsSchema.parseAsync(credentials);

      let authenticatedUser;

      switch (validatedCreds.authMethod) {
        case AuthMethod.EMAIL:
          if (!validatedCreds.email || !validatedCreds.password) {
            throw AUTH_ERRORS.INVALID_CREDENTIALS;
          }
          authenticatedUser = await authenticationService.authenticateWithEmail(
            validatedCreds.email,
            validatedCreds.password
          );
          break;

        case AuthMethod.PHONE:
          if (!validatedCreds.phone) {
            throw AUTH_ERRORS.INVALID_CREDENTIALS;
          }
          authenticatedUser = await authenticationService.authenticateWithPhone(
            validatedCreds.phone,
            validatedCreds.code,
            validatedCreds.password
          );
          break;

        default:
          throw AUTH_ERRORS.INVALID_CREDENTIALS;
      }

      // Convert to NextAuth User type
      return {
        id: authenticatedUser.id,
        name: authenticatedUser.personProfile?.firstName ?? null,
        email: authenticatedUser.emailAddress,
        image: authenticatedUser.personProfile?.profileImage ?? null,
        emailVerified: authenticatedUser.emailAddressVerifiedAt,
        phoneNumber: authenticatedUser.phoneNumber,
        phoneVerified: authenticatedUser.phoneNumberVerifiedAt,
        userStatus: authenticatedUser.userStatus,
        workspaces: authenticatedUser.workspacePermissions.map((wp) => ({
          id: wp.workspace.id,
          displayName: wp.workspace.displayName,
          imageUrl: wp.workspace.imageUrl,
          status: wp.workspace.workspaceStatus as WorkspaceStatus,
          slug: wp.workspace.slug ?? '',
          companyName: wp.workspace.companyName ?? '',
          notes: wp.workspace.notes,
          permissions: wp.permissions as WorkspacePermissionType[]
        })),
        authMethod: AuthMethod.EMAIL,
        languageLocale: authenticatedUser.languageLocale ?? 'en',
        timezone: authenticatedUser.timezone ?? 'UTC',
        selectedWorkspaceId: null
      } as AuthUser;
    } catch (error) {
      // Log authentication failures for security monitoring
      console.error('Authentication failed:', error);

      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(AuthErrorCode.AUTHENTICATION_FAILED);
    }
  }
});
