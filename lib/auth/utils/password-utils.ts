import bcrypt from 'bcrypt-mini';
import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';

const SALT_ROUNDS = 10;

export const comparePasswords = (
  plaintext: string | undefined,
  hash: string | undefined
): boolean => {
  if (!plaintext || !hash) return false;

  try {
    return bcrypt.compareSync(String(plaintext), String(hash));
  } catch (error) {
    console.error('Password comparison failed:', error);
    return false;
  }
};

export const hashPassword = (password: string): string => {
  if (!password) {
    throw new AuthError(AuthErrorCode.INVALID_PASSWORD, {
      message: 'Password is required',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_PASSWORD
    });
  }

  try {
    return bcrypt.hashSync(String(password), SALT_ROUNDS);
  } catch (error) {
    throw new AuthError(AuthErrorCode.AUTHENTICATION_FAILED, {
      message: 'Failed to hash password',
      statusCode: AUTH_ERROR_STATUS_CODES.AUTHENTICATION_FAILED
    });
  }
};
