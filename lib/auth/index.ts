/**
 * Auth Module
 * Centralizes authentication and authorization functionality
 */

export * from './services';
export * from './middleware';
export * from './errors';
export * from './types';
export * from './utils';

// Export auth instance
export { auth } from './config/better-auth';
