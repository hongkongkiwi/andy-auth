'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import UserForm from './UserForm';
import PageContainer from '@/components/layout/PageContainer';
import type { User } from '@/constants/mock-api/types';

interface UserViewPageProps {
  userId?: string;
}

export default function UserViewPage({ userId }: UserViewPageProps) {
  const { selectedWorkspace } = useWorkspace();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !selectedWorkspace) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.user.findFirst({
          where: {
            id: userId,
            workspaceId: selectedWorkspace.id
          }
        });
        setUser(response);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, selectedWorkspace]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <PageContainer>
      <UserForm initialData={user} />
    </PageContainer>
  );
}
