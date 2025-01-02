'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/trpc';

export const WorkspaceList = () => {
  const router = useRouter();
  const { data, error } = api.workspaces.list.useQuery(undefined, {
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/unauthorized');
      }
    }
  });

  // ... rest of your component
};
