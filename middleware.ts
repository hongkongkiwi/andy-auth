import { authMiddleware } from './lib/auth/middleware/auth-middleware';

// This middleware runs first, then can pass control to permission middleware
export default authMiddleware;

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/|auth/|sitemap.xml|robots.txt).*)'
  ]
};
