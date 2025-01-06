export const SECURITY_CONFIG = {
  RATE_LIMITS: {
    DEFAULT: {
      LIMIT: '100',
      WINDOW: '60' // seconds
    }
  },
  CSP_POLICY: {
    DEV: {
      'default-src': ["'self'", "'unsafe-eval'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'localhost:*'
      ],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'blob:', 'localhost:*'],
      'font-src': ["'self'", 'data:', 'localhost:*'],
      'connect-src': ["'self'", 'ws://localhost:*', 'http://localhost:*'],
      'frame-src': ["'self'", 'localhost:*'],
      'worker-src': ["'self'", 'blob:'],
      'media-src': ["'self'"],
      'object-src': ["'none'"]
    },
    PROD: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'blob:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-src': ["'none'"],
      'worker-src': ["'self'"],
      'media-src': ["'self'"],
      'object-src': ["'none'"]
    }
  }
} as const;
