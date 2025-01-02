'use client';

import { MantineProvider } from '@mantine/core';
import { ZenstackUIProvider, ZSCreateForm } from 'zenstack-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FormContext } from '@/app/dashboard/_components/FormContext';
import { zenstackUIConfig } from '../../../lib/formConfig';
import { queryClient } from '../queryClient';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { UseFormReturnType } from '@mantine/form';
import { ClientSchema } from '@/lib/zenstack/zod/models/Client.schema';
import { z } from 'zod';
import { FormInput } from '@/app/dashboard/_components/FormInput';
import { FormAddressInput } from '@/app/dashboard/_components/FormAddressInput';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type FormRef = {
  form: UseFormReturnType<{
    [key: string]: any;
  }>;
};

// Create a type-safe schema for the form
const createClientSchema = ClientSchema.omit({
  id: true
  // createdAt: true,
  // updatedAt: true
});

type CreateClientInput = z.infer<typeof createClientSchema>;

const Page = () => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const formRef = useRef<FormRef>(null);
  const [formInstance, setFormInstance] =
    useState<UseFormReturnType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const formConfig = {
    defaultValues: {
      workspaceId: selectedWorkspace?.id
    }
  };

  useEffect(() => {
    if (formRef.current?.form) {
      formRef.current.form.setValues(formConfig.defaultValues);
      setFormInstance(formRef.current.form);
    }
  }, [formRef.current, selectedWorkspace]);

  const handleSubmit = async (data: CreateClientInput) => {
    if (!selectedWorkspace) {
      setError(new Error('No workspace selected'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = {
        ...data,
        workspaceId: selectedWorkspace.id
      };

      // Validate the data against our schema first
      const validationResult = createClientSchema.safeParse(formData);

      if (!validationResult.success) {
        // If validation fails, show error toast and return
        toast.error('Please check the form for errors');
        return;
      }

      // Use the create mutation from zenstack hooks
      await zenstackUIConfig.hooks.useCreateClient.mutateAsync(
        validationResult.data
      );

      toast.success('Client created successfully');
      router.push('/dashboard/test');
      router.refresh();
    } catch (err) {
      console.error('Failed to create client:', err);
      toast.error('Failed to create client');
      setError(
        err instanceof Error ? err : new Error('Failed to create client')
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedWorkspace) {
    return <div className="p-4">Please select a workspace first</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <ZenstackUIProvider config={zenstackUIConfig}>
          <FormContext.Provider value={{ form: formInstance }}>
            <div className="relative">
              <h1 className="mb-6 text-2xl font-bold">Create New Client</h1>
              <ZSCreateForm
                model="Client"
                formRef={formRef}
                onSubmit={handleSubmit}
                className="space-y-2"
                schemaOverride={createClientSchema}
              />
            </div>
          </FormContext.Provider>
        </ZenstackUIProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default Page;
