import { SMSTemplate } from '@/lib/auth/config/sms';

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
  errorCode?: number;
}

export interface SendSMSParams {
  to: string;
  template: SMSTemplate;
  data: SMSTemplateData;
}
