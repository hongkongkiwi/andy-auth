import type { AuthCredentials } from '../types/auth';
import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';
import { LoginCredentialsSchema } from '../validations';

export const isAuthCredentials = (data: unknown): data is AuthCredentials => {
  try {
    LoginCredentialsSchema.parse(data);
    return true;
  } catch (error) {
    throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
      message: 'Invalid authentication credentials',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA
    });
  }
};
