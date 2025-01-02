'use client';

import { MantineProvider } from '@mantine/core';
import { ZenstackUIProvider, ZSUpdateForm } from 'zenstack-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { zenstackUIConfig } from '../../../../lib/formConfig';
import { queryClient } from '../../queryClient';

interface ViewClientPageProps {
  className?: string;
}

const ViewClientPage = ({ className }: ViewClientPageProps) => {
  const { selectedWorkspace } = useWorkspace();
  const params = useParams();
  const clientId = params.clientId as string;

  if (!selectedWorkspace) {
    return <div className="p-4">Please select a workspace first</div>;
  }

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <ZenstackUIProvider config={zenstackUIConfig}>
          <div className="relative space-y-6">
            <h1 className="text-2xl font-bold">Client Details</h1>
            <ZSUpdateForm
              model="Client"
              id={clientId}
              className={`space-y-4 ${className || ''}`}
              overrideSubmit={async () => {
                // Prevent form submission in view mode
                return Promise.resolve();
              }}
            >
              {/* Optional: Override specific fields with custom rendering */}
              {/* <ZSFieldSlot 
                fieldName="name"
                className="font-semibold"
              /> */}
            </ZSUpdateForm>
          </div>
        </ZenstackUIProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default ViewClientPage;
