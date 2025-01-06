import { ROUTES } from './routes';

export interface AuthMiddlewareConfig {
  isDev: boolean;
  publicPaths: readonly string[];
  apiPaths: {
    PUBLIC: readonly string[];
  };
}

export interface PathPattern {
  pattern: RegExp;
  original: string;
}

export type PathPatterns = ReadonlyArray<PathPattern>;

const DEV_PATHS =
  process.env.NODE_ENV === 'development'
    ? [
        '/__nextjs_original-stack-frame',
        '/_next/webpack-hmr',
        '/_next/development'
      ]
    : [];

export const middlewareConfig: AuthMiddlewareConfig = {
  isDev: process.env.NODE_ENV === 'development',
  publicPaths: [
    ...DEV_PATHS,
    ROUTES.SIGN_IN.BASE,
    ROUTES.SIGN_UP.BASE,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.AUTH.VERIFY_EMAIL,
    ROUTES.AUTH.ERROR,
    ROUTES.API.HEALTH,
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ],
  apiPaths: {
    PUBLIC: ['/api/health', '/api/auth']
  }
} as const;
