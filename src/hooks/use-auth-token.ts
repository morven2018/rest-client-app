import { useAuth } from '@/context/auth/auth-context';

export const useAuthToken = () => {
  const { authToken, currentUser } = useAuth();

  const getAuthHeader = () => {
    if (!authToken) return {};

    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  };

  const refreshToken = async (): Promise<string | null> => {
    if (!currentUser) return null;

    try {
      const token = await currentUser.getIdToken(true);
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  return {
    authToken,
    getAuthHeader,
    refreshToken,
  };
};
