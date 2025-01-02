import { z } from 'zod';
import { AuthMethodSchema } from './schemas';
import { AUTH_LIMITS } from '../constants';
import { AuthMethod } from '../types/auth';

export const LoginCredentialsSchema = z
  .object({
    authMethod: AuthMethodSchema,
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\+[1-9]\d{1,14}$/, 'Must be E.164 format')
      .optional(),
    password: z.string().min(8).max(72).optional(),
    code: z
      .string()
      .length(AUTH_LIMITS.VERIFICATION.CODE_LENGTH)
      .regex(/^\d+$/, 'Must be numeric')
      .optional()
  })
  .refine(
    (data) => {
      if (data.authMethod === AuthMethod.EMAIL)
        return !!data.email && !!data.password;
      if (data.authMethod === AuthMethod.PHONE)
        return !!data.phone && (!!data.code || !!data.password);
      return false;
    },
    { message: 'Invalid credentials for selected auth method' }
  );

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
