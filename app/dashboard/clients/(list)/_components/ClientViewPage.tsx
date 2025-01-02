'use client';

import ClientForm from './ClientForm';
import PageContainer from '@/components/layout/PageContainer';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Client } from '@/constants/mock-api';

interface ClientViewPageProps {
  initialClient?: Client;
}

const ClientViewPage = ({ initialClient }: ClientViewPageProps) => {
  const router = useRouter();
  const { selectedClient, handleClientSwitch } = useClient();

  useEffect(() => {
    if (
      initialClient &&
      (!selectedClient || selectedClient.id !== initialClient.id)
    ) {
      handleClientSwitch(initialClient);
    }
  }, [initialClient, selectedClient, handleClientSwitch]);

  useEffect(() => {
    if (!initialClient && !selectedClient) {
      router.push('/dashboard/clients');
    }
  }, [initialClient, selectedClient, router]);

  if (!initialClient && !selectedClient) {
    return null;
  }

  const clientData = initialClient || selectedClient || undefined;

  return (
    <PageContainer>
      <ClientForm initialData={clientData} />
    </PageContainer>
  );
};

export default ClientViewPage;
