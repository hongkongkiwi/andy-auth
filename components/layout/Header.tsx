'use client';

import { type FC } from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import ThemeToggle from './ThemeToggle';
import { searchAPI } from '@/constants/mock-api';

export const Header: FC = () => {
  const handleSearch = async (query: string): Promise<void> => {
    const results = await searchAPI.search(query);
    // Handle results...
  };

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background">
      <div className="flex flex-1 items-center justify-between px-4">
        <nav className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Breadcrumbs />
        </nav>

        <nav className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchInput onSearch={handleSearch} />
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
