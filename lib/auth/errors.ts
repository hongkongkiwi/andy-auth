import { EntityStatus } from '@prisma/client';
import { APIError } from 'better-auth/api';
import { createErrorFactory } from '@/lib/errors';

/**
 * HTTP Status codes used in authentication responses
 */
export enum StatusCode {
  // Success Codes (2xx)
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Redirection Codes (3xx)
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,

  // Client Error Codes (4xx)
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // Server Error Codes (5xx)
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511
}

/**
 * Type for error metadata that can be attached to auth errors
 */
export type AuthErrorMetadata = Record<string, unknown>;

/**
 * Creates a new authentication error with the given status and message
 */
export const createAuthError = (
  status: StatusCode,
  message: string,
  metadata?: AuthErrorMetadata
): APIError => ({
  message,
  name: 'AuthError',
  status: statusCodeToString(status),
  headers: {
    append: () => {},
    delete: () => {},
    get: () => null,
    getSetCookie: () => [],
    has: () => false,
    set: () => {},
    forEach: () => {},
    entries: () => [] as any,
    keys: () => [] as any,
    values: () => [] as any,
    [Symbol.iterator]: () => [] as any
  },
  body: {
    message,
    code: status.toString()
  }
});

/**
 * Collection of standardized authentication errors
 */
export const AUTH_ERRORS = {
  // Authentication Errors
  USER_NOT_FOUND: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.NOT_FOUND, 'User not found', metadata),

  INVALID_CREDENTIALS: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Invalid credentials', metadata),

  // Account Status Errors
  ACCOUNT_LOCKED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Account is locked', metadata),

  ACCOUNT_DISABLED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Account is disabled', metadata),

  ACCOUNT_SUSPENDED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Account is suspended', metadata),

  ACCOUNT_DELETE_BLOCKED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.FORBIDDEN,
      'Account deletion is blocked',
      metadata
    ),

  // Session Errors
  SESSION_REQUIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.UNAUTHORIZED,
      'Authentication required',
      metadata
    ),

  SESSION_EXPIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Session has expired', metadata),

  SESSION_INVALID: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Invalid session', metadata),

  INVALID_SESSION: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.UNAUTHORIZED,
      'Invalid or malformed session',
      metadata
    ),

  // Password Errors
  INVALID_PASSWORD_FORMAT: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid password format',
      metadata
    ),

  PASSWORD_CHANGE_REQUIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Password change required', metadata),

  PASSWORD_RESET_EXPIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Password reset token has expired',
      metadata
    ),

  // Verification Errors
  INVALID_VERIFICATION_TOKEN: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid verification token',
      metadata
    ),

  VERIFICATION_EXPIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Verification token has expired',
      metadata
    ),

  INVALID_CODE: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid verification code',
      metadata
    ),

  INVALID_VERIFICATION_CODE: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid verification code',
      metadata
    ),

  // Resource Access Errors
  WORKSPACE_NOT_FOUND: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.NOT_FOUND, 'Workspace not found', metadata),

  CLIENT_NOT_FOUND: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.NOT_FOUND, 'Client not found', metadata),

  LOCATION_NOT_FOUND: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.NOT_FOUND, 'Location not found', metadata),

  // Permission Errors
  WORKSPACE_ACCESS_DENIED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Workspace access denied', metadata),

  CLIENT_ACCESS_DENIED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Client access denied', metadata),

  LOCATION_ACCESS_DENIED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Location access denied', metadata),

  // Role Validation Errors
  INVALID_WORKSPACE_ROLE: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid workspace permission role',
      metadata
    ),

  INVALID_CLIENT_ROLE: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid client permission role',
      metadata
    ),

  INVALID_LOCATION_ROLE: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid location permission role',
      metadata
    ),

  // Rate Limiting
  TOO_MANY_REQUESTS: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.TOO_MANY_REQUESTS,
      'Too many requests. Please try again later.',
      metadata
    ),

  // Generic Errors
  BAD_REQUEST: (message: string, metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.BAD_REQUEST, message, metadata),

  INTERNAL_ERROR: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred',
      metadata
    ),

  // Security Errors
  SECURITY_EVENT: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.FORBIDDEN, 'Security event detected', metadata),

  WEBHOOK_VALIDATION_FAILED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Webhook validation failed',
      metadata
    ),

  // Session State Errors
  SESSION_REVOKED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.UNAUTHORIZED,
      'Session has been revoked',
      metadata
    ),

  DEVICE_NOT_RECOGNIZED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Unrecognized device', metadata),

  LOCATION_CHANGE_DETECTED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.UNAUTHORIZED,
      'Unusual location detected',
      metadata
    ),

  // API Related Errors
  API_KEY_INVALID: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Invalid API key', metadata),

  API_KEY_EXPIRED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'API key has expired', metadata),

  API_VERSION_UNSUPPORTED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'API version not supported',
      metadata
    ),

  API_RATE_LIMIT_WARNING: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.TOO_MANY_REQUESTS,
      'Approaching rate limit',
      metadata
    ),

  METHOD_NOT_ALLOWED: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.METHOD_NOT_ALLOWED,
      'HTTP method not allowed',
      metadata
    ),

  // Permission errors
  PERMISSION_DENIED: ({
    context,
    permissionType,
    resourceId
  }: {
    context: string;
    permissionType: string;
    resourceId?: string;
  }) =>
    createAuthError(StatusCode.FORBIDDEN, `Permission denied: ${context}`, {
      permissionType,
      resourceId
    }),

  INACTIVE_USER: ({ userId, status }: { userId: string; status: string }) =>
    createAuthError(StatusCode.FORBIDDEN, 'User account is not active', {
      userId,
      status
    }),

  INACTIVE_RESOURCE: ({
    resourceId,
    resourceType,
    status
  }: {
    resourceId: string;
    resourceType: string;
    status: EntityStatus;
  }) =>
    createAuthError(StatusCode.FORBIDDEN, `${resourceType} is not active`, {
      resourceId,
      resourceType,
      status
    }),

  UNAUTHORIZED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.UNAUTHORIZED, 'Unauthorized access', metadata),

  VERIFICATION_FAILED: (metadata?: AuthErrorMetadata) =>
    createAuthError(StatusCode.BAD_REQUEST, 'Verification failed', metadata),

  // Phone Number Errors
  INVALID_PHONE_NUMBER: (metadata?: AuthErrorMetadata) =>
    createAuthError(
      StatusCode.BAD_REQUEST,
      'Invalid phone number format',
      metadata
    )
} as const;

