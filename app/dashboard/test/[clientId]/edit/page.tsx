'use client';

import { MantineProvider } from '@mantine/core';
import { ZenstackUIProvider, ZSUpdateForm } from 'zenstack-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FormContext } from '@/app/dashboard/_components/FormContext';
import { zenstackUIConfig } from '../../../../lib/formConfig';
import { queryClient } from '../../queryClient';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { UseFormReturnType } from '@mantine/form';
import { useParams } from 'next/navigation';

type FormRef = {
  form: UseFormReturnType<{
    [key: string]: any;
  }>;
};

const Page = () => {
  const { selectedWorkspace } = useWorkspace();
  const formRef = useRef<FormRef>(null);
  const [formInstance, setFormInstance] =
    useState<UseFormReturnType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const params = useParams();

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

  const handleSubmit = async (data: Record<string, any>) => {
    if (!selectedWorkspace) {
      setError(new Error('No workspace selected'));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Add workspaceId to the form data
      const formData = {
        ...data,
        workspaceId: selectedWorkspace.id
      };
      console.log('Form submitted:', formData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Submission failed'));
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
              <h1 className="mb-6 text-2xl font-bold">Edit Client</h1>
              <ZSUpdateForm
                model="Client"
                id={params.clientId as string}
                formRef={formRef}
                onSubmit={handleSubmit}
                className="space-y-2"
              />
            </div>
          </FormContext.Provider>
        </ZenstackUIProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default Page;
