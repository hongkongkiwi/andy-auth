import { z } from 'zod';
import { PlatformUserCreateSchema } from '@/lib/zenstack/zod/models/PlatformUser.schema';

// Extract email and phone validation from base schema
export const emailSchema = (PlatformUserCreateSchema as any)._def.schema.shape
  .emailAddress;
export const phoneSchema = (PlatformUserCreateSchema as any)._def.schema.shape
  .phoneNumber;

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

// Auth request schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional()
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2),
  phone: phoneSchema.optional()
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  expiresAt: z.date(),
  isRevoked: z.boolean().optional(),
  lastActiveAt: z.date().optional()
});

export type SessionSchema = z.infer<typeof sessionSchema>;
