import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ClientLocationListingPage from './_components/ClientLocationListingPage';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Client Locations'
};

const Page = async ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  return <ClientLocationListingPage />;
};

export default Page;
