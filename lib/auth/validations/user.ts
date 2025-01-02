import { z } from 'zod';
import type { PlatformUser } from '@prisma/client';
import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';

// Basic user schema until Zenstack schemas are available
export const UserSchema = z.object({
  id: z.string(),
  emailAddress: z.string().email().nullable(),
  emailAddressVerifiedAt: z.date().nullable(),
  phoneNumber: z.string().nullable(),
  phoneNumberVerifiedAt: z.date().nullable(),
  userStatus: z.string(),
  languageLocale: z.string().default('en'),
  timezone: z.string().default('UTC')
});

export type User = PlatformUser;

// Add error handling for schema validation
export const validateUser = (data: unknown) => {
  try {
    return UserSchema.parse(data);
  } catch (error) {
    throw new AuthError(AuthErrorCode.INVALID_USER_DATA, {
      message: 'Invalid user data',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_USER_DATA,
      error: error instanceof Error ? error.message : 'Validation error'
    });
  }
};
