'use client';

import { Input } from './input';
import { InputProps } from './input';

interface NumberInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
}

export const NumberInput = ({
  value,
  onChange,
  ...props
}: NumberInputProps) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange?.(parseFloat(e.target.value))}
      {...props}
    />
  );
};
