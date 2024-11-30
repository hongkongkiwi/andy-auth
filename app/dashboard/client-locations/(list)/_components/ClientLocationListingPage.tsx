import PageContainer from '@/components/layout/PageContainer';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { fakeClientLocations, fakeClients } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ClientLocationTable from './ClientLocationTable';

export default async function ClientLocationListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const client = searchParamsCache.get('client');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(client && { client })
  };

  const data = await fakeClientLocations.getClientLocations(filters);
  const totalLocations = data.total_client_locations;
  const locations = data.client_locations;
  const clientsResponse = await fakeClients.getClients({});
  const clients = clientsResponse.clients;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Client Locations (${totalLocations})`}
            description="Manage client locations and their details"
          />

          <Link
            href="/dashboard/locations/new"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ClientLocationTable data={locations} totalData={totalLocations} clients={clients} />
      </div>
    </PageContainer>
  );
}
