import { Prisma } from '@prisma/client';
import {
  DB_RETRY_CONFIG,
  type PrismaConnectionError,
  type PrismaDeadlockError
} from './constants';

/**
 * Database error codes for consistent error handling across the application
 */
export enum DbErrorCode {
  // Connection errors
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  QUERY_FAILED = 'QUERY_FAILED',
  DEADLOCK = 'DEADLOCK',

  // Data errors
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  UNIQUE_CONSTRAINT = 'UNIQUE_CONSTRAINT',

  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',

  // General errors
  OPERATION_FAILED = 'OPERATION_FAILED',
  MAX_RETRIES_EXCEEDED = 'MAX_RETRIES_EXCEEDED'
}

/**
 * Additional context for database errors
 * Provides detailed information about the error scenario
 */
export interface DbErrorContext {
  message?: string;
  error?: string;
  attempts?: number;
  [key: string]: unknown;
}

/**
 * Custom database error with additional context
 * Used for consistent error handling across the application
 */
export class DbError extends Error {
  constructor(code: DbErrorCode, context?: DbErrorContext) {
    super(code);
    this.name = 'DbError';
    this.code = code;
    if (context) {
      this.context = context;
    }
  }
  code: DbErrorCode;
  context?: DbErrorContext;
}

/**
 * Determines if an error should trigger a retry attempt
 * @throws {DbError} For connection errors that should not be retried
 */
export const isRetryableError = (error: Error): boolean => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorCode = error.code;

    if (
      DB_RETRY_CONFIG.RETRY_CODES.CONNECTION.includes(
        errorCode as PrismaConnectionError
      )
    ) {
      throw new DbError(DbErrorCode.CONNECTION_FAILED, {
        message: 'Database connection error',
        error: error.message
      });
    }

    return DB_RETRY_CONFIG.RETRY_CODES.DEADLOCK.includes(
      errorCode as PrismaDeadlockError
    );
  }
  return false;
};

/**
 * Maps Prisma errors to custom database errors
 * Provides consistent error handling across the application
 */
export const mapPrismaError = (error: Error): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new DbError(DbErrorCode.RECORD_NOT_FOUND, {
          error: error.message,
          target: error.meta?.target
        });
      case 'P2002':
        throw new DbError(DbErrorCode.UNIQUE_CONSTRAINT, {
          message: 'Unique constraint violation',
          error: error.message,
          fields: error.meta?.target
        });
      default:
        throw new DbError(DbErrorCode.QUERY_FAILED, {
          error: error.message,
          code: error.code
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DbError(DbErrorCode.QUERY_FAILED, {
      message: 'Invalid query parameters',
      error: error.message
    });
  }

  throw error;
};
