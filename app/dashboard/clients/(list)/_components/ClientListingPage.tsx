'use client';

import PageContainer from '@/components/layout/PageContainer';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher/contexts/WorkspaceContext';

export default function ClientListingPage({ children }: PropsWithChildren) {
  const { setSelectedClient } = useClient();
  const { selectedWorkspace } = useWorkspace();
  const pathname = usePathname();

  // Clear client context when listing page mounts or workspace changes
  useEffect(() => {
    if (pathname === '/dashboard/clients') {
      setSelectedClient(undefined);
    }
  }, [setSelectedClient, pathname, selectedWorkspace?.id]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Clients"
            description="Manage clients (Server side table functionalities.)"
          />

          <Link
            href={'/dashboard/clients/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        {children}
      </div>
    </PageContainer>
  );
}
