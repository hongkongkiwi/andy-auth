import PageContainer from '@/components/layout/PageContainer';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import type { ClientLocation } from '@/constants/mock-api/types';
import { db } from '@/constants/mock-api/db';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ClientLocationTable from './ClientLocationTable';
import type { SearchParams } from 'nuqs/parsers';

type TClientLocationListingPage = {
  clientId: string;
  searchParams?: SearchParams;
};

export default async function ClientLocationListingPage({
  clientId,
  searchParams = {}
}: TClientLocationListingPage) {
  const parsedParams = {
    page: searchParams?.page ? Number(searchParams.page) : 1,
    limit: searchParams?.limit ? Number(searchParams.limit) : 10,
    search: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
    gender:
      typeof searchParams?.gender === 'string' ? searchParams.gender : undefined
  };

  // Add client lookup with error handling
  const client = await db.client.findUnique({
    where: { id: clientId }
  });

  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  // Get locations with proper filtering
  const { locations, total } = await db.location.findMany({
    where: {
      clientId,
      ...(parsedParams.search && {
        name: {
          contains: parsedParams.search
        }
      })
    },
    skip: (parsedParams.page - 1) * parsedParams.limit,
    take: parsedParams.limit
  });

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${client.displayName} - Locations (${total})`}
            description="Manage client locations and their details"
          />

          <Link
            href={`/dashboard/clients/${clientId}/locations/new`}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ClientLocationTable data={locations} totalData={total} />
      </div>
    </PageContainer>
  );
}
