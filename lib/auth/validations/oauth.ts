import { z } from 'zod';

// These are OAuth-specific schemas that aren't in our DB, so we keep them
export const OAuthProfileSchema = z
  .object({
    email: z.string().email().max(321),
    name: z.string().max(150).nullable(),
    image: z
      .string()
      .url()
      .regex(/^https:\/\//i, 'URL must use HTTPS')
      .nullable(),
    emailVerified: z.boolean().nullable()
  })
  .strict();

// Provider-specific schemas extend the base OAuth schema
export const GoogleProfileSchema = OAuthProfileSchema.extend({
  given_name: z.string().max(150).optional(),
  family_name: z.string().max(150).optional(),
  locale: z.string().max(10).optional()
}).strict();

export const AppleProfileSchema = z
  .object({
    email: z.string().email().max(321),
    name: z.string().max(150).optional(),
    sub: z.string().max(255).optional(),
    email_verified: z.boolean().optional()
  })
  .passthrough();

export const LinkedInProfileSchema = z
  .object({
    email: z.string().email().max(321),
    name: z.string().max(150).optional(),
    sub: z.string().max(255).optional(),
    given_name: z.string().max(150).optional(),
    family_name: z.string().max(150).optional(),
    email_verified: z.boolean().optional(),
    picture: z
      .string()
      .url()
      .regex(/^https:\/\//i, 'URL must use HTTPS')
      .optional(),
    locale: z.string().max(10).optional()
  })
  .passthrough();

export const AzureADB2CProfileSchema = z
  .object({
    emails: z.array(z.string().email().max(321)).optional(),
    preferred_username: z.string().email().max(321).optional(),
    name: z.string().max(150).optional(),
    given_name: z.string().max(150).optional(),
    family_name: z.string().max(150).optional(),
    sub: z.string().max(255).optional(),
    tid: z.string().max(255).optional(),
    oid: z.string().max(255).optional()
  })
  .passthrough()
  .refine((data) => data.emails?.[0] || data.preferred_username, {
    message: 'Either emails or preferred_username must be present'
  });

// Export types
export type GoogleProfileType = z.infer<typeof GoogleProfileSchema>;
export type AppleProfileType = z.infer<typeof AppleProfileSchema>;
export type LinkedInProfileType = z.infer<typeof LinkedInProfileSchema>;
export type AzureADB2CProfileType = z.infer<typeof AzureADB2CProfileSchema>;
