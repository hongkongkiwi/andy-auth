'use client';

import {
  useState,
  ComponentPropsWithoutRef,
  SelectHTMLAttributes,
  FocusEventHandler
} from 'react';
import Select from 'react-select';
import { countries, type TCountries } from 'countries-list';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ICountry } from 'countries-list';

// Updated interfaces without 'I' prefix
interface CountryExtended extends ICountry {
  emoji: string;
}

interface CountryOption {
  value: string;
  label: string;
  sublabel: string;
  flag: string;
  phone: string[];
}

interface CustomOptionProps {
  data: CountryOption;
  innerProps: JSX.IntrinsicElements['div'];
}

interface CountrySelectProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  readOnly?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  id?: string;
}

// Type guard to ensure countries object matches our interface
const isCountryRecord = (obj: any): obj is Record<string, ICountry> => {
  if (typeof obj !== 'object' || obj === null) return false;

  return Object.values(obj).every(
    (country) =>
      country !== null &&
      typeof country === 'object' &&
      'name' in country &&
      'native' in country &&
      'phone' in country &&
      'continent' in country &&
      'capital' in country &&
      'currency' in country &&
      'languages' in country &&
      Array.isArray((country as any).languages) &&
      'emoji' in country
  );
};

// Custom hook for country data management
const useCountryData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryOptions = (() => {
    try {
      setIsLoading(true);
      const typedCountries = countries as unknown as Record<
        keyof TCountries,
        ICountry & { emoji: string }
      >;

      if (!isCountryRecord(typedCountries)) {
        throw new Error('Countries data structure is invalid');
      }

      const options = Object.entries(typedCountries)
        .sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
        .map(([code, country]) => ({
          value: code,
          label: country.name,
          sublabel: code,
          flag: country.emoji,
          phone: country.phone.map(String)
        }));

      if (!options.length) {
        throw new Error('Failed to load country options');
      }

      return options;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load countries');
      return [];
    } finally {
      setIsLoading(false);
    }
  })();

  return { countryOptions, isLoading, error };
};

const CustomCountryOption = ({
  data,
  innerProps
}: CustomOptionProps): JSX.Element => (
  <div
    {...innerProps}
    className={cn(
      'flex cursor-pointer items-center px-3 py-2',
      'hover:bg-accent hover:text-accent-foreground'
    )}
  >
    <span className="mr-2">{data.flag}</span>
    <span>{data.label}</span>
    <span className="ml-auto text-sm text-muted-foreground">
      ({data.sublabel})
    </span>
  </div>
);

const CustomCountryValue = ({ data }: { data: CountryOption }): JSX.Element => (
  <div className="flex items-center gap-2">
    <span>{data.flag}</span>
    <span>{data.label}</span>
    <span className="text-muted-foreground">({data.sublabel})</span>
  </div>
);

const CountrySelect = ({
  onChange,
  value,
  label,
  error,
  description,
  containerClassName,
  labelClassName,
  descriptionClassName,
  className,
  id,
  ...rest
}: CountrySelectProps): JSX.Element => {
  const { countryOptions, isLoading, error: dataError } = useCountryData();

  const handleChange = (option: CountryOption | null): void => {
    if (!option || !onChange) return;
    onChange(option.value);
  };

  const selectedCountry =
    countryOptions.find((option) => option.value === value) ??
    countryOptions.find((option) => option.value === 'US');

  const displayError = error || dataError;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(displayError && 'text-destructive', labelClassName)}
        >
          {label}
          {rest.required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      {description && (
        <p
          id={`${id}-description`}
          className={cn('text-sm text-muted-foreground', descriptionClassName)}
        >
          {description}
        </p>
      )}

      <Select
        id={id}
        options={countryOptions}
        value={selectedCountry}
        onChange={handleChange}
        isLoading={isLoading}
        components={{
          Option: CustomCountryOption,
          SingleValue: CustomCountryValue
        }}
        className={cn(
          'country-select',
          displayError && 'country-select--error',
          className
        )}
        classNames={{
          control: (state) =>
            cn(
              '!border-input !bg-background !shadow-none hover:!border-input',
              state.isFocused && '!ring-2 !ring-ring !ring-offset-0',
              displayError && '!border-destructive !ring-destructive',
              rest.disabled && '!opacity-50 !cursor-not-allowed'
            ),
          menu: () => '!bg-popover !border-border',
          option: () => '!bg-transparent'
        }}
        classNamePrefix="country-select"
        isSearchable
        aria-label="Select country"
        aria-describedby={description ? `${id}-description` : undefined}
        aria-invalid={!!displayError}
        noOptionsMessage={() => 'No countries found'}
        loadingMessage={() => 'Loading countries...'}
      />

      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  );
};

CountrySelect.displayName = 'CountrySelect';

// Update exports at bottom
export type { CountryOption, CountrySelectProps };
export default CountrySelect;
