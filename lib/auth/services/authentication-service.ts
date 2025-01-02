/**
 * Authentication Service
 *
 * Core authentication logic including:
 * - Email/password authentication
 * - Phone/code authentication
 * - Session user creation
 * - Login attempt tracking
 * - Rate limiting
 *
 * @module auth/services/authentication
 */

import type { Prisma } from '@prisma/client';
import { VerificationTokenType } from '@prisma/client';
import { AuthError, AuthErrorCode, AUTH_ERRORS } from '../errors';
import { prisma } from '@/lib/db';
import {
  USER_SELECT,
  AUTH_LIMITS,
  USER_WITH_PASSWORD_SELECT
} from '../constants';
import { comparePasswords } from '../utils/password-utils';
import {
  mapUserToSessionUser,
  UserWithPassword,
  UserWithProfile
} from '../utils/auth-mappers';
import { verificationService } from '.';
import type { SessionUser } from '../types/user';
import { LoginAuthMethod } from '../types/auth';

/** Core authentication service interface */
interface AuthenticationService {
  authenticateWithEmail: (
    email: string,
    password: string
  ) => Promise<UserWithPassword>;
  authenticateWithPhone: (
    phone: string,
    code?: string,
    password?: string
  ) => Promise<UserWithPassword>;
  createSessionUser: (user: UserWithPassword) => SessionUser;
  validateLoginAttempts: (identifier: string) => Promise<void>;
  authenticateUser: (
    identifier: string,
    code?: string,
    password?: string,
    isEmail?: boolean
  ) => Promise<UserWithPassword>;
}

/**
 * Handles authentication errors consistently
 * @param error - The error to handle
 * @throws {AuthError} Always throws either the original AuthError or a new AUTHENTICATION_FAILED error
 */
const handleAuthenticationError = (error: unknown): never => {
  if (error instanceof AuthError) throw error;
  throw new AuthError(AuthErrorCode.AUTHENTICATION_FAILED, {
    message: 'Authentication failed',
    statusCode: AUTH_ERROR_STATUS_CODES.AUTHENTICATION_FAILED
  });
};

/**
 * Validates user credentials and manages login attempts
 * @param user - The user to validate, if found
 * @param identifier - Email or phone used for login attempt tracking
 * @param validateFn - Function to validate the credentials
 * @returns The validated user
 * @throws {AuthError} If validation fails or user not found
 */
const validateCredentials = async (
  user: UserWithPassword | null,
  identifier: string,
  validateFn: () => Promise<boolean>
): Promise<UserWithPassword> => {
  if (!user?.id) {
    throw new AuthError(AuthErrorCode.USER_NOT_FOUND, {
      message: 'User not found',
      statusCode: AUTH_ERROR_STATUS_CODES.USER_NOT_FOUND
    });
  }

  try {
    const isValid = await validateFn();
    if (!isValid) {
      await recordLoginAttempt(user.id, identifier, false);
      throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, {
        message: 'Invalid credentials',
        statusCode: AUTH_ERROR_STATUS_CODES.INVALID_CREDENTIALS
      });
    }

    await recordLoginAttempt(user.id, identifier, true);
    return user;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(AuthErrorCode.AUTHENTICATION_FAILED);
  }
};

