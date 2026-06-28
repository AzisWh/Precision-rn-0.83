import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../features/login/type/auth';

type AuthState = {
  token: string | null;
  isPinVerified: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
};

type AuthContextType = {
  auth: AuthState;
  setToken: (token: string) => void;
  setPinVerified: () => void;
  setRole: (role: UserRole) => void;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    isPinVerified: false,
    role: null,
    profile: null,
  });

  const setToken = (token: string) => setAuth(prev => ({ ...prev, token }));
  const setPinVerified = () =>
    setAuth(prev => ({ ...prev, isPinVerified: true }));
  const setRole = (role: UserRole) => setAuth(prev => ({ ...prev, role }));
  const setProfile = (profile: UserProfile) =>
    setAuth(prev => ({ ...prev, profile }));
  const logout = () =>
    setAuth({ token: null, isPinVerified: false, role: null, profile: null });

  return (
    <AuthContext.Provider
      value={{ auth, setToken, setPinVerified, setRole, setProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
