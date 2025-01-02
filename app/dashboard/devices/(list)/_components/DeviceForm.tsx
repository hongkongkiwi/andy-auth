'use client';

import * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Device } from '@/constants/mock-api/types';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  type: z.enum(['mobile', 'tablet', 'beacon', 'camera'], {
    required_error: 'Please select a device type.'
  }),
  status: z.enum(['active', 'inactive', 'maintenance'], {
    required_error: 'Please select a status.'
  })
});

interface DeviceFormProps {
  initialData?: Device;
}

export const DeviceForm = ({ initialData }: DeviceFormProps) => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || undefined,
      status: initialData?.status || undefined
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await db.device.update({
          where: { id: initialData.id },
          data: values
        });
      } else {
        await db.device.create({
          data: {
            ...values,
            workspaceId: selectedWorkspace?.id as string
          }
        });
      }
      router.refresh();
      router.push('/dashboard/devices');
    } catch (error) {
      console.error('Failed to save device:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {initialData ? 'Edit Device' : 'New Device'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter device name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="beacon">Beacon</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Device'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
