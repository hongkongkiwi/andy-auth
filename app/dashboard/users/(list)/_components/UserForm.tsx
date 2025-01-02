'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { db } from '@/constants/mock-api/db';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { User } from '@/constants/mock-api/types';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  role: z.enum(['admin', 'manager', 'user']),
  status: z.enum(['active', 'inactive']).default('active'),
  permissions: z.array(z.string()).default([])
});

interface UserFormProps {
  initialData?: User | null;
}

export const UserForm = ({ initialData }: UserFormProps) => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'user',
      status: initialData?.status || 'active',
      permissions: initialData?.permissions || []
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await db.user.update({
          where: { id: initialData.id },
          data: values
        });
      } else {
        await db.user.create({
          data: {
            ...values,
            workspaceId: selectedWorkspace?.id as string,
            status: 'active',
            permissions: []
          }
        });
      }
      router.refresh();
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {initialData ? 'Edit User' : 'New User'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/users')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
