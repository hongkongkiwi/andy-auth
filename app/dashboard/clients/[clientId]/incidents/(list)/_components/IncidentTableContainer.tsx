'use client';

import { useState, useEffect } from 'react';
import { db } from '@/constants/mock-api';
import type { Incident } from '@/constants/mock-api/types';
import PageContainer from '@/components/layout/PageContainer';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import IncidentTable from './IncidentTable';
import type { ReactElement } from 'react';

interface IncidentTableContainerProps {
  clientId: string;
  page?: string;
  pageLimit?: string;
  search?: string;
  status?: string;
  priority?: string;
}

export const IncidentTableContainer = ({
  clientId,
  page,
  pageLimit = '10',
  search,
  status,
  priority
}: IncidentTableContainerProps): ReactElement => {
  const [client, setClient] = useState<any>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await db.client.findUnique({
          where: { id: clientId }
        });
        setClient(clientData);

        const { incidents: incidentData, total: totalCount } =
          await db.incident.findMany({
            where: {
              clientId,
              ...(search ? { title: { contains: search } } : {}),
              ...(status ? { status } : {}),
              ...(priority ? { priority } : {})
            },
            skip: page ? (Number(page) - 1) * Number(pageLimit) : 0,
            take: Number(pageLimit)
          });

        setIncidents(incidentData);
        setTotal(totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, page, pageLimit, search, status, priority]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${client.name} - Incidents (${total})`}
            description="Manage client incidents and their details"
          />
          <Link
            href={`/dashboard/clients/${clientId}/incidents/new`}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <IncidentTable data={incidents} totalData={total} />
      </div>
    </PageContainer>
  );
};
