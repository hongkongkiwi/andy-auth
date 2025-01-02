/**
 * Verification Service
 *
 * Handles verification flows:
 * - Email verification
 * - Phone verification
 * - Token generation/validation
 * - Rate limiting
 *
 * @module auth/services/verification
 */

import { AuthError, AuthErrorCode } from '../errors';
import { PrismaClient, VerificationTokenType } from '@prisma/client';
// import { VerificationTokenType } from '@zenstackhq/runtime/models'
import { AUTH_LIMITS } from '../constants';
import type { RateLimitEntry } from '../types/verification';

/** Cache for rate limiting verification attempts */
const RATE_LIMIT_CACHE = new Map<string, RateLimitEntry>();

/** Service for handling user verification flows */
export class VerificationService {
  /**
   * Creates a new verification service instance
   * @param db - Prisma database client instance
   */
  constructor(private db: PrismaClient) {}

  /**
   * Cleans up expired rate limit entries
   * @private
   */
  private cleanupRateLimit(): void {
    const now = Date.now();
    const expiryMs = AUTH_LIMITS.VERIFICATION.EXPIRY_MINUTES * 60 * 1000;

    Array.from(RATE_LIMIT_CACHE.entries()).forEach(([identifier, entry]) => {
      if (now - entry.lastAttempt > expiryMs) {
        RATE_LIMIT_CACHE.delete(identifier);
      }
    });
  }

  /**
   * Checks if verification attempts are within rate limits
   * @param identifier - Email or phone to check
   * @throws {AuthError} If rate limit exceeded
   */
  private checkRateLimit(identifier: string): void {
    this.cleanupRateLimit();
    const now = Date.now();
    const entry = RATE_LIMIT_CACHE.get(identifier) || {
      attempts: 0,
      lastAttempt: now
    };
    const expiryMs = AUTH_LIMITS.VERIFICATION.EXPIRY_MINUTES * 60 * 1000;

    if (now - entry.lastAttempt > expiryMs) {
      entry.attempts = 0;
    }

    if (entry.attempts >= AUTH_LIMITS.VERIFICATION.MAX_ATTEMPTS) {
      throw new AuthError(AuthErrorCode.TOO_MANY_ATTEMPTS, {
        message: 'Too many verification attempts',
        statusCode: AUTH_ERROR_STATUS_CODES.TOO_MANY_ATTEMPTS
      });
    }

    entry.attempts++;
    entry.lastAttempt = now;
    RATE_LIMIT_CACHE.set(identifier, entry);
  }

