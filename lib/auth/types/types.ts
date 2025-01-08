import type { Prisma } from '@prisma/client';
import type { User } from 'better-auth/types';

// Common Types
export type JsonValue = Prisma.JsonValue;

// Audit Types
export interface AuditLogData
  extends Omit<Prisma.AuditLogCreateInput, 'metadata'> {
  metadata?: Record<string, any>;
  tableName?: string;
}

// Auth Types
export interface AuthUser extends User {
  personProfile?: {
    firstName?: string;
  };
  emailAddress?: string;
}

// Re-export permission types
export * from './permissions';
