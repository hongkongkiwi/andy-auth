import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';

/**
 * Ensures a value is a valid string or returns null
 * @param value - Any value to convert to string
 * @returns string | null
 */
export const ensureString = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
      message: 'Expected string value',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
    });
  }
  return value;
};

/**
 * Type guard to check if a value is a valid non-empty string
 * @param value - Any value to check
 * @returns boolean
 */
export const isValidString = (value: unknown): value is string => {
  if (!value) return false;
  if (typeof value === 'object') return false;
  return typeof value === 'string' && value.trim() !== '';
};

/**
 * Ensures a value is a valid Date or returns null
 */
export const ensureDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
        message: 'Invalid date string',
        statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
      });
    }
    return date;
  }
  throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
    message: 'Expected date value',
    statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
  });
};
