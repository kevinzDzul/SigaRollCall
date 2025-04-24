import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '@siga/constants/Roles';
import { loginService } from '@siga/mock/services/authServiceMock';
//import { login } from '@siga/api/authService';

type LoginType = {
  user: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: (role: LoginType) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  role?: UserRole | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | undefined | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const value = await AsyncStorage.getItem('isLoggedIn');
      const storedRole = await AsyncStorage.getItem('userRole');
      setIsLoggedIn(value === 'true');
      setRole(storedRole as UserRole);
      setIsLoading(false);
    };
    loadAuth();
  }, []);

  const loginAuth = async ({ user, password }: LoginType) => {
    setIsLoading(true);
    try {
      const { profile, success, error } = await loginService({ usuario: user, password });
      if (error || !success || !profile) { throw new Error(error); }

      await AsyncStorage.setItem('isLoggedIn', `${success}`);
      await AsyncStorage.setItem('userRole', `${profile}`);
      setRole(profile as UserRole);
      setIsLoggedIn(true);
    } catch (e) {
      setRole(undefined);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'userRole']);
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login: loginAuth, logout, isLoading, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
