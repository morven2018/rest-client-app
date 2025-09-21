'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth/auth-context';
import { useRouter } from '@/i18n/navigation';

interface FormWrapperProps {
  children: React.ReactNode;
  requireUnauth?: boolean;
}

export const FormWrapper = ({
  children,
  requireUnauth = true,
}: FormWrapperProps) => {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();
  const isAuthenticated = authToken && currentUser;

  useEffect(() => {
    if (requireUnauth && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router, requireUnauth]);

  if (requireUnauth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
