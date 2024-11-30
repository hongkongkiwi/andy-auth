'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const useClientTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [clientFilter, setClientFilter] = useQueryState(
    'client',
    searchParams.client.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setClientFilter(null);
    setPage(1);
  }, [setSearchQuery, setClientFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!clientFilter;
  }, [searchQuery, clientFilter]);

  return {
    searchQuery,
    setSearchQuery,
    clientFilter,
    setClientFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
};
