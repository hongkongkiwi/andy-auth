'use client';

import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Client } from '@/constants/mock-api/types';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../ClientTable/columns';
import { useRouter } from 'next/navigation';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';

interface ClientsListProps {
  clients: Client[];
}

const ClientsList = ({ clients }: ClientsListProps) => {
  const router = useRouter();
  const { handleClientSwitch } = useClient();

  const handleRowClick = (client: Client) => {
    handleClientSwitch(client);
    router.push(`/dashboard/clients/${client.id}/overview`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Clients (${clients.length})`}
          description="Manage your clients and their settings"
        />
        <Link
          href="/dashboard/clients/new"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <DataTable columns={columns} data={clients} onRowClick={handleRowClick} />
    </div>
  );
};

export default ClientsList;