  /**
   * Verifies a user's credentials against stored verification token
   * @param identifier - User's email or phone
   * @param code - Verification code to validate
   * @param type - Type of verification being performed
   * @returns True if verification successful
   * @throws {AuthError} If verification fails or rate limited
   * @throws {AuthError} INVALID_CREDENTIALS if identifier or code missing
   * @throws {AuthError} VERIFICATION_FAILED if token invalid or expired
   * @throws {AuthError} VERIFICATION_ERROR for other errors
   */
  async verifyCredentials(
    identifier: string | undefined,
    code: string | undefined,
    type: VerificationTokenType
  ): Promise<boolean> {
    try {
      if (!identifier || !code) {
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, {
          message: 'Missing identifier or code',
          statusCode: AUTH_ERROR_STATUS_CODES.INVALID_CREDENTIALS
        });
      }

      this.checkRateLimit(identifier);

      const token = await this.db.platformUserVerificationToken.findFirst({
        where: {
          identifier: String(identifier),
          token: String(code),
          type,
          expiresAt: { gt: new Date() }
        }
      });

      if (!token) {
        throw new AuthError(AuthErrorCode.VERIFICATION_FAILED, {
          message: 'Invalid or expired verification code',
          statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_FAILED
        });
      }

      await this.db.platformUserVerificationToken.delete({
        where: {
          identifier_token_type: {
            identifier: token.identifier,
            token: token.token,
            type: token.type
          }
        }
      });

      return true;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR, {
        message: 'Failed to validate verification code',
        statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_ERROR
      });
    }
  }

  /**
   * Verifies a phone number with a verification code
   * @param phone - Phone number to verify
   * @param code - Verification code
   * @returns True if verification successful
   */
  async verifyPhone(phone: string, code: string): Promise<boolean> {
    return this.verifyCredentials(
      phone,
      code,
      VerificationTokenType.PHONE_LOGIN
    );
  }

  /**
   * Verifies an email address with a verification code
   * @param email - Email to verify
   * @param code - Verification code
   * @returns True if verification successful
   */
  async verifyEmail(email: string, code: string): Promise<boolean> {
    return this.verifyCredentials(
      email,
      code,
      VerificationTokenType.EMAIL_LOGIN
    );
  }

  /**
   * Generates a new verification token
   * @param identifier - Email or phone to verify
   * @param type - Type of verification
   * @returns Generated verification code
   */
  async generateToken(
    identifier: string,
    type: VerificationTokenType
  ): Promise<string> {
    try {
      this.checkRateLimit(identifier);

      const code = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(
        Date.now() + AUTH_LIMITS.VERIFICATION.EXPIRY_MINUTES * 60 * 1000
      );

      await this.db.platformUserVerificationToken.create({
        data: {
          identifier,
          token: code,
          type,
          expiresAt
        }
      });

      return code;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR);
    }
  }

  /**
   * Generates a phone verification token
   * @param phone - Phone number to verify
   * @returns Generated verification code
   */
  async generatePhoneToken(phone: string): Promise<string> {
    return this.generateToken(phone, VerificationTokenType.PHONE_LOGIN);
  }

  /**
   * Generates an email verification token
   * @param email - Email to verify
   * @returns Generated verification code
   */
  async generateEmailToken(email: string): Promise<string> {
    return this.generateToken(email, VerificationTokenType.EMAIL_LOGIN);
  }

  /**
   * Invalidates all existing tokens for an identifier
   * @param identifier - Email or phone to invalidate tokens for
   * @param type - Type of verification
   */
  async invalidateTokens(
    identifier: string,
    type: VerificationTokenType
  ): Promise<void> {
    try {
      await this.db.platformUserVerificationToken.deleteMany({
        where: {
          identifier,
          type
        }
      });
    } catch (error) {
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR);
    }
  }

  /**
   * Checks if user has any active verification tokens
   * @param identifier - Email or phone to check
   * @param type - Type of verification
   * @returns True if active tokens exist
   */
  async hasActiveTokens(
    identifier: string,
    type: VerificationTokenType
  ): Promise<boolean> {
    try {
      const count = await this.db.platformUserVerificationToken.count({
        where: {
          identifier,
          type,
          expiresAt: { gt: new Date() }
        }
      });
      return count > 0;
    } catch (error) {
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR);
    }
  }

  /**
   * Removes all expired verification tokens
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.db.platformUserVerificationToken.deleteMany({
        where: { expiresAt: { lte: new Date() } }
      });
    } catch (error) {
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR, {
        message: 'Failed to cleanup expired tokens',
        statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_ERROR
      });
    }
  }

  /**
   * Checks if a verification code is valid without consuming it
   * @param identifier - User's email or phone
   * @param code - Verification code to validate
   * @param type - Type of verification
   * @returns True if code is valid
   * @throws {AuthError} If rate limited or other errors occur
   */
  async isValidCode(
    identifier: string | undefined,
    code: string | undefined,
    type: VerificationTokenType
  ): Promise<boolean> {
    try {
      if (!identifier || !code) {
        return false;
      }

      this.checkRateLimit(identifier);

      const token = await this.db.platformUserVerificationToken.findFirst({
        where: {
          identifier: String(identifier),
          token: String(code),
          type,
          expiresAt: { gt: new Date() }
        }
      });

      return !!token;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR, {
        message: 'Failed to validate verification code',
        statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_ERROR
      });
    }
  }

  /**
   * Checks if a phone verification code is valid
   * @param phone - Phone number to verify
   * @param code - Verification code
   * @returns True if code is valid
   */
  async isValidPhoneCode(phone: string, code: string): Promise<boolean> {
    return this.isValidCode(phone, code, VerificationTokenType.PHONE_LOGIN);
  }

  /**
   * Checks if an email verification code is valid
   * @param email - Email to verify
   * @param code - Verification code
   * @returns True if code is valid
   */
  async isValidEmailCode(email: string, code: string): Promise<boolean> {
    return this.isValidCode(email, code, VerificationTokenType.EMAIL_LOGIN);
  }

  /**
   * Invalidates all tokens for a user
   * @param identifier - Email or phone to invalidate tokens for
   */
  async invalidateAllTokens(identifier: string): Promise<void> {
    try {
      await this.db.platformUserVerificationToken.deleteMany({
        where: { identifier }
      });
    } catch (error) {
      throw new AuthError(AuthErrorCode.VERIFICATION_ERROR, {
        message: 'Failed to invalidate tokens',
        statusCode: AUTH_ERROR_STATUS_CODES.VERIFICATION_ERROR
      });
    }
  }

  /**
   * Verifies a user's credentials by either email or phone
   * @param identifier - User's email or phone
   * @param code - Verification code
   * @param isEmail - Whether the identifier is an email
   * @returns True if verification successful
   */
  async verifyUser(
    identifier: string,
    code: string,
    isEmail: boolean
  ): Promise<boolean> {
    return this.verifyCredentials(
      identifier,
      code,
      isEmail
        ? VerificationTokenType.EMAIL_LOGIN
        : VerificationTokenType.PHONE_LOGIN
    );
  }
}
