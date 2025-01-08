import { Prisma } from '@prisma/client';

/**
 * Custom error class for database-related errors
 * Provides consistent error handling across the application
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Create a database error from an unknown error
 * Handles Prisma errors and unknown errors consistently
 */
export const createDatabaseError = (error: unknown): DatabaseError => {
  if (error instanceof DatabaseError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new DatabaseError(
      `Database error: ${error.message}`,
      error,
      error.code
    );
  }

  if (error instanceof Error) {
    return new DatabaseError(error.message, error);
  }

  return new DatabaseError('Unknown database error');
};
