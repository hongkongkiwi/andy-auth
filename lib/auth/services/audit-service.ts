import { prisma } from '@/lib/db';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  Prisma
} from '@prisma/client';

export interface AuditLogData {
  userId: string;
  eventType: AuditLogEventType;
  resourceType: AuditLogResourceType;
  resourceId: string;
  tableName: string;
  changes?: Record<string, any>; // Optional for non-modification events
  description: string; // Required human-readable description
  severity: AuditSeverityLevel; // Required severity level
  metadata?: Record<string, any>; // Optional additional context
  ipAddress?: string; // Optional IP address
  userAgent?: string; // Optional user agent
}

const TABLE_TO_RESOURCE_TYPE: Record<string, AuditLogResourceType> = {
  workspace: AuditLogResourceType.WORKSPACE,
  client: AuditLogResourceType.CLIENT,
  location: AuditLogResourceType.LOCATION,
  platformUser: AuditLogResourceType.USER,
  guardProfile: AuditLogResourceType.GUARD,
  device: AuditLogResourceType.DEVICE,
  incident: AuditLogResourceType.INCIDENT,
  authSession: AuditLogResourceType.SESSION,
  setting: AuditLogResourceType.SETTING,
  objectStorageFile: AuditLogResourceType.FILE
};

// Helper to determine severity based on event type
const getDefaultSeverity = (
  eventType: AuditLogEventType
): AuditSeverityLevel => {
  switch (eventType) {
    case AuditLogEventType.SUSPICIOUS_ACTIVITY:
    case AuditLogEventType.ACCOUNT_LOCKED:
      return AuditSeverityLevel.ALERT;

    case AuditLogEventType.LOGIN_FAILED:
    case AuditLogEventType.DELETE:
    case AuditLogEventType.PERMISSION_REVOKED:
      return AuditSeverityLevel.WARNING;

    case AuditLogEventType.CREATE:
    case AuditLogEventType.UPDATE:
    case AuditLogEventType.DELETE:
    case AuditLogEventType.LOGIN:
    case AuditLogEventType.LOGOUT:
      return AuditSeverityLevel.INFO;

    default:
      return AuditSeverityLevel.INFO;
  }
};

export const createAuditLog = async (
  data: AuditLogData,
  tx?: Prisma.TransactionClient
) => {
  const client = tx || prisma;
  return client.auditLog.create({ data });
};

export const createVerificationAuditLog = async (data: {
  userId: string;
  eventType: AuditLogEventType;
  description: string;
  resourceId: string;
  request?: Request;
  metadata?: Record<string, any>;
}) => {
  return createAuditLog({
    ...data,
    resourceType: AuditLogResourceType.VERIFICATION,
    tableName: 'platformUserVerificationToken',
    severity: AuditSeverityLevel.INFO
  });
};

export const createAuthAuditLog = async (data: {
  userId: string;
  eventType: AuditLogEventType;
  description: string;
  resourceId: string;
  request?: Request;
  success?: boolean;
  metadata?: Record<string, any>;
}) => {
  return createAuditLog({
    ...data,
    resourceType: AuditLogResourceType.USER,
    tableName: 'platformUser',
    severity: data.eventType.includes('FAILED')
      ? AuditSeverityLevel.WARNING
      : AuditSeverityLevel.INFO
  });
};

export const createUserAuditLog = async (data: {
  userId: string;
  eventType: AuditLogEventType;
  description: string;
  resourceId: string;
  request?: Request;
  metadata?: Record<string, any>;
}) => {
  return createAuditLog({
    ...data,
    resourceType: AuditLogResourceType.USER,
    tableName: 'platformUser',
    severity: AuditSeverityLevel.INFO
  });
};
