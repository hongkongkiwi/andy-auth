'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import PageContainer from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import type { Workspace } from '@/constants/mock-api/types';
import { db } from '@/constants/mock-api/db';
import dynamic from 'next/dynamic';
import type { WorkspaceFormProps } from './WorkspaceForm';

const WorkspaceForm = dynamic<WorkspaceFormProps>(
  () => import('./WorkspaceForm'),
  { loading: () => <LoadingSkeleton /> }
);

const WorkspaceSettingsPage = () => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  let selectedWorkspace;
  try {
    ({ selectedWorkspace } = useWorkspace());
  } catch (e) {
    return <LoadingSkeleton />;
  }

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!selectedWorkspace) {
        setWorkspace(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.workspace.findFirst({
          where: { id: selectedWorkspace.id }
        });
        setWorkspace(response);
      } catch (error) {
        console.error('Failed to fetch workspace:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [selectedWorkspace]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>Error loading workspace: {error.message}</div>;
  if (!workspace) return <div>Workspace not found</div>;

  return (
    <PageContainer>
      <WorkspaceForm initialData={workspace} />
    </PageContainer>
  );
};

export default WorkspaceSettingsPage;
