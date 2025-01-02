'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimezonePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  label?: string;
  required?: boolean;
  field?: { label?: string };
}

const getTimezones = () => {
  try {
    // Get all IANA timezones
    const timezones = Intl.supportedValuesOf('timeZone');

    // Sort timezones by offset and name
    return timezones.sort((a, b) => {
      const offsetA = new Date().toLocaleString('en-US', {
        timeZone: a,
        timeZoneName: 'shortOffset'
      });
      const offsetB = new Date().toLocaleString('en-US', {
        timeZone: b,
        timeZoneName: 'shortOffset'
      });
      if (offsetA === offsetB) {
        return a.localeCompare(b);
      }
      return offsetA.localeCompare(offsetB);
    });
  } catch (e) {
    console.error('Failed to get timezones:', e);
    return [];
  }
};

const formatTimezone = (timezone: string) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    });

    // Get the current time in this timezone
    const timeString = formatter.format(date);

    // Get the UTC offset
    const offset = date
      .toLocaleString('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset'
      })
      .split(' ')
      .pop();

    // Format the timezone name to be more readable
    const name = timezone
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\//g, ' – ') // Replace slashes with en-dashes
      .split(' – ') // Split into parts
      .pop() // Take the last part (city name)
      ?.replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      ?.trim(); // Remove extra spaces

    // Format: "New York (UTC-4) 14:30"
    return `${name} (${offset}) ${timeString}`;
  } catch (e) {
    console.error('Error formatting timezone:', e);
    return timezone.replace(/_/g, ' ');
  }
};

const filterTimezones = (
  timezones: string[],
  searchValue: string,
  selectedValue?: string
) => {
  const search = searchValue.toLowerCase();
  return timezones.filter((timezone) => {
    const formattedZone = formatTimezone(timezone).toLowerCase();
    return (
      timezone.toLowerCase().includes(search) || formattedZone.includes(search)
    );
  });
};

const groupTimezones = (timezones: string[]) => {
  const groups: Record<string, string[]> = {};

  timezones.forEach((timezone) => {
    const [region] = timezone.split('/');
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(timezone);
  });

  return groups;
};

export const TimezonePicker = ({
  value,
  onChange,
  className,
  label,
  required,
  field
}: TimezonePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Add ref for the selected item
  const selectedItemRef = React.useRef<HTMLDivElement>(null);

  // Add a ref for the scroll area viewport
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Update the useEffect to include detailed logging
  React.useEffect(() => {
    console.log('Effect triggered:', { open, value });

    if (open) {
      requestAnimationFrame(() => {
        const scrollArea = scrollAreaRef.current?.querySelector(
          '[data-radix-scroll-area-viewport]'
        );
        const selectedItem = selectedItemRef.current;

        if (scrollArea && selectedItem) {
          const offsetTop = selectedItem.offsetTop;
          scrollArea.scrollTo({
            top: offsetTop,
            behavior: 'auto'
          });
        }
      });
    }
  }, [open, value]);

  // Load timezones on mount
  React.useEffect(() => {
    const loadTimezones = () => {
      try {
        setIsLoading(true);
        setError(null);
        const zones = getTimezones();
        if (zones.length === 0) {
          throw new Error('No timezones available');
        }
        setTimezones(zones);
      } catch (e) {
        console.error('Error loading timezones:', e);
        setError('Failed to load timezones');
      } finally {
        setIsLoading(false);
      }
    };
    loadTimezones();
  }, []);

  // Update the filtered timezones memo to include the selected value
  const filteredTimezones = React.useMemo(() => {
    return searchValue
      ? filterTimezones(timezones, searchValue, value)
      : filterTimezones(timezones, '', value);
  }, [timezones, searchValue, value]);

  const groupedTimezones = React.useMemo(() => {
    return groupTimezones(filteredTimezones);
  }, [filteredTimezones]);

  const commandContent = (
    <Command>
      <CommandInput
        placeholder="Search timezone..."
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>No timezone found.</CommandEmpty>
        <ScrollArea className="h-[300px]" ref={scrollAreaRef}>
          {Object.entries(groupedTimezones).map(([region, zones]) => (
            <CommandGroup key={region} heading={region}>
              {zones.map((timezone) => (
                <CommandItem
                  key={timezone}
                  value={timezone}
                  ref={timezone === value ? selectedItemRef : undefined}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue);
                    setOpen(false);
                    setSearchValue('');
                  }}
                  className={cn(timezone === value && 'bg-accent')}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === timezone ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {formatTimezone(timezone)}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </ScrollArea>
      </CommandList>
    </Command>
  );

  return (
    <div className="space-y-2">
      {(label || field?.label) && (
        <Label>
          {field?.label || label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', className)}
            disabled={isLoading || !!error}
          >
            {value
              ? formatTimezone(value)
              : isLoading
                ? 'Loading...'
                : error
                  ? 'Error loading timezones'
                  : 'Select timezone...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
          {error ? (
            <div className="p-4 text-center text-sm text-red-500">{error}</div>
          ) : isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading timezones...
            </div>
          ) : (
            commandContent
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimezonePicker;
