import { Suspense } from 'react';
import IncidentListingPage from './_components/IncidentListingPage';
import { searchParams } from '@/lib/searchparams';

interface PageProps {
  params: {
    clientId: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    q?: string;
    status?: string;
    priority?: string;
  };
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <Suspense>
      <IncidentListingPage
        clientId={params.clientId}
        page={searchParams.page}
        pageLimit={searchParams.limit}
        search={searchParams.q}
        status={searchParams.status}
        priority={searchParams.priority}
      />
    </Suspense>
  );
}
