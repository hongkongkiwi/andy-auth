'use client';

import React from 'react';
import {
  useFormContext,
  useController,
  UseControllerProps
} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';

interface Country {
  name: string;
  dialCode: string;
  countryCode: string;
}

interface FormPhoneNumberProps
  extends Omit<PhoneInputProps, 'onChange' | 'value'> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  'data-path'?: string;
  required?: boolean;
  showError?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
  onPhoneChange?: (phone: string, country: Country) => void;
  control?: UseControllerProps['control'];
}

const phoneInputStyles = cn(
  'phone-input-container',
  'flex h-10 w-full rounded-md border border-input bg-background',
  'ring-offset-background',
  'placeholder:text-muted-foreground',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

const FormPhoneNumber = React.memo(
  ({
    name,
    label,
    description,
    className,
    required,
    showError = true,
    disabled,
    defaultCountry = 'us',
    onPhoneChange,
    control,
    ...props
  }: FormPhoneNumberProps) => {
    const formContext = useFormContext();
    const formControl = formContext?.control || control;

    const phoneInputProps = {
      disabled,
      country: defaultCountry,
      containerClass: phoneInputStyles,
      inputClass:
        'w-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0',
      buttonClass: 'bg-transparent hover:bg-accent/50',
      dropdownClass: 'bg-background border border-input',
      searchClass:
        'bg-background border border-input text-foreground text-left pl-2',
      searchStyle: { textAlign: 'left' as 'left' | 'right' | 'center' },
      enableSearch: true,
      disableSearchIcon: false,
      ...props
    };

    if (!formControl) {
      return (
        <div className="mb-6">
          {label && (
            <label className="mb-2 block text-sm font-medium leading-none">
              {label}
            </label>
          )}
          <PhoneInput
            {...phoneInputProps}
            onChange={(value, country) => {
              onPhoneChange?.(value, country as Country);
            }}
          />
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      );
    }

    return (
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem className="mb-6">
            {label && (
              <FormLabel className="mb-2 block text-sm font-medium leading-none">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <PhoneInput
                {...phoneInputProps}
                {...field}
                onChange={(value, country) => {
                  field.onChange(value);
                  onPhoneChange?.(value, country as Country);
                }}
              />
            </FormControl>
            {description && (
              <FormDescription className="mt-2 text-sm">
                {description}
              </FormDescription>
            )}
            {showError && <FormMessage className="text-sm" />}
          </FormItem>
        )}
      />
    );
  }
);

FormPhoneNumber.displayName = 'FormPhoneNumber';

export { FormPhoneNumber };
