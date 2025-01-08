import { SMSError, SMS_ERROR_CODES } from './errors';

export interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  statusCallbackUrl?: string;
}

export const getSMSConfig = (): SMSConfig => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid) {
    throw new SMSError(
      'Twilio Account SID is required',
      SMS_ERROR_CODES.INVALID_CONFIG
    );
  }
  if (!authToken) {
    throw new SMSError(
      'Twilio Auth Token is required',
      SMS_ERROR_CODES.INVALID_CONFIG
    );
  }
  if (!fromNumber) {
    throw new SMSError(
      'Twilio From Number is required',
      SMS_ERROR_CODES.INVALID_CONFIG
    );
  }

  return {
    accountSid,
    authToken,
    fromNumber,
    statusCallbackUrl: process.env.TWILIO_STATUS_CALLBACK_URL
  };
};
