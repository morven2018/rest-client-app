import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth/auth-context';

export const useAuthCheck = () => {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authToken || !currentUser) {
      router.push('/');
    }
  }, [authToken, currentUser, router]);

  return {
    isAuthenticated: !!authToken && !!currentUser,
    authToken,
    currentUser,
  };
};
