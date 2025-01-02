'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { Check, Loader2, MapPin } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command';
import { useDebounce } from '@/hooks/use-debounce';

interface GoogleAddressAutocompleteProps {
  onAddressSelect: (address: AddressResult) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface AddressResult {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

const GoogleAddressAutocomplete = ({
  onAddressSelect,
  className,
  placeholder = 'Search address...',
  disabled = false
}: GoogleAddressAutocompleteProps) => {
  const [input, setInput] = useState<string>('');
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const autoCompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    if (!window.google) {
      throw new Error('Google Maps JavaScript API not loaded');
    }

    autoCompleteService.current = new google.maps.places.AutocompleteService();
    const div = document.createElement('div');
    placesService.current = new google.maps.places.PlacesService(div);
  }, []);

  useEffect(() => {
    const getPredictions = async () => {
      if (!debouncedInput || disabled) return setPredictions([]);

      setLoading(true);
      try {
        const response = await autoCompleteService.current?.getPlacePredictions(
          {
            input: debouncedInput,
            componentRestrictions: { country: 'us' }, // Modify for your needs
            types: ['address']
          }
        );
        setPredictions(response?.predictions || []);
        setOpen(true);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    getPredictions();
  }, [debouncedInput, disabled]);

  const handleSelect = async (placeId: string) => {
    setLoading(true);
    try {
      placesService.current?.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry']
        },
        (place, status) => {
          if (
            status === 'OK' &&
            place?.formatted_address &&
            place.geometry?.location
          ) {
            const result: AddressResult = {
              address: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              placeId
            };
            onAddressSelect(result);
            setInput(place.formatted_address);
            setPredictions([]);
            setOpen(false);
          }
        }
      );
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Command className={cn('relative', className)}>
        <div className="relative">
          <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <CommandInput
            value={input}
            onValueChange={setInput}
            className="pl-8"
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        {open && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  onSelect={() => handleSelect(prediction.place_id)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      prediction.place_id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
      {loading && (
        <div className="absolute right-2 top-2.5">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export { GoogleAddressAutocomplete };
export type { AddressResult };
