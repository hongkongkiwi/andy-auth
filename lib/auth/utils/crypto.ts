import { randomBytes } from 'crypto';
import { hashSync, compareSync } from 'bcrypt-mini';
import { createId } from '@paralleldrive/cuid2';
import { AUTH_CONFIG } from '../config/better-auth';

/**
 * Generate a secure random token
 * @param bytes Number of bytes for token (default: 32)
 * @returns Hex string token
 */
export const generateToken = (bytes: number = 32): string => {
  return randomBytes(bytes).toString('hex');
};

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise containing the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return Promise.resolve(
    hashSync(password, AUTH_CONFIG.SECURITY.BCRYPT_SALT_ROUNDS)
  );
};

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hash to verify against
 * @returns Promise<boolean> indicating if password matches
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return Promise.resolve(compareSync(password, hash));
};

/**
 * Generate a verification code
 * @param length Length of code (default: 6)
 * @returns Numeric verification code string
 */
export const generateVerificationCode = (
  length: number = AUTH_CONFIG.SECURITY.VERIFICATION_CODE_LENGTH
): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

/**
 * Generate a secure session token
 * @returns Session token string
 */
export const generateSessionToken = (): string => {
  return `${createId()}.${generateToken(32)}`;
};

/**
 * Verify a password for auth purposes (used by better-auth)
 */
export const verifyPasswordForAuth = async (data: {
  password: string;
  hash: string;
}): Promise<boolean> => {
  return verifyPassword(data.password, data.hash);
};
