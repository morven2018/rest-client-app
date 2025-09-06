'use client';
import { User } from 'firebase/auth';
import { createContext, useContext } from 'react';

export interface RegisterResult {
  token: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  authToken: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (
    email: string,
    password: string,
    username?: string,
    avatarFile?: File
  ) => Promise<{ token: string; avatarUrl?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  uploadAvatar: (file: File, userId: string) => Promise<string>;
  deleteAvatar: (avatarUrl: string) => Promise<void>;
  loading: boolean;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
