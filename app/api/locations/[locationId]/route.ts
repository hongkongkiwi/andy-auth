import { withLocationAccess } from '@/lib/auth/middleware/permission-middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { LocationPermissionRole } from '@prisma/client';

export const GET = withLocationAccess(async (req: NextRequest) => {
  const locationId = req.headers.get('x-location-id');

  if (!locationId) {
    return NextResponse.json(
      { error: 'Location ID required' },
      { status: 400 }
    );
  }

  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          workspace: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  if (!location) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  return NextResponse.json({ data: location });
}, LocationPermissionRole.VIEWER);
