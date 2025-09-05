'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { auth } from '@/firebase/config';

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AUTH_TOKEN_KEY = 'authToken';
const CHECK_FREQUENCY = 30000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isTokenValid = useCallback((token: string): boolean => {
    try {
      if (!token) return false;

      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      const expirationTime = decodedPayload.exp * 1000;
      const currentTime = Date.now();

      return expirationTime > currentTime;
    } catch {
      return false;
    }
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAuthToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
  };

  const register = useCallback(
    async (email: string, password: string): Promise<string> => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      saveToken(token);
      return token;
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<string> => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      saveToken(token);
      return token;
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    removeToken();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const forceLogoutIfTokenExpired = useCallback(async () => {
    if (authToken && !isTokenValid(authToken)) {
      await logout();
    }
  }, [authToken, isTokenValid, logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken && isTokenValid(storedToken)) {
      setAuthToken(storedToken);
    } else {
      removeToken();
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const token = await user.getIdToken();
        saveToken(token);
      } else {
        removeToken();
      }

      setLoading(false);
    });

    const tokenCheckInterval = setInterval(() => {
      forceLogoutIfTokenExpired();
    }, CHECK_FREQUENCY);

    return () => {
      unsubscribe();
      clearInterval(tokenCheckInterval);
    };
  }, [authToken, forceLogoutIfTokenExpired, isTokenValid]);

  const value = useMemo(
    () => ({
      currentUser,
      authToken,
      login,
      register,
      logout,
      resetPassword,
      loading,
      isTokenValid,
    }),
    [
      currentUser,
      authToken,
      loading,
      login,
      logout,
      register,
      resetPassword,
      isTokenValid,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
