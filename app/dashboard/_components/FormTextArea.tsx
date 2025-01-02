'use client';

import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  'data-path'?: string;
  required?: boolean;
  showError?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
}

const FormTextArea = ({
  name,
  label,
  description,
  className,
  'data-path': dataPath,
  required = false,
  showError = true,
  rows = 3,
  maxLength,
  disabled = false,
  ...props
}: FormTextAreaProps) => {
  const formContext = useFormContext();

  if (!formContext) {
    return (
      <div className="mb-6">
        {label && (
          <label className="mb-2 block text-sm font-medium leading-none">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <Textarea
          name={name}
          className={cn(
            'min-h-[80px] resize-none text-sm',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-describedby={description ? `${name}-description` : undefined}
          {...props}
        />
        {description && (
          <p className="mt-2 text-[0.8rem] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="mb-6">
          {label && (
            <FormLabel className="mb-2 block text-sm font-medium leading-none">
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              {...props}
              className={cn(
                'min-h-[80px] resize-none text-sm',
                fieldState?.error && 'border-red-500',
                disabled && 'cursor-not-allowed opacity-50',
                className
              )}
              data-path={dataPath}
              rows={rows}
              maxLength={maxLength}
              disabled={disabled}
              aria-describedby={description ? `${name}-description` : undefined}
              aria-invalid={!!fieldState?.error}
            />
          </FormControl>
          {description && (
            <FormDescription className="mt-2 text-[0.8rem]">
              {description}
            </FormDescription>
          )}
          {showError && <FormMessage className="text-[0.8rem]" />}
        </FormItem>
      )}
    />
  );
};

export { FormTextArea };
