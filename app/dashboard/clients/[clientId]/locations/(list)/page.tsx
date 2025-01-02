import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ClientLocationListingPage from './_components/ClientLocationListingPage';

type pageProps = {
  searchParams: SearchParams;
  params: { clientId: string };
};

export const metadata = {
  title: 'Dashboard : Clients : Locations'
};

const Page = async ({ searchParams, params }: pageProps) => {
  return (
    <ClientLocationListingPage
      clientId={params.clientId}
      searchParams={searchParams}
    />
  );
};

export default Page;
