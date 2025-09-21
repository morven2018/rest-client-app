import { useAuth } from '@/context/auth/auth-context';

export const useTokenValidity = () => {
  const { authToken } = useAuth();

  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const expirationTime = decodedPayload.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  };

  return {
    isTokenValid: isTokenValid(authToken),
    hasToken: !!authToken,
  };
};
