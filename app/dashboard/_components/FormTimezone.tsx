'use client';

import * as React from 'react';
import { TimezonePicker } from '@/components/ui/timezone-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { type UseFormReturn } from 'react-hook-form';

interface FormTimezoneProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  required?: boolean;
}

const FormTimezone = React.memo(
  ({ form, name, label = 'Timezone', required = false }: FormTimezoneProps) => {
    if (!form?.control) {
      return null;
    }

    return (
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
              <FormControl>
                <TimezonePicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    );
  }
);

FormTimezone.displayName = 'FormTimezone';

export { FormTimezone };
