/**
 * Auth Services Module
 *
 * Centralizes authentication and verification service instances.
 * Provides singleton instances configured with database access.
 *
 * @module services/auth
 */

import { prisma } from '@/lib/db';
import { VerificationService } from './verification-service';
import { authenticationService } from './authentication-service';
import { AuthError, AuthErrorCode } from '@/lib/auth/errors';

let verificationServiceInstance: VerificationService | null = null;

/** Gets singleton instance of verification service */
export const getVerificationService = (): VerificationService => {
  if (!verificationServiceInstance) {
    try {
      verificationServiceInstance = new VerificationService(prisma);
    } catch (error) {
      throw new AuthError(AuthErrorCode.SERVICE_INITIALIZATION_FAILED);
    }
  }
  return verificationServiceInstance;
};

/** Export authentication and verification services */
export { authenticationService };
export const verificationService = getVerificationService();

/** Re-export types */
export type * from './types';
