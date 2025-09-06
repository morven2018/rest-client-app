'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { registerSchema } from './schemas/register-schema';
import { AvatarInput } from '@/components/ui/avatar-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth } from '@/context/auth/auth-context';

export const RegisterForm = () => {
  const t = useTranslations('Register');
  const te = useTranslations('ValidationErrors');
  const schema = registerSchema(te);
  const { register, authToken, currentUser } = useAuth();

  type RegisterFormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      avatar: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log(JSON.stringify(data));
      const result = await register(
        data.email,
        data.password,
        data.username,
        data.avatar
      );
      console.log('success!', result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
          {t('password')}
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

      <div className="grid gap-3">
        <Label htmlFor="username" className="text-base">
          {t('name')}
        </Label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              id="username"
              placeholder={t('name-placeholder')}
              onChange={(e) => {
                field.onChange(e);
                trigger('username');
              }}
              onBlur={() => trigger('username')}
            />
          )}
        />
        {errors.username && (
          <span className="text-red-600 text-left">
            {errors.username.message}
          </span>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="avatar" className="text-base">
          {t('avatar')}
        </Label>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <AvatarInput
              onAvatarChange={(file) => {
                field.onChange(file);
                trigger('avatar');
              }}
              placeholder={t('avatar-placeholder')}
            />
          )}
        />
        {errors.avatar && (
          <span className="text-red-600 text-left">
            {errors.avatar.message}
          </span>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="bg-black disabled:bg-gray-300 dark:text-white"
      >
        {t('btn')}
      </Button>
    </form>
  );
};
