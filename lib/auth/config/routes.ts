/**
 * Auth Route Configuration
 *
 * Defines and manages authentication-related routes and patterns including:
 * - Public routes (login, register, etc.)
 * - Protected routes requiring authentication
 * - Route matching patterns for middleware
 * - Redirect paths for auth flows
 * - Utility functions for route validation
 *
 * @module auth/config/routes
 */

// Base paths for different sections of the application
const BASE_PATHS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  WORKSPACE: '/workspace',
  API_AUTH: '/api/auth'
} as const;

export const AUTH_ROUTES = {
  public: {
    login: `${BASE_PATHS.AUTH}/login`,
    register: `${BASE_PATHS.AUTH}/register`,
    verify: `${BASE_PATHS.AUTH}/verify`,
    error: `${BASE_PATHS.AUTH}/error`
  },
  protected: {
    dashboard: BASE_PATHS.DASHBOARD,
    settings: BASE_PATHS.SETTINGS,
    workspace: BASE_PATHS.WORKSPACE
  }
} as const;

// Match patterns for middleware route protection
export const PROTECTED_PATTERNS = [
  `${BASE_PATHS.DASHBOARD}/:path*`,
  `${BASE_PATHS.SETTINGS}/:path*`,
  `${BASE_PATHS.WORKSPACE}/:path*`
] as const;

// Public patterns that should bypass auth checks
export const PUBLIC_PATTERNS = [
  `${BASE_PATHS.AUTH}/:path*`,
  `${BASE_PATHS.API_AUTH}/:path*`
] as const;

// Common redirects
export const DEFAULT_LOGIN_REDIRECT = AUTH_ROUTES.protected.dashboard;
export const DEFAULT_ERROR_REDIRECT = AUTH_ROUTES.public.error;

/**
 * Creates a RegExp pattern for matching route paths
 * @param pattern - Route pattern with optional :path* wildcard
 * @returns RegExp for matching paths
 */
const createPathMatcher = (pattern: string): RegExp =>
  new RegExp(`^${pattern.replace(':path*', '.*')}$`);

/**
 * Checks if a given path is a protected route
 * @param path - URL pathname to check
 * @returns boolean indicating if route requires authentication
 */
export const isProtectedRoute = (path: string): boolean =>
  PROTECTED_PATTERNS.some((pattern) => createPathMatcher(pattern).test(path));

/**
 * Checks if a given path is a public route
 * @param path - URL pathname to check
 * @returns boolean indicating if route is publicly accessible
 */
export const isPublicRoute = (path: string): boolean =>
  PUBLIC_PATTERNS.some((pattern) => createPathMatcher(pattern).test(path));

// Type exports
export type AuthRoutes = typeof AUTH_ROUTES;
export type ProtectedPatterns = (typeof PROTECTED_PATTERNS)[number];
export type PublicPatterns = (typeof PUBLIC_PATTERNS)[number];
