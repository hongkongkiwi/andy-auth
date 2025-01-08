import { SMSTemplate } from '@/lib/auth/config/sms';
import type { SMSTemplateData, SendSMSParams, SMSResult } from './types';
import { createTwilioClient } from './client';
import { getSMSConfig } from './config';
import { SMSError, SMS_ERROR_CODES } from './errors';

const SMS_TEMPLATES: Record<SMSTemplate, (data: SMSTemplateData) => string> = {
  [SMSTemplate.LOGIN_CODE]: ({ appName = 'our platform', code, expiresIn }) =>
    `Login code for ${appName} is: ${code}. Valid for ${expiresIn} minutes.`,

  [SMSTemplate.VERIFICATION_CODE]: ({ code, expiresIn }) =>
    `Verify code is: ${code}. Valid for ${expiresIn} minutes.`
};

export const sendSMS = async ({
  to,
  template,
  data
}: SendSMSParams): Promise<SMSResult> => {
  try {
    if (!data) {
      throw new SMSError(
        'Data is required when using a template',
        SMS_ERROR_CODES.MISSING_DATA
      );
    }

    if (!SMS_TEMPLATES[template]) {
      throw new SMSError(
        `Invalid SMS template: ${template}`,
        SMS_ERROR_CODES.INVALID_TEMPLATE,
        { template }
      );
    }

    const messageText = SMS_TEMPLATES[template](data);

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SMS_MOCK === 'true'
    ) {
      console.log('[SMS] Mock mode:', { to, message: messageText });
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        status: 'queued',
        dateCreated: new Date(),
        dateUpdated: new Date(),
        metadata: { mock: true }
      };
    }

    const twilioClient = createTwilioClient(getSMSConfig());

    return await twilioClient.sendSMS({
      to,
      body: messageText,
      metadata: { template, ...data }
    });
  } catch (error) {
    console.error('[SMS] Send failed:', error);

    if (error instanceof SMSError) {
      return {
        success: false,
        status: 'failed',
        error: error.message,
        errorCode: error.code,
        metadata: error.metadata
      };
    }

    return {
      success: false,
      status: 'failed',
      errorCode: SMS_ERROR_CODES.SEND_FAILED,
      error: error instanceof Error ? error.message : 'Failed to send SMS'
    };
  }
};

export type { SMSTemplateData, SMSOptions, SMSResult } from './types';
