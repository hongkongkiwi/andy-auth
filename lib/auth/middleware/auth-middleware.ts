import { NextResponse, type NextRequest } from 'next/server';
import { createAuthMiddleware } from 'better-auth/plugins';
import { middlewareConfig, type PathPattern } from '../config/middleware';
import { ROUTES, isAuthPath } from '../config/routes';
import { logAuthError } from '../utils/error-logging';
import { createAuditLog } from '../services/audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';
import { guardRoute } from '../guards';

// Cache public paths regex patterns for faster matching
const PUBLIC_PATH_PATTERNS: PathPattern[] = middlewareConfig.publicPaths.map(
  (path) => ({
    pattern: new RegExp(`^${path.replace('*', '.*')}`),
    original: path
  })
);

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATH_PATTERNS.some(({ pattern }) => pattern.test(pathname));

const API_ROUTE_PATTERN = /^\/api\//;

// Helper to extract resource IDs from URL path segments
const extractResourceIds = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const findId = (key: string) => {
    const index = segments.indexOf(key);
    return index !== -1 && index + 1 < segments.length
      ? segments[index + 1]
      : null;
  };

  return {
    workspaceId: findId('workspaces') || findId('workspace'),
    clientId: findId('clients') || findId('client'),
    locationId: findId('locations') || findId('location')
  };
};

// Add type for response with headers
type NextResponseWithHeaders = NextResponse & {
  headers: Headers;
};

// Update header handling
const addAuthHeaders = (
  headers: Headers,
  userId: string | undefined,
  resourceIds: ReturnType<typeof extractResourceIds>
): Headers => {
  const newHeaders = new Headers(headers);

  if (userId) {
    newHeaders.set('x-user-id', userId);
  }

  Object.entries(resourceIds).forEach(([key, value]) => {
    if (value) newHeaders.set(`x-${key}`, value);
  });
  return newHeaders;
};

// Add these types at the top
type AuthMiddlewareResponse = NextResponse | Response;

type ErrorResponse = {
  error: string;
  code: string;
  status: number;
};

// Add helper for error responses
const createErrorResponse = (
  error: unknown,
  pathname: string,
  isApi: boolean
): AuthMiddlewareResponse => {
  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    status: 500
  };

  if (isApi) {
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      {
        status: errorResponse.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return NextResponse.redirect(new URL(ROUTES.AUTH.ERROR, pathname));
};

export const authMiddleware = createAuthMiddleware(async (ctx) => {
  const request = ctx.request as NextRequest;
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!ctx.context?.session?.user;

  try {
    // 1. Check public paths first
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // 2. Handle missing session
    if (!isLoggedIn) {
      if (API_ROUTE_PATTERN.test(pathname)) {
        await createAuditLog({
          userId: 'anonymous',
          eventType: AuditLogEventType.SUSPICIOUS_ACTIVITY,
          resourceType: AuditLogResourceType.SECURITY_EVENT,
          description: `Unauthorized API access attempt: ${pathname}`,
          resourceId: 'system',
          tableName: 'auth',
          severity: AuditSeverityLevel.ALERT,
          metadata: {
            path: pathname,
            method: request.method,
            origin: request.headers.get('origin'),
            referer: request.headers.get('referer')
          }
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL(ROUTES.SIGN_IN.BASE, request.url));
    }

    // 3. Add auth and resource info to headers
    const resourceIds = extractResourceIds(pathname);
    const headers = addAuthHeaders(
      request.headers,
      ctx.context.session?.user?.id,
      resourceIds
    );

    // 4. Handle different route types
    if (API_ROUTE_PATTERN.test(pathname)) {
      return NextResponse.next({
        request: { headers }
      });
    } else {
      // Check route guards for pages
      const guardResponse = await guardRoute(
        isLoggedIn,
        request.nextUrl,
        request
      );
      if (!guardResponse.ok) {
        return guardResponse;
      }
    }

    // 5. Continue with added headers
    return NextResponse.next({
      request: {
        headers
      }
    }) as NextResponseWithHeaders;
  } catch (error) {
    await logAuthError(error, {
      userId: ctx.context?.session?.user?.id || 'anonymous',
      context: 'auth-middleware',
      action: 'validate-session',
      request,
      metadata: {
        pathname,
        isLoggedIn,
        resourceType: AuditLogResourceType.SECURITY_EVENT,
        error:
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack:
                  process.env.NODE_ENV === 'development'
                    ? error.stack
                    : undefined
              }
            : 'Unknown error'
      }
    });

    return createErrorResponse(
      error,
      request.url,
      API_ROUTE_PATTERN.test(pathname)
    );
  }
});

// Optimize matcher patterns
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/|auth/|sitemap.xml|robots.txt).*)'
  ]
};
