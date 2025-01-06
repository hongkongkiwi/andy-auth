export enum EmailTemplate {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  PASSWORD_RESET_COMPLETE = 'password-reset-complete',
  WORKSPACE_INVITATION = 'workspace-invitation',
  CLIENT_INVITATION = 'client-invitation',
  VERIFICATION = 'verification',
  EMAIL_VERIFICATION = 'email-verification',
  CHANGE_EMAIL_VERIFICATION = 'change-email-verification',
  DELETE_ACCOUNT_VERIFICATION = 'delete-account-verification',
  ACCOUNT_DELETED_CONFIRMATION = 'account-deleted-confirmation',
  PASSWORD_CHANGED = 'password-changed',
  PASSWORD_CHANGE_REQUIRED = 'password-change-required'
}

interface EmailTemplateConfig {
  subject: string;
  template: string;
}

export const EMAIL_TEMPLATES: Record<EmailTemplate, EmailTemplateConfig> = {
  [EmailTemplate.WELCOME]: {
    subject: 'Welcome to Our Platform',
    template: 'welcome'
  },
  [EmailTemplate.PASSWORD_RESET]: {
    subject: 'Reset Your Password',
    template: 'password-reset'
  },
  [EmailTemplate.PASSWORD_RESET_COMPLETE]: {
    subject: 'Your Password Has Been Reset',
    template: 'password-reset-complete'
  },
  [EmailTemplate.WORKSPACE_INVITATION]: {
    subject: 'Invitation to Join Workspace',
    template: 'workspace-invitation'
  },
  [EmailTemplate.CLIENT_INVITATION]: {
    subject: 'Invitation to Join Client',
    template: 'client-invitation'
  },
  [EmailTemplate.VERIFICATION]: {
    subject: 'Verify Your Account',
    template: 'verification'
  },
  [EmailTemplate.EMAIL_VERIFICATION]: {
    subject: 'Verify Your Email Address',
    template: 'email-verification'
  },
  [EmailTemplate.CHANGE_EMAIL_VERIFICATION]: {
    subject: 'Confirm Email Change',
    template: 'change-email-verification'
  },
  [EmailTemplate.DELETE_ACCOUNT_VERIFICATION]: {
    subject: 'Confirm Account Deletion',
    template: 'delete-account-verification'
  },
  [EmailTemplate.ACCOUNT_DELETED_CONFIRMATION]: {
    subject: 'Account Deletion Confirmed',
    template: 'account-deleted-confirmation'
  },
  [EmailTemplate.PASSWORD_CHANGED]: {
    subject: 'Your Password Has Been Changed',
    template: 'password-changed'
  },
  [EmailTemplate.PASSWORD_CHANGE_REQUIRED]: {
    subject: 'Password Change Required',
    template: 'password-change-required'
  }
};

interface EmailData {
  to: string;
  template: EmailTemplate;
  data: Record<string, any>;
  subject?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<void> => {
  // Validate template
  if (!Object.values(EmailTemplate).includes(emailData.template)) {
    throw new Error(`Invalid email template: ${emailData.template}`);
  }

  const subject =
    emailData.subject ?? EMAIL_TEMPLATES[emailData.template].subject;

  // For development, log the email data
  if (process.env.NODE_ENV === 'development') {
    console.log('Email would be sent with:', {
      to: emailData.to,
      subject,
      template: emailData.template,
      data: emailData.data
    });
    return;
  }

  // TODO: Implement your email service integration here
  // Example providers:
  // - Resend
  // - SendGrid
  // - Amazon SES
  // - Postmark

  throw new Error('Email sending not yet implemented');
};
