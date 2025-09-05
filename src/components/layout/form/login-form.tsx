'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { loginSchema } from './schemas/login-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { toastError, toastSuccess } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { getAuthErrorInfo } from '@/lib/error-handlers/error-message';

export const LoginForm = () => {
  const t = useTranslations('Login');
  const te = useTranslations('ValidationErrors');
  const schema = loginSchema(te);
  const { login } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string>('');

  type LoginFormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');

      const token = await login(data.email, data.password);
      toastSuccess('You have successfully logged in.', {
        action: {
          label: 'LOG OUT',
          onClick: () => {
            console.log('Logout clicked');
          },
        },
      });

      console.log('Auth successful. Token:', token);

      router.push('/');
    } catch (error) {
      const authErrorInfo = getAuthErrorInfo(error);
      if (authErrorInfo.isInvalidCredentials)
        toastError('No user exist with such parameters');
      else
        toastError(
          `An error occurred while logging in. Error: ${authErrorInfo.message}`,
          {
            action: {
              label: 'RETRY',
              onClick: () => {
                console.log('Retry clicked');
                handleSubmit(onSubmit)();
              },
            },
          }
        );

      console.error('Auth error:', error);
      setAuthError('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {authError && <div className="text-red-600 text-center">{authError}</div>}

      <div className="grid gap-3">
        <Label htmlFor="email" className="text-base">
          Email
        </Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              id="email"
              placeholder="email@example.com"
              onChange={(e) => {
                field.onChange(e);
                trigger('email');
                setAuthError('');
              }}
              onBlur={() => trigger('email')}
            />
          )}
        />
        {errors.email && (
          <span className="text-red-600 text-left">{errors.email.message}</span>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="password" className="text-base">
          Password
        </Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              id="password"
              placeholder={t('placeholder')}
              onChange={(e) => {
                field.onChange(e);
                trigger('password');
                setAuthError('');
              }}
              onBlur={() => trigger('password')}
            />
          )}
        />
        {errors.password && (
          <span className="text-red-600 text-left">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="bg-black disabled:bg-gray-300"
      >
        {t('btn')}
      </Button>
    </form>
  );
};
