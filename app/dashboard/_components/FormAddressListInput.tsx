'use client';

import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormAddressInput } from './FormAddressInput';

interface FormAddressListInputProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  label: string;
  required?: boolean;
}

export const FormAddressListInput = ({
  value,
  onChange,
  label,
  required
}: FormAddressListInputProps) => {
  console.log('FormAddressListInput props:', { value, label, required });

  const addresses = Array.isArray(value) ? value : [];

  const handleAddAddress = () => {
    onChange?.([...addresses, {}]);
  };

  const handleRemoveAddress = (index: number) => {
    onChange?.(addresses.filter((_, i) => i !== index));
  };

  const handleAddressChange = (index: number) => (addressValue: any) => {
    const newAddresses = [...addresses];
    newAddresses[index] = addressValue;
    onChange?.(newAddresses);
  };

  return (
    <div className="space-y-4">
      {addresses.map((address, index) => (
        <div key={index} className="relative rounded-lg border p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => handleRemoveAddress(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <FormAddressInput
            value={address}
            onChange={handleAddressChange(index)}
            label={`${label} ${index + 1}`}
            required={required}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddAddress}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add {label}
      </Button>
    </div>
  );
};
