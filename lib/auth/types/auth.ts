import type { NextRequest } from 'next/server';
import type { SessionUser } from './user';
import type { Workspace } from './workspace';
import type { Client } from './client';
import type {
  NextAuthAccountType,
  VerificationTokenType
} from '@zenstackhq/runtime/models';
import type { User } from 'next-auth';
import type { WorkspaceWithPermissions } from './workspace';
import type { PlatformUserStatus } from '@zenstackhq/runtime/models';

// Use the DB enum instead of our own
export enum AuthMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  OAUTH = 'OAUTH',
  OIDC = 'OIDC',
  WEBAUTHN = 'WEBAUTHN'
}

export type LoginAttemptType = Extract<
  VerificationTokenType,
  'EMAIL_LOGIN' | 'PHONE_LOGIN' | 'PHONE_ADD'
>;

export enum LoginAuthMethod {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE'
}

// Auth status type
export type AuthStatus = 'AUTHENTICATED' | 'UNAUTHENTICATED';

// Store state interface
export interface AuthState {
  isLoading: boolean;
  error: Error | null;
  currentWorkspace: Workspace | null;
  currentClient: Client | null;
}

export interface AuthCredentials {
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
  authMethod: AuthMethod;
}

export interface AuthRequest extends NextRequest {
  auth?: {
    isAuthenticated: boolean;
    user?: SessionUser;
  };
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  phoneNumber: string | null;
  phoneVerified: Date | null;
  userStatus: PlatformUserStatus;
  workspaces: WorkspaceWithPermissions[];
  authMethod: AuthMethod;
  languageLocale: string;
  timezone: string;
  selectedWorkspaceId: string | null;
}
