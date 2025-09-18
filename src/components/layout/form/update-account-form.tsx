'use client';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { FormField } from './form-field';
import { updateAccountSchema } from './schemas/update-schema';
import { AvatarInput } from '@/components/ui/avatar-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toastError } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';
import { useRouter } from '@/i18n/navigation';

interface UpdateAccountFormProps {
  onSuccess?: () => void;
}

export const UpdateAccountForm = ({ onSuccess }: UpdateAccountFormProps) => {
  const t = useTranslations('update');
  const te = useTranslations('ValidationErrors');
  const schema = updateAccountSchema(te);
  const { currentUser, updateProfile } = useAuth();
  const router = useRouter();

  const {
    form: {
      control,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      trigger,
    },
  } = useAuthForm<{ username?: string; avatar?: File }>({
    schema,
    redirectOnAuth: false,
    defaultValues: {
      username: currentUser?.displayName || '',
      avatar: undefined,
    },
  });

  const onSubmit = async (data: { username?: string; avatar?: File }) => {
    try {
      await updateProfile(data.username, data.avatar);
      onSuccess?.();
      router.push('/');
    } catch (err) {
      toastError(JSON.stringify(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormField
        name="username"
        control={control}
        label={t('name')}
        type="text"
        placeholder={t('name-placeholder')}
        errors={errors.username}
        trigger={trigger}
      />

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
