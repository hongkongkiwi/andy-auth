'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FormCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  label: string;
  field?: { label?: string };
  required?: boolean;
}

export const FormCheckbox = ({
  label,
  field,
  required,
  ...props
}: FormCheckboxProps) => {
  return (
    <div className="mb-6 flex items-center space-x-3">
      <Checkbox {...props} />
      <Label className="cursor-pointer">
        {field?.label || label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
    </div>
  );
};
