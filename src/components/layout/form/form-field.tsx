'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

import {
  Controller,
  FieldError,
  Control,
  UseFormTrigger,
  Path,
  FieldValues,
} from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  errors?: FieldError;
  onFieldChange?: () => void;
  trigger: UseFormTrigger<T>;
}

export const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder = '',
  errors,
  onFieldChange,
  trigger,
}: FormFieldProps<T>) => {
  return (
    <div className="grid gap-3">
      <Label htmlFor={name as string} className="text-base">
        {label}
      </Label>

      {type === 'password' && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              id={name}
              placeholder={placeholder}
              onChange={(e) => {
                field.onChange(e);
                trigger(name);
                onFieldChange?.();
              }}
              onBlur={() => trigger(name)}
            />
          )}
        />
      )}
      {type !== 'password' && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type={type}
              id={name as string}
              placeholder={placeholder}
              onChange={(e) => {
                field.onChange(e);
                trigger(name);
                onFieldChange?.();
              }}
              onBlur={() => trigger(name)}
            />
          )}
        />
      )}

      {errors && (
        <span className="text-red-600 text-left">{errors.message}</span>
      )}
    </div>
  );
};
