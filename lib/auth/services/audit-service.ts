import {
  Prisma,
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';
import type { NextRequest } from 'next/server';
import {
  backgroundTransaction,
  safeTransaction,
  getProtectedDb
} from '@/lib/db/index';
import type { AuditLogData } from '../types/types';
import type { TransactionClient } from '@/lib/db/types';
import type { TransactionCallback } from '@/lib/db/types';

// Add type for metadata
interface AuditMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export const createAuditLog = async (
  data: AuditLogData,
  tx?: TransactionClient
) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<unknown> = async (transaction) => {
    const actualTx = tx || transaction;
    const createData = {
      ...data,
      metadata: data.metadata || Prisma.JsonNull,
      success: true,
      createdAt: new Date()
    };
    return actualTx.auditLog.create({ data: createData });
  };
  return backgroundTransaction(db, callback);
};

export const getAuditLogs = async (params: {
  userId?: string;
  resourceId?: string;
  eventType?: AuditLogEventType;
  from?: Date;
  to?: Date;
  limit?: number;
}) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<unknown> = async (tx) => {
    const where: Prisma.AuditLogWhereInput = {
      userId: params.userId,
      resourceId: params.resourceId,
      eventType: params.eventType,
      createdAt: {
        gte: params.from,
        lte: params.to
      }
    };
    return tx.auditLog.findMany({
      where,
      orderBy: { createdAt: Prisma.SortOrder.desc },
      take: params.limit ?? 50
    });
  };
  return safeTransaction(db, callback);
};

// Common audit log functions
export const createSecurityAuditLog = async (
  params: {
    userId: string;
    eventType: AuditLogEventType;
    description: string;
    metadata?: AuditMetadata;
    request?: NextRequest;
  },
  tx?: TransactionClient
) => {
  return createAuditLog(
    {
      ...params,
      resourceType: AuditLogResourceType.SECURITY_EVENT,
      resourceId: params.userId,
      severity: AuditSeverityLevel.INFO,
      tableName: 'user'
    },
    tx
  );
};

export const createUserAuditLog = async (
  params: {
    userId: string;
    eventType: AuditLogEventType;
    description: string;
    metadata?: Record<string, any>;
    severity?: AuditSeverityLevel;
    request?: Request;
  },
  tx?: TransactionClient
) => {
  return createServiceAuditLog(
    {
      ...params,
      resourceType: AuditLogResourceType.USER,
      resourceId: params.userId
    },
    tx
  );
};

export const createVerificationAuditLog = async (
  params: {
    userId: string;
    eventType: AuditLogEventType;
    description: string;
    tokenId: string;
    metadata?: AuditMetadata;
    request?: NextRequest;
  },
  tx?: TransactionClient
) => {
  return createAuditLog(
    {
      ...params,
      resourceType: AuditLogResourceType.VERIFICATION,
      resourceId: params.tokenId,
      severity: AuditSeverityLevel.INFO,
      tableName: 'verificationToken',
      metadata: {
        ...params.metadata,
        tokenId: params.tokenId
      }
    },
    tx
  );
};

// Add standardized audit log creator
export const createServiceAuditLog = async (
  params: {
    userId: string;
    eventType: AuditLogEventType;
    description: string;
    resourceType: AuditLogResourceType;
    resourceId: string;
    severity?: AuditSeverityLevel;
    metadata?: Record<string, any>;
    request?: Request;
  },
  tx?: TransactionClient
) => {
  const db = await getProtectedDb();
  const callback: TransactionCallback<unknown> = async (transaction) => {
    const actualTx = tx || transaction;
    const auditData = {
      userId: params.userId,
      eventType: params.eventType,
      description: params.description,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      tableName: params.resourceType.toLowerCase(),
      severity: params.severity ?? AuditSeverityLevel.INFO,
      metadata: {
        ...params.metadata,
        requestPath: params.request?.url,
        requestMethod: params.request?.method
      }
    };
    return actualTx.auditLog.create({ data: auditData });
  };
  return safeTransaction(db, callback);
};
