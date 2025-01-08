import { enhance } from '@zenstackhq/runtime';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProtectedDb } from '@/lib/db/index';
import { createAuditLog } from './services/audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel
} from '@prisma/client';
import { AUTH_CONFIG } from './config/better-auth';
import { ROUTES } from './config/routes';
import type { EnhancedPrismaClient } from '@/lib/db/types';

interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  enhanceDb?: boolean;
}

export const authMiddleware = async (
  request: NextRequest,
  options: AuthMiddlewareOptions = { requireAuth: true, enhanceDb: true }
): Promise<NextResponse | EnhancedPrismaClient> => {
  const db = await getProtectedDb();

  try {
    // Check session
    const session = await db.authSession.findFirst({
      where: {
        token: request.cookies.get('session')?.value,
        expiresAt: { gt: new Date() },
        isRevoked: false
      },
      include: {
        user: {
          select: {
            id: true,
            status: true,
            lockoutUntil: true
          }
        }
      }
    });

    // Handle no session
    if (!session?.user) {
      if (options.requireAuth) {
        return NextResponse.redirect(new URL(ROUTES.SIGN_IN.BASE, request.url));
      }
      return options.enhanceDb ? db : NextResponse.next();
    }

    // Check user lockout
    if (session.user.lockoutUntil && session.user.lockoutUntil > new Date()) {
      await createAuditLog({
        userId: session.user.id,
        eventType: AuditLogEventType.ACCESS_DENIED,
        description: 'Access denied - account locked',
        resourceType: AuditLogResourceType.USER,
        resourceId: session.user.id,
        tableName: 'user',
        severity: AuditSeverityLevel.WARNING,
        metadata: {
          lockoutUntil: session.user.lockoutUntil?.toISOString() || null,
          path: request.nextUrl.pathname
        }
      });

      return NextResponse.redirect(new URL(ROUTES.SIGN_IN.BASE, request.url));
    }

    // Update session activity
    await db.authSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() }
    });

    // Return enhanced db client or continue request
    if (options.enhanceDb) {
      return enhance(db, {
        user: { id: session.user.id }
      });
    }

    return NextResponse.next();
  } catch (error) {
    await createAuditLog({
      userId: 'system',
      eventType: AuditLogEventType.ERROR,
      description: 'Auth middleware error',
      resourceType: AuditLogResourceType.AUTH_ERROR,
      resourceId: 'auth-middleware',
      tableName: 'system',
      severity: AuditSeverityLevel.ERROR,
      metadata: {
        error: error instanceof Error ? error.message : String(error),
        path: request.nextUrl.pathname
      }
    });

    if (options.requireAuth) {
      return NextResponse.redirect(new URL(ROUTES.SIGN_IN.BASE, request.url));
    }
    return options.enhanceDb ? db : NextResponse.next();
  }
};

// Export convenience methods for different use cases
export const requireAuth = (request: NextRequest) =>
  authMiddleware(request, { requireAuth: true, enhanceDb: false });

export const getEnhancedDb = (request: NextRequest) =>
  authMiddleware(request, { requireAuth: false, enhanceDb: true });

export const requireAuthAndEnhanceDb = (request: NextRequest) =>
  authMiddleware(request, { requireAuth: true, enhanceDb: true });
