import {
  Combobox,
  type ComboboxStore,
  Input,
  InputBase,
  ScrollArea,
  useCombobox
} from '@mantine/core';
import { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// This component is an in-progress rewrite of SearchableSelect
// It uses custom Mantine Combobox components instead of customizing an existing Select
// This version will have better functionality and performance

/**
 * MySelect - a better version of the Mantine Select component
 * This component borrows the design of the shadcn select component
 * - Supports numbers for values
 * - Uses seaparate search input in dropdown
 * - Automatically changes active element when scrolling (just like shadcn)
 *
 */

type BaseValue = number | string;

interface SelectValue {
  label: string;
  value: BaseValue;
}

interface SearchableSelectProps {
  data: SelectValue[];
  value?: BaseValue | null;
  onChange?: (value: BaseValue | null) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  defaultValue?: BaseValue | null;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SELECT_DROPDOWN_TRANSITION = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0.95)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity'
} as const;

const SelectSkeleton = ({
  size = 'md'
}: {
  size?: 'sm' | 'md' | 'lg';
}): JSX.Element => (
  <InputBase className="animate-pulse">
    <div
      className={cn(
        'rounded bg-muted',
        size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10'
      )}
    />
  </InputBase>
);

const SearchableSelectOption = ({
  item,
  selectedValue,
  combobox,
  index
}: {
  item: SelectValue;
  selectedValue: BaseValue | null;
  combobox: ComboboxStore;
  index: number;
}): JSX.Element => {
  const handleMouseMove = () => {
    combobox.selectOption(index);
  };

  return (
    <Combobox.Option
      value={item.label}
      key={item.value}
      active={item.value === selectedValue}
      className="flex w-full items-center"
      onMouseMove={handleMouseMove}
    >
      <div className="flex w-6 items-center">
        {item.value === selectedValue && <CheckCircle2 className="h-4 w-4" />}
      </div>
      {item.label}
    </Combobox.Option>
  );
};

export const SearchableSelect = ({
  data,
  value,
  onChange,
  onBlur,
  onFocus,
  defaultValue = null,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  label,
  description,
  className,
  disabled = false,
  required = false,
  error,
  isLoading = false,
  size = 'md'
}: SearchableSelectProps): JSX.Element => {
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
    },
    onDropdownOpen: () => {
      setSearch('');
      combobox.selectFirstOption();
      combobox.focusSearchInput();
    }
  });

  const [search, setSearch] = useState('');
  const [internalValue, setInternalValue] = useState<BaseValue | null>(
    defaultValue ?? null
  );

  const selectedValue = value ?? internalValue;
  const selectedItem = data.find((item) => item.value === selectedValue);
  const selectedLabel = selectedItem?.label || '';

  // Memoize filtered options
  const filteredOptions = useMemo(
    () =>
      data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [data, search]
  );

  useEffect(() => {
    combobox.selectFirstOption();
  }, [search]);

  // Memoize options
  const options = useMemo(
    () =>
      filteredOptions.map((item, index) => (
        <SearchableSelectOption
          key={item.value}
          item={item}
          selectedValue={selectedValue}
          combobox={combobox}
          index={index}
        />
      )),
    [filteredOptions, selectedValue, combobox]
  );

  // Improve loading state with proper skeleton
  if (isLoading) {
    return <SelectSkeleton size={size} />;
  }

  return (
    <Combobox
      styles={{
        search: {
          width: '100%',
          borderBottom: '1px solid var(--bd-light)',
          backgroundColor: 'var(--mantine-body)',
          height: size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px'
        }
      }}
      transitionProps={{
        transition: SELECT_DROPDOWN_TRANSITION,
        duration: 100
      }}
      store={combobox}
      withinPortal={true}
      onOptionSubmit={(label) => {
        const selected = data.find((item) => item.label === label);
        const newValue = selected?.value ?? null;
        if (value !== undefined) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
          onChange?.(newValue);
        }
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          required={required}
          label={label}
          description={description}
          error={error}
          className={cn(
            'mantine-Select-wrapper',
            className,
            error && 'border-destructive'
          )}
          component="button"
          type="button"
          pointer
          disabled={disabled}
          rightSection={<Combobox.Chevron />}
          onClick={() => !disabled && combobox.toggleDropdown()}
          onFocus={onFocus}
          onBlur={onBlur}
          rightSectionPointerEvents="none"
        >
          {selectedLabel || (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          leftSection={<Search className="h-4 w-4" />}
          variant="unstyled"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={searchPlaceholder}
        />
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty className="text-left">
                Nothing found
              </Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
