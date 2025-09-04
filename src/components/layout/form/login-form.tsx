'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { loginSchema } from './schemas/login-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

export const LoginForm = () => {
  const t = useTranslations('Login');
  const te = useTranslations('ValidationErrors');
  const schema = loginSchema(te);

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

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email">Email</Label>
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
              }}
              onBlur={() => trigger('email')}
            />
          )}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className="form-group flex flex-col gap-6">
        <Label htmlFor="password">Password</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              id="password"
              autoComplete="new-password"
              placeholder={t('placeholder')}
              onChange={(e) => {
                field.onChange(e);
                trigger('password');
              }}
              onBlur={() => trigger('password')}
            />
          )}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <Button type="submit" disabled={isSubmitting || !isValid}>
        {t('btn')}
      </Button>
    </form>
  );
};
