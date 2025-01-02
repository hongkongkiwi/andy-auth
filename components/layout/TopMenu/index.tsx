'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const TopMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClientsPage = pathname === '/dashboard/clients';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    // You might want to update the URL here using router.push
  };

  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        {isClientsPage && (
          <>
            <DataTableSearch
              searchKey="name"
              searchQuery={searchQuery}
              setSearchQuery={handleSearch}
              setPage={setCurrentPage}
              className="w-[200px]"
            />
            <div className="h-4 w-[1px] bg-border" /> {/* Divider */}
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};
