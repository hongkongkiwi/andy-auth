import { SMSTemplate } from '@/lib/auth/config/sms';
import type { SMSErrorCode } from './errors';

export interface SMSTemplateData {
  code: string;
  appName?: string;
  expiresIn?: string;
}

export interface SMSOptions {
  to: string;
  template?: SMSTemplate;
  message?: string;
  data?: SMSTemplateData;
  from?: string;
  metadata?: Record<string, unknown>;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: 'queued' | 'failed' | 'sent' | 'delivered' | 'undelivered';
  dateCreated?: Date;
  dateUpdated?: Date;
  errorCode?: SMSErrorCode;
  metadata?: Record<string, unknown> & {
    attempt?: number;
    retryAfter?: number | null;
  };
}

export interface SendSMSParams {
  to: string;
  template: SMSTemplate;
  data: SMSTemplateData;
  metadata?: Record<string, unknown>;
}
