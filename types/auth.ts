import type { PlatformUserStatus, Workspace } from '@prisma/client';

export type AuthMethod = 'EMAIL' | 'PHONE';

export interface AuthCredentials {
  authMethod: AuthMethod;
  email?: string;
  password?: string;
  phone?: string;
  code?: string;
}

export interface AuthValidation {
  success: boolean;
  errors?: Record<string, string>;
  remainingAttempts?: number;
}

export interface VerificationAttempt {
  type: VerificationType;
  attempts: number;
  lastAttempt: Date;
  expiresAt: Date;
}

export type VerificationType = 'PHONE_LOGIN' | 'EMAIL_LOGIN';

export interface ProfileData {
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

// Core User type that other interfaces extend from
export interface BaseUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  phone: string | null;
  phoneVerified: Date | null;
  image: string | null;
  userStatus: PlatformUserStatus;
  selectedWorkspaceId: string | null;
  workspaces: Workspace[];
  personProfile?: ProfileData;
}
