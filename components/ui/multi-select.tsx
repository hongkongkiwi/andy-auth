'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from './command';
import { Badge } from './badge';
import { X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = 'Select items...'
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="hover:bg-secondary"
            >
              {options.find((opt) => opt.value === value)?.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSelect(value);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleSelect(value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandInput placeholder={placeholder} />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
};
