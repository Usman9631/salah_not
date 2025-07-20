import React, { createContext, useState, useContext } from 'react';

type UserType = {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  favourites?: string[]; // Array of masjid IDs
  verified?: boolean;
  role?: string;
  paymentMethods?: any[];
};

type AuthContextType = {
  isLoggedIn: boolean;
  hasAccount: boolean;
  user: UserType | null;
  login: (userData: UserType) => void; // userData pass hoga
  logout: () => void;
  completeSignup: () => void;
  startSignup: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  const login = (userData: UserType) => {
    setIsLoggedIn(true);
    setHasAccount(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setHasAccount(true);
    setUser(null);
  };

  const completeSignup = () => {
    setHasAccount(true);
    setIsLoggedIn(false);
    setUser(null);
  };

  const startSignup = () => {
    setIsLoggedIn(false);
    setHasAccount(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, hasAccount, user, login, logout, completeSignup, startSignup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
