import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ClientLocationMap from './_components/ClientLocationMap';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Client Locations'
};

const Page = async ({ searchParams }: pageProps) => {
  const parsedParams = searchParamsCache.parse(searchParams);
  return <ClientLocationMap searchParams={parsedParams} />;
};

export default Page;
