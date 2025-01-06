export enum SMSTemplate {
  LOGIN_CODE = 'login-code',
  VERIFICATION_CODE = 'verification-code'
}

export const SMS_CONFIG = {
  TEMPLATES: {
    LOGIN_CODE: SMSTemplate.LOGIN_CODE,
    VERIFICATION_CODE: SMSTemplate.VERIFICATION_CODE
  },
  CODE_LENGTH: 6,
  MAX_ATTEMPTS: 3,
  COOLDOWN: 60 * 1000 // 1 minute in milliseconds
} as const;
