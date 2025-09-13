import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';

export const useLogout = () => {
  const { logout } = useAuth();
  const t = useTranslations('logout');
  const router = useRouter();
  const { toastError, toastSuccess } = useToast();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toastSuccess(t('success'));
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toastError(`${'error-with-msg'} ${error.message}`, {
          action: {
            label: t('btn'),
            onClick: () => handleLogoutSync(),
          },
        });
      } else {
        toastError(t('error-no-msg'), {
          action: {
            label: t('btn'),
            onClick: () => handleLogoutSync(),
          },
        });
      }
    }
  });

  const handleLogoutSync = useCallback((): void => {
    handleLogout().catch((error) => {
      console.error('Logout error:', error);
    });
  }, [handleLogout]);

  return {
    handleLogout,
    handleLogoutSync,
  };
};
