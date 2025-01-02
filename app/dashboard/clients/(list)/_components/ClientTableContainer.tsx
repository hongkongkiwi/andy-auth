'use client';

import { db } from '@/constants/mock-api';
import type { Client } from '@/constants/mock-api';
import { useEffect, useState } from 'react';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { ReactElement } from 'react';
import { ClientTable } from './ClientTable/index';

interface ClientTableContainerProps {
  page?: string | number;
  pageLimit?: string | number;
  search?: string;
  status?: string;
}

export const ClientTableContainer = ({
  page,
  pageLimit = 10,
  search,
  status
}: ClientTableContainerProps): ReactElement => {
  const { selectedWorkspace } = useWorkspace();
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      if (!selectedWorkspace) {
        setClients([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const whereClause = {
          workspaceId: selectedWorkspace.id,
          ...(search ? { name: { contains: String(search) } } : {}),
          ...(status ? { status: String(status) } : {})
        };

        const fetchedClients = await db.client.findMany({
          take: Number(pageLimit),
          skip: ((Number(page) || 1) - 1) * Number(pageLimit),
          where: whereClause,
          include: {
            workspace: true
          }
        });

        const allClients = await db.client.findMany({
          where: whereClause
        });

        setClients(fetchedClients);
        setTotal(allClients.length);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setClients([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [selectedWorkspace?.id, page, pageLimit, search, status]);

  if (!selectedWorkspace) {
    return <div>No workspace selected</div>;
  }

  if (loading) {
    return <div>Loading table...</div>;
  }

  return (
    <div className="space-y-4">
      <ClientTable
        data={clients}
        pageCount={Math.ceil(total / Number(pageLimit))}
        totalData={total}
      />
    </div>
  );
};
