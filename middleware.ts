import { auth } from '@/lib/auth';
import { guardRoute } from '@/lib/auth/guards';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  return guardRoute(isLoggedIn, nextUrl, req);
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/workspace/:path*',
    '/auth/:path*',
    '/api/((?!auth).)*'
  ]
};
