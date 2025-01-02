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
import type { User } from '@/constants/mock-api/types';
import UserTable from './UserTable';
import { useRouter } from 'next/navigation';

const UserListingPage = () => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedWorkspace) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.user.findMany({
          where: { workspaceId: selectedWorkspace.id }
        });
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [selectedWorkspace]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title="Users"
          description="Manage workspace users and their permissions"
        />
        <Button onClick={() => router.push('/dashboard/users/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <Separator className="my-4" />
      <UserTable data={users} totalData={users.length} />
    </PageContainer>
  );
};

export default UserListingPage;
