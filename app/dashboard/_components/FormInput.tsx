'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState, useCallback } from 'react';
import type { ZSFormRef } from 'zenstack-ui';
import { useFormContext } from './FormContext';
import { cn } from '@/lib/utils';

// Move wasManuallySet outside component to persist between re-renders
const wasManuallySet: { [key: string]: boolean } = {};

interface FormInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    'form' | 'value' | 'onChange'
  > {
  label: string;
  field?: {
    label?: string;
    error?: string;
  };
  required?: boolean;
  name?: string;
  mirrorTo?: string;
  'data-path'?: string;
  register?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value?: string;
  formRef?: React.RefObject<ZSFormRef>;
  error?: string;
}

export const FormInput = React.memo(
  ({
    label,
    field,
    required,
    name,
    mirrorTo,
    onChange,
    onBlur,
    'data-path': dataPath,
    register,
    value: externalValue,
    formRef,
    className,
    type = 'text',
    disabled,
    id,
    error: propError,
    ...props
  }: FormInputProps) => {
    const fieldName = name || dataPath || '';
    const [localValue, setLocalValue] = useState<string>(externalValue || '');
    const { form } = useFormContext();

    useEffect(() => {
      if (externalValue !== undefined) {
        setLocalValue(externalValue);
      }
    }, [externalValue]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (onChange) {
          onChange(e);
        }

        if (form && mirrorTo) {
          const isCurrentFieldMirror = fieldName === mirrorTo;

          if (isCurrentFieldMirror) {
            // If editing display name directly, mark it as manually edited
            wasManuallySet[mirrorTo] = true;
            form.setFieldValue(fieldName, newValue);
          } else {
            // If editing company name, mirror only if display name hasn't been manually edited
            if (!wasManuallySet[mirrorTo]) {
              form.setValues({
                ...form.values,
                [mirrorTo]: newValue,
                [fieldName]: newValue
              });
            } else {
              form.setFieldValue(fieldName, newValue);
            }
          }
        }
      },
      [form, fieldName, mirrorTo, onChange]
    );

    const error = field?.error || propError;

    return (
      <div className="mb-6 space-y-2">
        <Label
          className={cn(
            'mb-2 block text-sm font-medium leading-none',
            error && 'text-destructive'
          )}
          htmlFor={id}
        >
          {field?.label || label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        <Input
          {...props}
          id={id || fieldName}
          name={fieldName}
          data-path={dataPath}
          onChange={handleChange}
          onBlur={onBlur}
          value={localValue}
          className={cn(
            className,
            error && 'border-destructive focus-visible:ring-destructive'
          )}
          type={type}
          disabled={disabled}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
