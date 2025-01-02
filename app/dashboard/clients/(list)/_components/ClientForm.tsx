'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCreateClient } from '@/lib/zenstack/hooks';
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
import type { Client } from '@prisma/client';

interface ClientFormProps {
  initialData?: Client;
}

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  clientEmail: z.string().email({
    message: 'Please enter a valid email.'
  }),
  clientPhoneNumber: z.string().optional()
});

const ClientForm = ({ initialData }: ClientFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const createClient = useCreateClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: initialData?.displayName || '',
      clientEmail: initialData?.clientEmail || '',
      clientPhoneNumber: initialData?.clientPhoneNumber || ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createClient.mutateAsync({
      data: {
        slug: values.displayName.toLowerCase().replace(/\s+/g, '-'),
        displayName: values.displayName,
        clientEmail: values.clientEmail,
        clientPhoneNumber: values.clientPhoneNumber,
        workspace: {
          connect: {
            id: session?.user?.workspaceId
          }
        }
      }
    });
    router.push('/dashboard/clients');
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter client email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending ? 'Creating...' : 'Create Client'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
