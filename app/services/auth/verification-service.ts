/**
 * Verification Service
 *
 * Handles user verification via email and phone codes.
 * Includes rate limiting and token validation.
 *
 * @module services/auth/verification
 */

import { AuthError, AuthErrorCode } from '@/lib/auth/errors';
import { PrismaClient, VerificationTokenType } from '@prisma/client';
import { AUTH_LIMITS } from '@/lib/auth/constants';
import type { RateLimitEntry } from '@/lib/auth/types/verification';

/** Cache for rate limiting verification attempts */
const RATE_LIMIT_CACHE = new Map<string, RateLimitEntry>();

// ... rest of the verification service implementation from lib/auth/services/verification-service.ts
