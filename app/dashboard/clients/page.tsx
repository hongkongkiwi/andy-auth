'use client';

import { trpc } from '@/lib/trpc/client';

interface ClientData {
  id: string;
  displayName: string;
}

export default function ClientsPage() {
  const { data: clients, isLoading } = trpc.clients.list.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {clients?.map((client: ClientData) => (
        <div key={client.id}>{client.displayName}</div>
      ))}
    </div>
  );
}
