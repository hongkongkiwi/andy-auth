'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
  onSearch: (value: string) => void;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  onSearch
}: DataTableSearchProps) {
  return (
    <Input
      placeholder={`Search by ${searchKey}...`}
      value={searchQuery ?? ''}
      onChange={(event) => onSearch(event.target.value)}
      className={cn('h-8 w-[150px] lg:w-[250px]')}
    />
  );
}
