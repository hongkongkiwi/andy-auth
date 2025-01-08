import { Twilio } from 'twilio';
import type { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { SMSResult } from './types';
import type { SMSConfig } from './config';
import { SMSError, SMS_ERROR_CODES } from './errors';

interface SMSMessage {
  to: string;
  body: string;
  metadata?: Record<string, unknown>;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

/** Validates phone number format according to E.164 standard */
const validatePhoneNumber = (phone: string): boolean => {
  return /^\+[1-9]\d{1,14}$/.test(phone);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Maps Twilio response to our standardized SMS result format */
const mapTwilioResponseToSMSResult = (
  response: MessageInstance
): SMSResult => ({
  success: true,
  messageId: response.sid,
  status: response.status as SMSResult['status'],
  dateCreated: new Date(response.dateCreated),
  dateUpdated: new Date(response.dateUpdated)
});

/** Determines if an error should trigger a retry attempt */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Retry on network errors or Twilio rate limits
    return (
      error.message.includes('ECONNRESET') ||
      error.message.includes('429') ||
      error.message.includes('500') ||
      error.message.includes('503')
    );
  }
  return false;
};

/** Extracts rate limit information from Twilio error response */
const getRateLimitDelay = (error: unknown): number | null => {
  if (error instanceof Error && error.message.includes('429')) {
    const retryAfter = error.message.match(/retry after (\d+) seconds/i)?.[1];
    return retryAfter ? parseInt(retryAfter, 10) * 1000 : null;
  }
  return null;
};

/** Creates a Twilio client with retry capability */
export const createTwilioClient = (config: SMSConfig) => {
  const client = new Twilio(config.accountSid, config.authToken);

  const sendSMSWithRetry = async (
    message: SMSMessage,
    attempt = 1
  ): Promise<SMSResult> => {
    try {
      if (!validatePhoneNumber(message.to)) {
        throw new SMSError(
          'Invalid phone number format',
          SMS_ERROR_CODES.INVALID_PHONE,
          { phone: message.to }
        );
      }

      const response = await client.messages.create({
        body: message.body,
        from: config.fromNumber,
        to: message.to,
        statusCallback: config.statusCallbackUrl
      });

      return mapTwilioResponseToSMSResult(response);
    } catch (error) {
      console.error(`[SMS] Attempt ${attempt} failed:`, error);

      if (error instanceof SMSError) {
        return {
          success: false,
          status: 'failed',
          error: error.message,
          errorCode: error.code,
          metadata: { ...error.metadata, attempt }
        };
      }

      if (attempt < RETRY_ATTEMPTS && isRetryableError(error)) {
        const rateLimitDelay = getRateLimitDelay(error);
        const retryDelay = Math.min(
          rateLimitDelay || RETRY_DELAY * Math.pow(2, attempt - 1),
          MAX_RETRY_DELAY
        );

        await delay(retryDelay);
        return sendSMSWithRetry(message, attempt + 1);
      }

      const isRateLimit = getRateLimitDelay(error) !== null;
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to send SMS',
        errorCode: isRateLimit
          ? SMS_ERROR_CODES.RATE_LIMIT
          : SMS_ERROR_CODES.SEND_FAILED,
        metadata: {
          attempt,
          retryAfter: getRateLimitDelay(error)
        }
      };
    }
  };

  return {
    sendSMS: (message: SMSMessage) => sendSMSWithRetry(message)
  };
};
