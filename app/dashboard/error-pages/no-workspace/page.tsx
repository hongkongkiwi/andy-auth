'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NoWorkspacePage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          No Workspace Selected
        </h1>
        <p className="text-gray-600">
          You need to select or create a workspace before accessing this page.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/workspaces/new')}
          >
            Create Workspace
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoWorkspacePage;
