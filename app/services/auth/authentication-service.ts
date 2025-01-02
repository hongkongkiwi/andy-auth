/**
 * Authentication Service
 *
 * Handles user authentication via email/password and phone/code combinations.
 * Includes rate limiting, login attempt tracking, and session user creation.
 *
 * @module services/auth/authentication
 */

import type { Prisma } from '@prisma/client';
import { AuthError, AuthErrorCode, AUTH_ERRORS } from '@/lib/auth/errors';
import { prisma } from '@/lib/db';
import { USER_SELECT, AUTH_LIMITS } from '@/lib/auth/constants';
import { comparePasswords } from '@/lib/auth/utils/password-utils';
import { mapUserToSessionUser } from '@/lib/auth/utils/auth-mappers';
import { verificationService } from '.';
import { VerificationTokenType } from '@prisma/client';
import type { SessionUser } from '@/lib/auth/types/user';
import { LoginAuthMethod } from '@/lib/auth/types/auth';

/** User type including password for authentication */
type UserWithPassword = Prisma.PlatformUserGetPayload<{
  select: typeof USER_SELECT & { userPassword: true };
}>;

// Rest of the file remains the same
