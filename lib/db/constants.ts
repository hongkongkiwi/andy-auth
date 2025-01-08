/**
 * Database configuration constants
 * Controls retry behavior and timeouts
 */
export const DB_CONFIG = {
  timeout: {
    transaction: 5000,
    query: 3000
  },
  retry: {
    maxAttempts: 3,
    baseDelay: 100,
    maxDelay: 1000,
    retryableErrors: {
      connection: [
        'P1000', // Authentication failed
        'P1001', // Cannot reach database server
        'P1008' // Operations timed out
      ] as const,
      transaction: [
        'P1017', // Server closed the connection
        'P2024', // Transaction timed out
        'P2034' // Transaction failed due to conflict
      ] as const
    }
  }
} as const;

export type RetryableErrorCode =
  | (typeof DB_CONFIG.retry.retryableErrors.connection)[number]
  | (typeof DB_CONFIG.retry.retryableErrors.transaction)[number];
