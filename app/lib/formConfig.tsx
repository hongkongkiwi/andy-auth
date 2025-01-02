import * as schemas from '@/lib/zenstack/zod/models';
import * as hooks from '@/lib/zenstack/hooks';
import { useEffect } from 'react';
import metadata from '@/lib/zenstack/hooks/__model_meta';
import { FieldType, type Metadata, type Field } from 'zenstack-ui';
import { SearchableSelect } from '../dashboard/_components/SearchableSelect';
import { queryClient } from '../dashboard/test/queryClient';
import { FormCheckbox } from '../dashboard/_components/FormCheckbox';
import { FormInput } from '../dashboard/_components/FormInput';
import { FormTextArea } from '../dashboard/_components/FormTextArea';
import { FormTimezone } from '../dashboard/_components/FormTimezone';
import { FormPhoneNumber } from '../dashboard/_components/FormPhoneNumber';
import { FormAddressInput } from '../dashboard/_components/FormAddressInput';
import { MultiSelect } from '@/components/ui/multi-select';
import { DatePicker } from '@/components/ui/date-picker';
import { NumberInput } from '@/components/ui/number-input';
import type {
  MapFieldTypeToElement,
  MapSubmitTypeToButton,
  SubmitButtonProps,
  ZenstackUIConfigType
} from './formProvider';
import { Button } from '@/components/ui/button';

// Helper function to convert camelCase to Title Case
const formatFieldLabel = (field: string): string => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const updateClientFields = (metadata: Metadata) => {
  const fields = metadata?.models?.client?.fields;
  if (!fields) return metadata;

  const fieldUpdates = {};

  Object.keys(fields).forEach((key) => {
    const field = fields[key] as Field;
    const fieldUpdate = fieldUpdates[
      key as keyof typeof fieldUpdates
    ] as Partial<Field>;

    if (field && typeof field === 'object') {
      if (fieldUpdate && typeof fieldUpdate === 'object') {
        fields[key] = { ...field, ...fieldUpdate } as Field;
      } else if (!field.label) {
        fields[key] = { ...field, label: formatFieldLabel(key) } as Field;
      }
    }
  });

  const hiddenFields = ['id', 'workspaceId', 'createdAt', 'updatedAt'];
  hiddenFields.forEach((field) => {
    if (fields[field]) fields[field].hidden = true;
  });

  return metadata;
};

const modifiedMetadata = updateClientFields(
  structuredClone(metadata) as Metadata
);

export const mapFieldTypeToElement: MapFieldTypeToElement = {
  [FieldType.Boolean]: FormCheckbox,
  [FieldType.String]: (props) => {
    const { formRef, ...otherProps } = props;

    // Add effect to track form ref changes
    useEffect(() => {
      console.log('String field form ref changed:', {
        formRef,
        hasForm: !!formRef?.current?.form,
        formMethods: formRef?.current?.form
          ? Object.keys(formRef.current.form)
          : []
      });
    }, [formRef]);

    switch (props['data-path']) {
      case 'companyName':
        return (
          <FormInput
            {...otherProps}
            label={props.label || 'Company Name'}
            mirrorTo="displayName"
            name={props['data-path']}
            required={props.required}
            value={props.value}
            formRef={formRef} // Pass formRef directly
            onChange={(e) => {
              const newValue = e.target.value;
              console.log('CompanyName onChange:', {
                newValue,
                hasFormRef: !!formRef,
                formExists: !!formRef?.current?.form,
                formValues: formRef?.current?.form?.values
              });

              // First call original onChange
              if (props.onChange) {
                props.onChange(e);
              }

              // Then handle mirroring
              if (formRef?.current?.form) {
                const form = formRef.current.form;

                console.log('Mirroring value:', {
                  from: 'companyName',
                  to: 'displayName',
                  value: newValue,
                  currentFormValues: form.values
                });

                // Update both fields
                form.setValues({
                  ...form.values,
                  displayName: newValue,
                  companyName: newValue
                });
              }
            }}
            onBlur={props.onBlur}
          />
        );
      case 'displayName':
        return (
          <FormInput
            {...props}
            label={props.label || 'Display Name'}
            name={props['data-path']}
            required={props.required}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            formRef={props.formRef}
            mirrorTo="displayName"
          />
        );
      case 'internalNotes':
        return <FormTextArea {...props} />;
      case 'timezone':
        return <FormTimezone {...props} />;
      case 'phoneNumber':
        return <FormPhoneNumber {...props} />;
      default:
        return (
          <FormInput
            {...props}
            label={props.label || props['data-path']}
            name={props['data-path']}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        );
    }
  },
  [FieldType.Int]: NumberInput,
  [FieldType.Float]: NumberInput,
  [FieldType.Enum]: SearchableSelect,
  [FieldType.DateTime]: DatePicker,
  [FieldType.ReferenceSingle]: (props) => <SearchableSelect {...props} />,
  [FieldType.ReferenceMultiple]: (props) => <MultiSelect {...props} />,
  GooglePlacesAutocomplete: (props) => <FormAddressInput {...props} />
  // 'address': FormAddressInput,
  // 'timezone': FormTimezone,
  // 'phone': FormPhoneNumber,
  // 'textarea': FormTextArea,
  // 'select': SearchableSelect,
  // 'multiselect': MultiSelect,
};

const CreateButton = ({ model, loading, ...props }: SubmitButtonProps) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button
        {...props}
        disabled={loading}
        {...(loading ? { loading: true } : {})}
      >
        Create {model}
      </Button>
    </div>
  );
};

const UpdateButton = ({ model, loading, ...props }: SubmitButtonProps) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button
        {...props}
        disabled={loading}
        // Only pass loading prop if it's true
        {...(loading ? { loading: true } : {})}
      >
        Update {model}
      </Button>
    </div>
  );
};

const submitButtonMap: MapSubmitTypeToButton = {
  create: CreateButton,
  update: UpdateButton
};

export const zenstackUIConfig: ZenstackUIConfigType = {
  hooks: hooks,
  schemas: schemas,
  metadata: modifiedMetadata,
  elementMap: mapFieldTypeToElement,
  submitButtons: submitButtonMap,
  enumLabelTransformer: (label: string) => label.replace(/_/g, ' '),
  queryClient
};
