'use client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { auth, db } from '@/firebase/config';
import { compressImage } from '@/lib/compressor';
import { convertFileToBase64 } from '@/lib/converter';

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
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
    document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Lax`;
  };

  const removeToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
    document.cookie =
      'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  };
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
      let avatarBase64 = '';

      if (avatarFile) {
        const compressedFile = await compressImage(avatarFile, 200, 200, 0.6);
        avatarBase64 = await convertFileToBase64(compressedFile);

        await setDoc(
          doc(db, 'userAvatars', userId),
          {
            avatar: avatarBase64,
            createdAt: new Date(),
            fileName: compressedFile.name,
            fileType: compressedFile.type,
          },
          { merge: true }
        );
      }

      await setDoc(
        doc(db, 'userMetadata', userId),
        {
          registrationDate,
          displayName: username || `User_${userId.slice(-5)}`,
        },
        { merge: true }
      );

      await updateFirebaseProfile(userCredential.user, {
        displayName: username || `User_${userId.slice(-5)}`,
        photoURL: avatarFile ? `/avatars/${userId}` : undefined,
      });

      setUserRegistrationDate(registrationDate);
      const token = await userCredential.user.getIdToken();
      saveToken(token);

      return { token, avatarUrl: avatarBase64 };
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

      if (userCredential.user) {
        await setDoc(
          doc(db, 'userMetadata', userCredential.user.uid),
          {
            lastLogin: new Date(),
          },
          { merge: true }
        );
      }

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

  const updateProfile = useCallback(
    async (username?: string, avatarFile?: File): Promise<void> => {
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      try {
        const updates: { displayName?: string; photoURL?: string } = {};

        if (username) {
          updates.displayName = username;
          await setDoc(
            doc(db, 'userMetadata', currentUser.uid),
            {
              displayName: username,
            },
            { merge: true }
          );
        }

        if (avatarFile) {
          const compressedFile = await compressImage(avatarFile, 200, 200, 0.6);
          const avatarBase64 = await convertFileToBase64(compressedFile);

          await setDoc(
            doc(db, 'userAvatars', currentUser.uid),
            {
              avatar: avatarBase64,
              updatedAt: new Date(),
              fileName: compressedFile.name,
              fileType: compressedFile.type,
            },
            { merge: true }
          );

          updates.photoURL = `/avatars/${currentUser.uid}`;
        }

        await updateFirebaseProfile(currentUser, updates);

        setCurrentUser({
          ...currentUser,
          ...updates,
        });

        const newToken = await currentUser.getIdToken(true);
        saveToken(newToken);
      } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }
    },
    [currentUser]
  );

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

        try {
          const userDoc = await getDoc(doc(db, 'userMetadata', user.uid));
          if (userDoc.exists()) {
            const registrationDate = userDoc.data().registrationDate?.toDate();
            if (registrationDate) {
              setUserRegistrationDate(registrationDate);
            }
          }
        } catch (error) {
          console.error('Error loading registration date:', error);
        }
      } else {
        removeToken();
        setUserRegistrationDate(null);
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
      updateProfile,
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
      updateProfile,
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
