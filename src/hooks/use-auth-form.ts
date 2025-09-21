'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodType } from 'zod';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';

import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';

interface UseAuthFormOptions<T extends FieldValues> {
  schema: ZodType<T>;
  redirectOnAuth?: boolean;
  defaultValues?: DefaultValues<T>;
}

interface UseAuthFormReturn<T extends FieldValues> {
  form: Omit<UseFormReturn<T>, 'handleSubmit'> & {
    handleSubmit: (
      onSubmit: (data: T) => void
    ) => (e?: React.BaseSyntheticEvent) => void;
  };
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

export const useAuthForm = <T extends FieldValues>({
  schema,
  redirectOnAuth = true,
  defaultValues,
}: UseAuthFormOptions<T>): UseAuthFormReturn<T> => {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string>('');
  const { toastError, toastSuccess } = useToast();

  useEffect(() => {
    if (redirectOnAuth && authToken && currentUser) {
      router.push('/');
    }
  }, [authToken, currentUser, router, redirectOnAuth]);

  const form = useForm<T>({
    resolver: zodResolver(schema as never),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const clearAuthError = () => setAuthError('');

  const customHandleSubmit = (onSubmit: (data: T) => void) => {
    return form.handleSubmit(onSubmit);
  };

  return {
    form: {
      ...form,
      handleSubmit: customHandleSubmit,
    },
    authError,
    setAuthError,
    clearAuthError,
    toastError,
    toastSuccess,
    router,
  };
};
