'use client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { auth, db } from '@/firebase/config';
import { convertFileToBase64 } from '@/lib/converter';

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
  const [userRegistrationDate, setUserRegistrationDate] = useState<Date | null>(
    null
  );

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
    async (
      email: string,
      password: string,
      username?: string,
      avatarFile?: File
    ): Promise<{ token: string; avatarUrl?: string }> => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;
      const registrationDate = new Date();

      if (avatarFile) {
        const avatarBase64 = await convertFileToBase64(avatarFile);

        await setDoc(doc(db, 'userAvatars', userId), {
          avatar: avatarBase64,
          createdAt: new Date(),
          fileName: avatarFile.name,
          fileType: avatarFile.type,
        });

        await getDoc(doc(db, 'userAvatars', userId));
      }

      await setDoc(doc(db, 'userMetadata', userId), {
        registrationDate,
        displayName: username || `User_${userId.slice(-5)}`,
      });

      await updateProfile(userCredential.user, {
        displayName: username || `User_${userId.slice(-5)}`,
      });

      setUserRegistrationDate(registrationDate);

      const token = await userCredential.user.getIdToken();
      saveToken(token);

      return { token };
    },
    []
  );

  const getAvatar = useCallback(async (userId: string): Promise<string> => {
    try {
      const docRef = doc(db, 'userAvatars', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().avatar;
      }
      return '';
    } catch {
      return '';
    }
  }, []);

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

  const getTimeSinceSignUp = useCallback((): number => {
    if (!userRegistrationDate) return 0;
    const now = new Date();
    return now.getTime() - userRegistrationDate.getTime();
  }, [userRegistrationDate]);

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
      getAvatar,
      logout,
      resetPassword,
      loading,
      isTokenValid,
      getTimeSinceSignUp,
    }),
    [
      currentUser,
      authToken,
      loading,
      login,
      logout,
      register,
      getAvatar,
      resetPassword,
      isTokenValid,
      getTimeSinceSignUp,
    ]
  );
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
