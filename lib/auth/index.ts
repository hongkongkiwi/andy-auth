/**
 * Auth Module
 * Centralizes authentication and authorization functionality
 */

// Type exports
export type * from './types';
export type { AdapterUser } from './types/adapter';

// Feature exports
export { auth, signIn, signOut } from './next-auth';
export { authConfig } from './config';
export { createPrismaAdapter } from './prisma-db-adapter';

// Utility exports
export * from './utils';
export * from './services';
export * from './errors';

// Constants and configs
export { AUTH_LIMITS, SESSION_CONFIG } from './constants';
