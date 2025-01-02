import { ClientTableContainer } from './_components/ClientTableContainer';
import ClientListingPage from './_components/ClientListingPage';
import { Suspense } from 'react';

export default async function ClientsPage({
  searchParams
}: {
  searchParams: {
    page?: string;
    limit?: string;
    q?: string;
    status?: string;
  };
}) {
  return (
    <ClientListingPage>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientTableContainer
          page={searchParams.page}
          pageLimit={searchParams.limit}
          search={searchParams.q}
          status={searchParams.status}
        />
      </Suspense>
    </ClientListingPage>
  );
}
