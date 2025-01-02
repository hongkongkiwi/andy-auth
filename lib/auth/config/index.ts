/**
 * Auth Configuration Module
 *
 * Central export point for authentication configuration and types.
 * Provides access to:
 * - Core auth configuration
 * - Route definitions and helpers
 * - Type definitions for auth entities
 * - Common auth-related constants
 *
 * @module auth/config
 */

// Centralize configuration exports
export { authConfig } from './auth-config';
export * from './routes';

// Export commonly used constants
export {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ERROR_REDIRECT,
  isProtectedRoute,
  isPublicRoute
} from './routes';
