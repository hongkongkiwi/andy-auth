import { NextResponse } from 'next/server';
import { DEFAULT_LOGIN_REDIRECT } from './config/routes';
import { AuthError, AuthErrorCode } from './errors';
import type { AuthRequest } from './types/auth';

export const guardRoute = (
  isAuth: boolean,
  nextUrl: URL,
  req?: AuthRequest
) => {
  const { pathname } = nextUrl;
  const isAuthPage = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');
  const isWorkspacePath = pathname.startsWith('/workspace');

  // Handle auth pages
  if (isAuthPage && isAuth && !pathname.startsWith('/auth/verify')) {
    // If user has a selected workspace, redirect there
    if (req?.auth?.user?.selectedWorkspaceId) {
      return NextResponse.redirect(
        new URL(
          `/workspace/${req.auth.user.selectedWorkspaceId}/dashboard`,
          nextUrl
        )
      );
    }
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Handle API routes
  if (isApiRoute && !isAuth && !pathname.startsWith('/api/auth')) {
    throw new AuthError(AuthErrorCode.SESSION_REQUIRED);
  }

  // Handle protected routes
  if (!isAuth && !isAuthPage) {
    const searchParams = new URLSearchParams({
      error: AuthErrorCode.SESSION_REQUIRED,
      callbackUrl: pathname
    });
    return NextResponse.redirect(
      new URL(`${DEFAULT_LOGIN_REDIRECT}?${searchParams}`, nextUrl)
    );
  }

  // Handle workspace access
  if (isWorkspacePath && req?.auth?.user) {
    const workspaceId = pathname.split('/')[2];
    const hasAccess = req.auth.user.workspaces?.some(
      (w) => w.id === workspaceId
    );

    if (!hasAccess) {
      throw new AuthError(AuthErrorCode.WORKSPACE_ACCESS_DENIED);
    }
  }

  return NextResponse.next();
};
