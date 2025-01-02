'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Script from 'next/script';
import { useFormContext } from './FormContext';

interface FormAddressInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    'form' | 'value' | 'onChange'
  > {
  label?: string;
  field?: { label?: string };
  required?: boolean;
  name?: string;
  'data-path'?: string;
  register?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value?: string;
}

export const FormAddressInput = React.memo(
  ({
    label,
    field,
    required,
    name,
    'data-path': dataPath,
    register,
    onChange,
    onBlur,
    value: externalValue,
    className,
    type = 'text',
    disabled,
    id,
    ...props
  }: FormAddressInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { form } = useFormContext();
    const fieldName = name || dataPath || '';

    // Initialize Google Places Autocomplete only once when component mounts
    useEffect(() => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: ['us', 'ca'] }
        }
      );

      const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        if (!place.formatted_address) return;

        // Update form value
        if (form) {
          form.setFieldValue(fieldName, place.formatted_address);
        }

        // Call original onChange if provided
        if (onChange) {
          const syntheticEvent = {
            target: { value: place.formatted_address }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      };

      autocomplete.addListener('place_changed', handlePlaceSelect);

      return () => {
        window.google?.maps.event.clearInstanceListeners(autocomplete);
      };
    }, [fieldName, form]); // Only re-run if fieldName or form changes

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e);
        }
        if (form) {
          form.setFieldValue(fieldName, e.target.value);
        }
      },
      [onChange, form, fieldName]
    );

    return (
      <>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
        <div className="mb-6">
          <Label
            className="mb-2 block text-sm font-medium leading-none"
            htmlFor={id}
          >
            {field?.label || label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Input
            {...props}
            ref={inputRef}
            id={id || fieldName}
            name={fieldName}
            data-path={dataPath}
            onChange={handleChange}
            onBlur={onBlur}
            value={externalValue}
            className={className}
            type={type}
            disabled={disabled}
          />
        </div>
      </>
    );
  }
);

FormAddressInput.displayName = 'FormAddressInput';
