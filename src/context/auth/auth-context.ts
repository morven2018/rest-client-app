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
  getAvatar: (userId: string) => Promise<string | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  getTimeSinceSignUp: () => number;
  isTokenValid: (token: string) => boolean;
  updateProfile: (username?: string, avatarFile?: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
