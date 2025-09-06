'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { auth, storage } from '@/firebase/config';

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

  const uploadAvatar = useCallback(
    async (file: File, userId: string): Promise<string> => {
      try {
        const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
      }
    },
    []
  );

  const deleteAvatar = useCallback(async (avatarUrl: string): Promise<void> => {
    try {
      const storageRef = ref(storage, avatarUrl);

      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      throw error;
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      username?: string,
      avatarFile?: File
    ): Promise<{ token: string; avatarUrl?: string }> => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        let avatarUrl: string | undefined;

        if (avatarFile && userCredential.user) {
          avatarUrl = await uploadAvatar(avatarFile, userCredential.user.uid);
        }

        await updateProfile(userCredential.user, {
          displayName: username,
          photoURL: avatarUrl,
        });

        const token = await userCredential.user.getIdToken();
        saveToken(token);

        return { token, avatarUrl };
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    [uploadAvatar]
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
      uploadAvatar,
      deleteAvatar,
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
      uploadAvatar,
      deleteAvatar,
      isTokenValid,
    ]
  );
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
