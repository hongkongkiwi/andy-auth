import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required'
        },
        {
          status: 401
        }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user
    });
  } catch (error) {
    console.error('Auth validation error:', error);
    return NextResponse.json(
      {
        error: 'InternalServerError',
        message: 'An error occurred validating authentication'
      },
      {
        status: 500
      }
    );
  }
}
