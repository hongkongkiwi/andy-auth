'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

// Move timezone data directly into component for now
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'GMT', label: 'GMT' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'British Time (BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' }
] as const;

interface TimezonePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TimezonePicker = React.memo(
  ({ value, onChange }: TimezonePickerProps) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? TIMEZONES.find((timezone) => timezone.value === value)?.label
              : 'Select timezone...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search timezone..." />
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {TIMEZONES.map((timezone) => (
                <CommandItem
                  key={timezone.value}
                  value={timezone.value}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === timezone.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {timezone.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

TimezonePicker.displayName = 'TimezonePicker';

export { TimezonePicker };
