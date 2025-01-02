'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/constants/mock-api/db';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { Workspace } from '@/constants/mock-api/types';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

// Export the props interface so it can be imported by other components
export interface WorkspaceFormProps {
  initialData: Workspace;
}

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  branding: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, {
      message: 'Must be a valid hex color (e.g. #FF0000)'
    }),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, {
      message: 'Must be a valid hex color (e.g. #FFFFFF)'
    }),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, {
      message: 'Must be a valid hex color (e.g. #000000)'
    })
  })
});

const WorkspaceForm = ({ initialData }: WorkspaceFormProps) => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: initialData?.displayName || '',
      branding: {
        primaryColor: initialData?.branding.primaryColor || '#000000',
        backgroundColor: initialData?.branding.backgroundColor || '#FFFFFF',
        textColor: initialData?.branding.textColor || '#000000'
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await db.workspace.update({
        where: { id: selectedWorkspace?.id as string },
        data: values
      });
      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Workspace Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branding.primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-[24px] p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="flex-1 uppercase"
                        maxLength={7}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branding.backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-[24px] p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="flex-1 uppercase"
                        maxLength={7}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branding.textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-[24px] p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="flex-1 uppercase"
                        maxLength={7}
                      />
                    </div>
                  </FormControl>
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
                onClick={() => router.push('/dashboard')}
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

export default WorkspaceForm;
