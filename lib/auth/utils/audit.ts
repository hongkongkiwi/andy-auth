import type { NextRequest } from 'next/server';
import type { Session } from 'better-auth';
import type { RequestInfo } from './request';
import { createAuditLog } from '../services/audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';

export const auditSensitiveOperation = async (
  session: Session,
  request: NextRequest,
  requestInfo: RequestInfo
) => {
  await createAuditLog({
    userId: session.userId,
    eventType: AuditLogEventType.SUSPICIOUS_ACTIVITY,
    description: `${request.method} ${request.nextUrl.pathname}`,
    severity: AuditSeverityLevel.WARNING,
    resourceType: AuditLogResourceType.SECURITY_EVENT,
    resourceId: session.userId,
    tableName: 'auditLog',
    ...requestInfo,
    metadata: {
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    }
  });
};
