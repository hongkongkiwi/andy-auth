'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { ClientLocation } from '@/constants/data';
import { columns } from './columns';
import { useClientTableFilters } from './useClientTableFilters';
import { useMemo } from 'react';
import { Client } from '@/constants/data';

export default function ClientLocationTable({
  data,
  totalData,
  clients
}: {
  data: ClientLocation[];
  totalData: number;
  clients: Client[];
}) {
  const {
    clientFilter,
    setClientFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useClientTableFilters();

  const clientOptions = useMemo(() => {
    const uniqueClientIds = Array.from(new Set(data.map(item => item.client_id)));
    return uniqueClientIds.map(clientId => {
      const client = clients.find(c => c.id === clientId);
      return {
        value: client?.name.toLowerCase() ?? '',
        label: client?.name ?? ''
      };
    });
  }, [data, clients]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="client"
          title="Company"
          options={clientOptions}
          setFilterValue={setClientFilter}
          filterValue={clientFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
