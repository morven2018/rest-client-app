import { FieldValues, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { useRouter } from '@/i18n/navigation';

export interface LoginFormData extends FieldValues {
  email: string;
  password: string;
}

export interface RegisterFormData extends FieldValues {
  email: string;
  password: string;
  username?: string;
  avatar?: File;
}

export interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: Partial<T>;
  redirectOnAuth?: boolean;
}

export interface UseAuthFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  authError: string;
  setAuthError: (error: string) => void;
  clearAuthError: () => void;
  toastError: (
    message: string,
    options?: { action?: { label: string; onClick: () => void } }
  ) => void;
  toastSuccess: (
    message: string,
    options?: { action?: { label: string; onClick: () => void } }
  ) => void;
  router: ReturnType<typeof useRouter>;
}
