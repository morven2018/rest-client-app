'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth/auth-context';
import { useRouter } from '@/i18n/navigation';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();
  const isAuthenticated = authToken && currentUser;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
