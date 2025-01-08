// Exporting from client.ts
export { createTwilioClient } from './client';

// Exporting from send-sms.ts
export { sendSMS } from './send-sms';

// Exporting from config.ts
export { getSMSConfig } from './config';

// Exporting types from types.ts
export type {
  SMSTemplateData,
  SMSOptions,
  SMSResult,
  SendSMSParams
} from './types';
export type { SMSConfig } from './config';

// Exporting error utilities
export { SMSError, SMS_ERROR_CODES } from './errors';

// Exporting template enum
export { SMSTemplate } from '@/lib/auth/config/sms';
