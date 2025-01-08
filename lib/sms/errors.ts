export const SMS_ERROR_CODES = {
  INVALID_CONFIG: 30001,
  INVALID_TEMPLATE: 30002,
  MISSING_DATA: 30003,
  SEND_FAILED: 30004,
  INVALID_PHONE: 30005,
  RATE_LIMIT: 30006
} as const;

export type SMSErrorCode =
  (typeof SMS_ERROR_CODES)[keyof typeof SMS_ERROR_CODES];

export class SMSError extends Error {
  constructor(
    message: string,
    public code: SMSErrorCode,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SMSError';
  }
}
