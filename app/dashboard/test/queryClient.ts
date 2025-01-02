import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    if (
      'info' in error &&
      error.info &&
      typeof error.info === 'object' &&
      'message' in error.info
    ) {
      return error.info.message as string;
    }
    if ('message' in error) {
      return error.message as string;
    }
  }
  return 'An unexpected error occurred';
};

// Query Client with UI notification logging
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24 // 1 day
    }
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('ZenStack query error:', error);
      const message = getErrorMessage(error);
      toast.error(`Error: ${message}`);
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('ZenStack mutation error:', error);
      const message = getErrorMessage(error);
      toast.error(`Error: ${message}`);
    }
  })
});
