/**
 * Auth Module
 * Centralizes authentication and authorization functionality
 */

export * from './auth-context';
export * from './auth-middleware';
export * from './services';
export * from './errors';
export * from './types/types';

// Export auth instance
export { auth as authConfig } from './config/better-auth';
