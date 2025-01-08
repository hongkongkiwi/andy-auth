import { cookies } from 'next/headers';
import { auth } from './config/better-auth';

/**
 * Get the current session from the server context
 * @returns The current session or null if not authenticated
 */
export const getServerSession = async () => {
  const cookieStore = cookies();
  const request = new Request('http://localhost', {
    headers: {
      cookie: cookieStore.toString()
    }
  });

  try {
    // Get session from auth handler
    const response = await auth.handler(request);
    const data = await response.json();

    return data.session || null;
  } catch (error) {
    console.error('Failed to get server session:', error);
    return null;
  }
};

/**
 * Validate authentication on the server
 * @returns The current session user or null
 */
export const validateAuth = async () => {
  const session = await getServerSession();
  return session?.user || null;
};
