'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
] as const;

export const useClientTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState('q');
  const [genderFilter, setGenderFilter] = useQueryState('gender');
  const [page, setPage] = useQueryState('page');

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setGenderFilter(null);
    setPage(null);
  }, [setSearchQuery, setGenderFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!genderFilter;
  }, [searchQuery, genderFilter]);

  return {
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
};
