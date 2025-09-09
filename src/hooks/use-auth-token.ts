import { useAuth } from '@/context/auth/auth-context';

export const useAuthToken = () => {
  const { authToken } = useAuth();

  const getAuthHeader = () => {
    if (!authToken) return {};

    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  };

  const hasValidToken = (): boolean => {
    return !!authToken;
  };

  return {
    authToken,
    getAuthHeader,
    hasValidToken,
  };
};
