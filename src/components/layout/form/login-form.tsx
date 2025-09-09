'use client';
import { useTranslations } from 'next-intl';
import { FormField } from './form-field';
import { loginSchema } from './schemas/login-schema';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';
import { useLogout } from '@/hooks/use-logout';
import { getAuthErrorInfo } from '@/lib/error-handlers/error-message';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const t = useTranslations('Login');
  const te = useTranslations('ValidationErrors');
  const { handleLogoutSync } = useLogout();
  const schema = loginSchema(te);
  const { login } = useAuth();

  const {
    form: {
      control,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      trigger,
    },
    setAuthError,
    clearAuthError,
    toastSuccess,
    toastError,
    router,
  } = useAuthForm<LoginFormData>({
    schema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');
      await login(data.email, data.password);

      toastSuccess(t('success'), {
        action: {
          label: t('logout-btn'),
          onClick: () => handleLogoutSync(),
        },
      });

      router.push('/');
    } catch (error) {
      const authErrorInfo = getAuthErrorInfo(error);
      if (
        authErrorInfo.isInvalidCredentials ||
        /auth\/invalid-credential/.test(authErrorInfo.message)
      )
        toastError(t('no-user'));
      else
        toastError(`${t('error')} ${authErrorInfo.message}`, {
          action: {
            label: t('retry-btn'),
            onClick: () => {
              handleSubmit(onSubmit)();
            },
          },
        });
      setAuthError('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormField
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="email@example.com"
        errors={errors.email}
        onFieldChange={clearAuthError}
        trigger={trigger}
      />

      <FormField
        name="password"
        control={control}
        label={t('password')}
        type="password"
        placeholder={t('placeholder')}
        errors={errors.password}
        onFieldChange={clearAuthError}
        trigger={trigger}
      />

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
