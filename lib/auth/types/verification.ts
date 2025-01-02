import type {
  VerificationTokenType,
  PlatformUserVerificationToken as DbVerificationToken
} from '@zenstackhq/runtime/models';

export type VerificationType = Extract<
  VerificationTokenType,
  'EMAIL_LOGIN' | 'PHONE_LOGIN'
>;

export interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
}

// Use subset of DB VerificationToken
export interface VerificationToken
  extends Pick<DbVerificationToken, 'identifier' | 'token' | 'type'> {
  expires: Date;
}