/**
 * Handles unknown errors by converting them to APIError format
 */
export const handleAuthError = (error: unknown): never => {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw createAuthError(StatusCode.INTERNAL_SERVER_ERROR, error.message, {
      originalError: error
    });
  }

  throw createAuthError(
    StatusCode.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    { originalError: error }
  );
};

// Map StatusCode enum to better-auth status strings
const statusCodeToString = (code: StatusCode): APIError['status'] => {
  switch (code) {
    // 2xx
    case StatusCode.OK:
      return 'OK';
    case StatusCode.CREATED:
      return 'CREATED';
    case StatusCode.ACCEPTED:
      return 'ACCEPTED';
    case StatusCode.NO_CONTENT:
      return 'NO_CONTENT';
    // 3xx
    case StatusCode.MULTIPLE_CHOICES:
      return 'MULTIPLE_CHOICES';
    case StatusCode.MOVED_PERMANENTLY:
      return 'MOVED_PERMANENTLY';
    case StatusCode.FOUND:
      return 'FOUND';
    case StatusCode.SEE_OTHER:
      return 'SEE_OTHER';
    case StatusCode.NOT_MODIFIED:
      return 'NOT_MODIFIED';
    case StatusCode.TEMPORARY_REDIRECT:
      return 'TEMPORARY_REDIRECT';
    // 4xx
    case StatusCode.BAD_REQUEST:
      return 'BAD_REQUEST';
    case StatusCode.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case StatusCode.FORBIDDEN:
      return 'FORBIDDEN';
    case StatusCode.NOT_FOUND:
      return 'NOT_FOUND';
    case StatusCode.METHOD_NOT_ALLOWED:
      return 'METHOD_NOT_ALLOWED';
    case StatusCode.NOT_ACCEPTABLE:
      return 'NOT_ACCEPTABLE';
    case StatusCode.REQUEST_TIMEOUT:
      return 'REQUEST_TIMEOUT';
    case StatusCode.CONFLICT:
      return 'CONFLICT';
    case StatusCode.GONE:
      return 'GONE';
    case StatusCode.UNPROCESSABLE_ENTITY:
      return 'UNPROCESSABLE_ENTITY';
    case StatusCode.TOO_MANY_REQUESTS:
      return 'TOO_MANY_REQUESTS';
    // 5xx
    case StatusCode.INTERNAL_SERVER_ERROR:
      return 'INTERNAL_SERVER_ERROR';
    case StatusCode.NOT_IMPLEMENTED:
      return 'NOT_IMPLEMENTED';
    case StatusCode.BAD_GATEWAY:
      return 'BAD_GATEWAY';
    case StatusCode.SERVICE_UNAVAILABLE:
      return 'SERVICE_UNAVAILABLE';
    case StatusCode.GATEWAY_TIMEOUT:
      return 'GATEWAY_TIMEOUT';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
};

export const WORKSPACE_ERRORS = {
  UNAUTHORIZED: createErrorFactory('WORKSPACE.UNAUTHORIZED'),
  NOT_FOUND: createErrorFactory('WORKSPACE.NOT_FOUND'),
  INVALID_STATUS: createErrorFactory('WORKSPACE.INVALID_STATUS'),
  ALREADY_EXISTS: createErrorFactory('WORKSPACE.ALREADY_EXISTS')
} as const;
