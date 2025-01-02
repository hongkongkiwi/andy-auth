'use client';

import { useState, useEffect } from 'react';
import { db } from '@/constants/mock-api/db';
import type { Guard } from '@/constants/mock-api/types';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import PageContainer from '@/components/layout/PageContainer';
import { LoadingSkeleton } from './LoadingSkeleton';
import TabbedView from './TabbedView';

interface GuardViewPageProps {
  guardId: string;
}

export const GuardViewPage = ({ guardId }: GuardViewPageProps) => {
  const { selectedWorkspace } = useWorkspace();
  const [guard, setGuard] = useState<Guard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuard = async () => {
      if (!selectedWorkspace) {
        setGuard(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.guard.findFirst({
          where: {
            id: guardId,
            workspaceId: selectedWorkspace.id
          }
        });
        setGuard(response);
      } catch (error) {
        console.error('Failed to fetch guard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuard();
  }, [selectedWorkspace, guardId]);

  if (isLoading) return <LoadingSkeleton />;
  if (!guard) return <div>Guard not found</div>;

  return (
    <PageContainer scrollable={false} className="p-0">
      <TabbedView guardId={guardId} guard={guard} />
    </PageContainer>
  );
};

export default GuardViewPage;
