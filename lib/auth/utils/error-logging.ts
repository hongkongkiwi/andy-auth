import { createAuditLog } from '../services/audit-service';
import {
  AuditLogEventType,
  AuditSeverityLevel,
  AuditLogResourceType
} from '@prisma/client';
import type { NextRequest } from 'next/server';
import { AUTH_ERRORS } from '../errors';
import type { RequestInfo } from './request';
import { getRequestInfo } from './request';

interface LogErrorParams {
  userId?: string;
  context: string;
  action: string;
  request?: Request | NextRequest;
  metadata?: Record<string, any>;
}

/**
 * Logs authentication and authorization errors with proper context
 */
export const logAuthError = async (
  error: unknown,
  params: LogErrorParams
): Promise<void> => {
  try {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const requestInfo = params.request ? getRequestInfo(params.request) : {};

    // Determine if this is a known auth error
    const isAuthError =
      error instanceof Error &&
      Object.values(AUTH_ERRORS).some((e) => error instanceof e);

    // Create audit log entry
    await createAuditLog({
      userId: params.userId || 'anonymous',
      eventType: AuditLogEventType.ERROR,
      description: `${params.context}/${params.action}: ${errorMessage}`,
      resourceType: AuditLogResourceType.AUTH_ERROR,
      resourceId: params.userId || 'system',
      tableName: 'auditLog',
      severity: isAuthError
        ? AuditSeverityLevel.WARNING
        : AuditSeverityLevel.ERROR,
      metadata: {
        success: false,
        error: {
          name: errorName,
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        },
        context: params.context,
        action: params.action,
        ...params.metadata,
        ...requestInfo
      }
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth Error]', {
        context: params.context,
        action: params.action,
        error: errorMessage,
        metadata: params.metadata
      });
    }
  } catch (loggingError) {
    // Fallback console logging if audit logging fails
    console.error('[Error Logging Failed]', {
      originalError: error,
      loggingError,
      context: params.context,
      action: params.action,
      userId: params.userId,
      metadata: params.metadata
    });
  }
};

/**
 * Logs security-related events that require immediate attention
 */
export const logSecurityEvent = async (
  description: string,
  params: LogErrorParams
): Promise<void> => {
  try {
    const requestInfo = params.request ? getRequestInfo(params.request) : {};

    await createAuditLog({
      userId: params.userId || 'anonymous',
      eventType: AuditLogEventType.SUSPICIOUS_ACTIVITY,
      description,
      resourceType: AuditLogResourceType.SECURITY_EVENT,
      resourceId: params.userId || 'system',
      tableName: 'auditLog',
      severity: AuditSeverityLevel.ALERT,
      metadata: {
        context: params.context,
        action: params.action,
        ...params.metadata,
        ...requestInfo
      }
    });

    // Always log security events to console
    console.warn('[Security Event]', {
      description,
      context: params.context,
      action: params.action,
      metadata: params.metadata
    });
  } catch (error) {
    console.error('[Security Logging Failed]', {
      description,
      error,
      context: params.context,
      action: params.action,
      userId: params.userId,
      metadata: params.metadata
    });
  }
};

/**
 * Logs rate limiting events
 */
export const logRateLimitEvent = async (
  params: LogErrorParams & {
    attempts: number;
    limit: number;
    timeWindow: string;
  }
): Promise<void> => {
  try {
    const requestInfo = params.request ? getRequestInfo(params.request) : {};

    await createAuditLog({
      userId: params.userId || 'anonymous',
      eventType: AuditLogEventType.SUSPICIOUS_ACTIVITY,
      description: `Rate limit exceeded: ${params.attempts}/${params.limit} attempts in ${params.timeWindow}`,
      resourceType: AuditLogResourceType.SECURITY_EVENT,
      resourceId: params.userId || 'system',
      tableName: 'auditLog',
      severity: AuditSeverityLevel.WARNING,
      metadata: {
        context: params.context,
        action: params.action,
        attempts: params.attempts,
        limit: params.limit,
        timeWindow: params.timeWindow,
        ...params.metadata,
        ...requestInfo
      }
    });
  } catch (error) {
    console.error('[Rate Limit Logging Failed]', {
      error,
      context: params.context,
      action: params.action,
      userId: params.userId,
      metadata: params.metadata
    });
  }
};
