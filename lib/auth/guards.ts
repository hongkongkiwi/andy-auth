import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from './config/routes';
import { isAuthPath } from './utils/path-utils';

export const guardRoute = async (
  isLoggedIn: boolean,
  nextUrl: NextURL,
  request: NextRequest
): Promise<NextResponse> => {
  // Allow access to auth routes when not logged in
  if (!isLoggedIn && isAuthPath(nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const loginUrl = new URL(ROUTES.SIGN_IN.BASE, request.url);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect away from auth pages when logged in
  if (isLoggedIn && isAuthPath(nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(ROUTES.PROTECTED.DASHBOARD, request.url)
    );
  }

  return NextResponse.next();
};
