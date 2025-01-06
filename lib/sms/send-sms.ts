import { SMSTemplate } from '@/lib/auth/config/sms';
import type { SMSTemplateData, SendSMSParams, SMSResult } from './types';

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
      throw new Error('Data is required when using a template');
    }
    if (!SMS_TEMPLATES[template]) {
      throw new Error(`Invalid SMS template: ${template}`);
    }
    const messageText = SMS_TEMPLATES[template](data);

    if (process.env.NODE_ENV === 'development') {
      console.log('SMS would be sent:', {
        to,
        message: messageText
      });
    }

    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      status: 'queued',
      dateCreated: new Date(),
      dateUpdated: new Date()
    };
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      errorCode: 30001,
      error: error instanceof Error ? error.message : 'Failed to send SMS'
    };
  }
};

export type { SMSTemplateData, SMSOptions, SMSResult } from './types';
