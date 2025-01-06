export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security'?: string;
  'X-XSS-Protection': string;
  'X-DNS-Prefetch-Control': string;
  'Expect-CT': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

const SECURITY_HEADERS: Partial<SecurityHeaders> = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s+/g, ' ')
    .trim(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
} as const;

export const createSecurityHeaders = (isDev: boolean): SecurityHeaders => ({
  'Content-Security-Policy': SECURITY_HEADERS['Content-Security-Policy'] || '',
  'X-Frame-Options': SECURITY_HEADERS['X-Frame-Options'] || 'DENY',
  'X-Content-Type-Options':
    SECURITY_HEADERS['X-Content-Type-Options'] || 'nosniff',
  'Referrer-Policy':
    SECURITY_HEADERS['Referrer-Policy'] || 'strict-origin-when-cross-origin',
  'Permissions-Policy': SECURITY_HEADERS['Permissions-Policy'] || '',
  'Strict-Transport-Security': isDev
    ? ''
    : 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off',
  'Expect-CT': 'max-age=86400, enforce',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
});

interface SecurityConfig {
  csp: string;
  hsts: boolean;
}

type Environment = 'development' | 'production';

const getSecurityConfig = (env: Environment): SecurityConfig =>
  ({
    development: {
      csp: "default-src 'self' 'unsafe-eval' 'unsafe-inline';",
      hsts: false
    },
    production: {
      csp: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
      hsts: true
    }
  })[env];
