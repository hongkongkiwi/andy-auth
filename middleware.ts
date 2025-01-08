import { authMiddleware } from './lib/auth/auth-middleware';

// This middleware runs first, then can pass control to permission middleware
export default authMiddleware;

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/|auth/|sitemap.xml|robots.txt).*)'
  ]
};