/** Primary authentication service implementation */
export const authenticationService: AuthenticationService = {
  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Authenticated user data
   * @throws {AuthError} INVALID_CREDENTIALS if credentials invalid
   * @throws {AuthError} USER_NOT_FOUND if user doesn't exist
   * @throws {AuthError} TOO_MANY_ATTEMPTS if rate limited
   */
  authenticateWithEmail: async (
    email: string,
    password: string
  ): Promise<UserWithPassword> => {
    try {
      await authenticationService.validateLoginAttempts(email);

      const user = (await prisma.platformUser.findUnique({
        where: { emailAddress: email },
        select: USER_WITH_PASSWORD_SELECT
      })) as UserWithPassword;

      return validateCredentials(
        user,
        email,
        async () =>
          !!user?.userPassword && comparePasswords(password, user.userPassword)
      );
    } catch (error) {
      throw handleAuthenticationError(error);
    }
  },

  /**
   * Authenticates a user with phone number and either code or password
   * @param phone - User's phone number
   * @param code - Optional verification code
   * @param password - Optional password (used if code not provided)
   * @returns Authenticated user data
   * @throws {AuthError} INVALID_CREDENTIALS if credentials invalid
   * @throws {AuthError} USER_NOT_FOUND if user doesn't exist
   * @throws {AuthError} TOO_MANY_ATTEMPTS if rate limited
   * @throws {AuthError} VERIFICATION_FAILED if code verification fails
   */
  authenticateWithPhone: async (
    phone: string,
    code?: string,
    password?: string
  ): Promise<UserWithPassword> => {
    try {
      await authenticationService.validateLoginAttempts(phone);

      const user = await prisma.platformUser.findUnique({
        where: { phoneNumber: phone },
        select: code ? USER_SELECT : { ...USER_SELECT, userPassword: true }
      });

      return validateCredentials(user, phone, async () => {
        if (code) {
          return verificationService.verifyCredentials(
            phone,
            code,
            VerificationTokenType.PHONE_LOGIN
          );
        }
        return (
          !!user?.userPassword &&
          !!password &&
          comparePasswords(password, user.userPassword)
        );
      });
    } catch (error) {
      throw handleAuthenticationError(error);
    }
  },

  /**
   * Creates a session user from authenticated user data
   * @param user - The authenticated user data
   * @returns Formatted session user object
   */
  createSessionUser: (user: UserWithPassword): SessionUser =>
    mapUserToSessionUser(user),

  /**
   * Validates login attempts for rate limiting
   * @param identifier - Email or phone to check
   * @throws {AuthError} If too many failed attempts
   */
  validateLoginAttempts: async (identifier: string): Promise<void> => {
    const recentAttempts = await prisma.platformUserLoginAttempt.count({
      where: {
        isLoginFailed: true,
        userAgent: identifier,
        createdAt: {
          gte: new Date(
            Date.now() - AUTH_LIMITS.LOGIN.LOCKOUT_MINUTES * 60 * 1000
          )
        }
      }
    });

    if (recentAttempts >= AUTH_LIMITS.LOGIN.MAX_ATTEMPTS) {
      throw new AuthError(AuthErrorCode.TOO_MANY_ATTEMPTS, {
        message: 'Too many failed login attempts',
        statusCode: AUTH_ERROR_STATUS_CODES.TOO_MANY_ATTEMPTS
      });
    }
  },

  /**
   * Authenticates a user with either email or phone
   * @param identifier - User's email or phone
   * @param code - Optional verification code
   * @param password - Optional password
   * @param isEmail - Whether the identifier is an email
   * @returns Authenticated user data
   */
  authenticateUser: async (
    identifier: string,
    code?: string,
    password?: string,
    isEmail = true
  ): Promise<UserWithPassword> => {
    return isEmail
      ? authenticationService.authenticateWithEmail(identifier, password!)
      : authenticationService.authenticateWithPhone(identifier, code, password);
  }
};

/**
 * Records a login attempt for tracking and rate limiting
 * @param userId - ID of the user attempting to login
 * @param identifier - Email or phone used for the attempt
 * @param success - Whether the login was successful
 */
const recordLoginAttempt = async (
  userId: string | undefined,
  identifier: string,
  success: boolean
): Promise<void> => {
  if (!userId) return;

  try {
    const data: Prisma.PlatformUserLoginAttemptCreateInput = {
      isLoginFailed: !success,
      userAgent: identifier,
      createdAt: new Date(),
      updatedAt: new Date(),
      authMethod: success ? LoginAuthMethod.SUCCESS : LoginAuthMethod.FAILED,
      failureReason: success ? null : 'INVALID_CREDENTIALS',
      user: { connect: { id: userId } }
    };

    await prisma.platformUserLoginAttempt.create({ data });
  } catch (error) {
    console.error('Failed to record login attempt:', {
      userId,
      identifier,
      success,
      error
    });
  }
};
