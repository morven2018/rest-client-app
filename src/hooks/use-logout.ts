import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';

export const useLogout = () => {
  const { logout } = useAuth();
  const t = useTranslations('logout');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toastSuccess(t('success'));
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toastError(`${'error-with-msg'} ${error.message}`, {
          action: {
            label: t('btn'),
            onClick: () => handleLogout(),
          },
        });
      } else {
        toastError(t('error-no-msg'), {
          action: {
            label: t('btn'),
            onClick: () => handleLogout(),
          },
        });
      }
    }
  };

  return handleLogout;
};
