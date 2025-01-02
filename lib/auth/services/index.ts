/**
 * Auth Services Module
 *
 * Exports authentication and verification services:
 * - Authentication (email/password, phone/code)
 * - Verification (email/phone verification flows)
 *
 * @module auth/services
 */

import { prisma } from '@/lib/db';
import { VerificationService } from './verification-service';
import { authenticationService } from './authentication-service';

export const verificationService = new VerificationService(prisma);
export { authenticationService };
