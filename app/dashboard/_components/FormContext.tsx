'use client';

import { UseFormReturnType } from '@mantine/form';
import { createContext, useContext } from 'react';

type FormContextType = {
  form: UseFormReturnType<any> | null;
};

export const FormContext = createContext<FormContextType>({ form: null });

export const useFormContext = () => useContext(FormContext);
