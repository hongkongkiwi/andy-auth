'use client';

import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import PageContainer from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Guard } from '@/constants/mock-api/types';
import GuardTable from './GuardTable';

interface GuardListingPageProps {
  searchParams: {
    q?: string;
    page?: string;
    limit?: string;
    status?: string;
  };
}

const GuardListingPage = ({ searchParams }: GuardListingPageProps) => {
  const { selectedWorkspace } = useWorkspace();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parsedParams = {
    q: searchParams?.q,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    status: searchParams?.status
  };

  useEffect(() => {
    const fetchGuards = async () => {
      if (!selectedWorkspace) {
        setGuards([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.guard.findMany({
          where: {
            workspaceId: selectedWorkspace.id,
            ...(parsedParams.q ? { name: { contains: parsedParams.q } } : {}),
            ...(parsedParams.status
              ? {
                  status: parsedParams.status as Guard['status']
                }
              : {})
          }
        });
        setGuards(
          response.slice(
            (parsedParams.page - 1) * parsedParams.limit,
            parsedParams.page * parsedParams.limit
          )
        );
      } catch (error) {
        console.error('Failed to fetch guards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuards();
  }, [selectedWorkspace, parsedParams]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={`Guards (${guards.length})`}
          description="Manage your organization's guards"
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Guard
        </Button>
      </div>
      <Separator className="my-4" />
      <GuardTable data={guards} totalData={guards.length} />
    </PageContainer>
  );
};

export default GuardListingPage;
