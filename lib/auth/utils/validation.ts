import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';
import type { AdapterUser } from '../types/adapter';

export const validateUserData = (data: Partial<AdapterUser>): boolean => {
  if (!data.email) {
    throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
      message: 'Email is required',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
      message: `Invalid email format: ${data.email}`,
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
    });
  }

  return true;
};
