export const ROUTES = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Authentication Routes
  SIGN_IN: {
    BASE: '/sign-in' as const,
    EMAIL: '/sign-in/email' as const,
    PASSWORD: '/sign-in/password' as const,
    MAGIC_LINK: '/sign-in/magic-link' as const,
    PHONE: '/sign-in/phone' as const,
    MFA: '/sign-in/mfa' as const
  },

  SIGN_UP: {
    BASE: '/sign-up' as const,
    EMAIL: '/sign-up/email' as const,
    PASSWORD: '/sign-up/password' as const,
    VERIFY: '/sign-up/verify' as const,
    COMPLETE: '/sign-up/complete' as const
  },

  AUTH: {
    BASE: '/auth' as const,
    FORGOT_PASSWORD: '/auth/forgot-password' as const,
    RESET_PASSWORD: '/auth/reset-password' as const,
    VERIFY_EMAIL: '/auth/verify-email' as const,
    VERIFY_PHONE: '/auth/verify-phone' as const,
    CHANGE_EMAIL: '/auth/change-email' as const,
    CHANGE_PASSWORD: '/auth/change-password' as const,
    DELETE_ACCOUNT: '/auth/delete-account' as const,
    ERROR: '/auth/error' as const,
    CALLBACK: '/auth/callback' as const
  },

  // Protected Routes
  PROTECTED: {
    DASHBOARD: '/dashboard' as const,
    SETTINGS: {
      BASE: '/settings' as const,
      PROFILE: '/settings/profile' as const,
      SECURITY: '/settings/security' as const,
      NOTIFICATIONS: '/settings/notifications' as const,
      DEVICES: '/settings/devices' as const,
      SESSIONS: '/settings/sessions' as const,
      MFA: '/settings/mfa' as const
    },
    WORKSPACE: {
      BASE: '/workspace' as const,
      SETTINGS: '/workspace/settings' as const,
      MEMBERS: '/workspace/members' as const,
      BILLING: '/workspace/billing' as const
    }
  },

  // API Routes
  API: {
    BASE: '/api' as const,
    AUTH: {
      BASE: '/api/auth' as const,
      SIGN_IN: '/api/auth/sign-in' as const,
      SIGN_UP: '/api/auth/sign-up' as const,
      SIGN_OUT: '/api/auth/sign-out' as const,
      SESSION: '/api/auth/session' as const,
      VERIFY: '/api/auth/verify' as const,
      RESET: '/api/auth/reset' as const,
      MFA: '/api/auth/mfa' as const
    },
    WEBHOOKS: {
      BASE: '/api/webhooks' as const,
      PROTECTED: '/api/webhooks/protected' as const
    },
    INTERNAL: {
      BASE: '/api/internal' as const,
      PROTECTED: '/api/internal/protected' as const
    },
    HEALTH: '/api/health' as const
  }
} as const;

// Helper function to check if a path is an auth path
export const isAuthPath = (pathname: string): boolean => {
  const authPaths = [
    ...Object.values(ROUTES.SIGN_IN),
    ...Object.values(ROUTES.SIGN_UP),
    ...Object.values(ROUTES.AUTH)
  ].filter((path) => typeof path === 'string');

  return authPaths.some((path) => pathname.startsWith(path));
};

export default ROUTES;
