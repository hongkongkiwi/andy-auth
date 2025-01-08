import { z } from 'zod';
import { UserStatus } from '@prisma/client';
import { UserCreateSchema, UserUpdateSchema } from '@/lib/schemas/models';

// Extend the Zenstack-generated user schema with additional fields
export const userSchema = UserCreateSchema.extend({
  status: z.nativeEnum(UserStatus),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.date().nullable(),
  failedLoginAttempts: z.number().min(0).default(0),
  lastLoginAt: z.date().nullable(),
  lockoutUntil: z.date().nullable()
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Registration validation
export const registrationSchema = UserCreateSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
  phoneNumber: z.string().optional()
});

// Password reset validation
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
});

// Email verification validation
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// Phone verification validation
export const phoneVerificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
  phone: z.string().min(1, 'Phone number is required')
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
});

// Profile update validation
export const profileUpdateSchema = UserUpdateSchema.extend({
  phoneNumber: z.string().optional()
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type PhoneVerificationInput = z.infer<typeof phoneVerificationSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Basic validation schemas
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

export const phoneSchema = z
  .string()
  .regex(
    /^\+[1-9]\d{10,14}$/,
    'Phone number must be in E.164 format (e.g. +12125551234)'
  );

export const emailSchema = z.string().email('Invalid email address');
