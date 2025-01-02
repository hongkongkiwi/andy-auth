'use client';

import { MantineProvider } from '@mantine/core';
import { ZenstackUIProvider, ZSList } from 'zenstack-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { zenstackUIConfig } from '../../../lib/formConfig';
import { queryClient } from '../queryClient';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  workspaceId: string;
  // ... other client fields
}

const Page = () => {
  const { selectedWorkspace } = useWorkspace();
  const [error, setError] = useState<Error | null>(null);

  if (!selectedWorkspace) {
    return <div className="p-4">Please select a workspace first</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  const clientQuery = {
    where: {
      workspaceId: selectedWorkspace.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  };

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <ZenstackUIProvider config={zenstackUIConfig}>
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Clients</h1>
              <Link
                href="/dashboard/test/new"
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Link>
            </div>
            <ZSList<Client>
              mode="normal"
              model="Client"
              query={clientQuery}
              skeleton={
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded bg-gray-100"
                    />
                  ))}
                </div>
              }
              noResults={
                <div className="py-8 text-center text-gray-500">
                  No clients found
                </div>
              }
              render={(client) => (
                <div className="mb-2 rounded border p-4 hover:bg-gray-50">
                  <h3 className="font-medium">{client.name}</h3>
                </div>
              )}
            />
          </div>
        </ZenstackUIProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default Page;
