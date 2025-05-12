import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '@siga/constants/Roles';
import { loginService } from '@siga/api/authService';
import { reportError } from '@siga/util/reportError';
import { useToastTop } from './toastProvider';

type LoginType = {
  user: string;
  password: string;
};

type UserType = {
  idEmpleado?: number;
  success?: boolean;
  username?: string;
  profile?: UserRole;
  message?: string;
}

type AuthContextType = {
  isLoggedIn: boolean;
  login: ({ user, password }: LoginType) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  user?: UserType;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
  user: undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = useToastTop();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myUser, setMyUser] = useState<UserType>();

  useEffect(() => {
    const loadAuth = async () => {
      const currentUser = await AsyncStorage.getItem('user');
      const value = await AsyncStorage.getItem('isLoggedIn');

      if (currentUser != null) {
        setIsLoggedIn(value === 'true');

        const parseUser = JSON.parse(currentUser);
        setMyUser({
          idEmpleado: parseUser?.idEmpleado,
          success: parseUser?.success,
          username: parseUser?.username,
          profile: parseUser?.profile as UserRole,
          message: parseUser?.message,
        });
      }



      setIsLoading(false);
    };
    loadAuth();
  }, []);

  const loginAuth = async ({ user, password }: LoginType) => {
    setIsLoading(true);
    try {
      const currentUser = await loginService({ usuario: user, password });
      if (!currentUser?.success || !currentUser?.profile) { throw new Error(currentUser?.message); }

      await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      await AsyncStorage.setItem('isLoggedIn', `${currentUser?.success}`);

      setMyUser({
        idEmpleado: currentUser?.idEmpleado,
        success: currentUser?.success,
        username: currentUser?.username,
        profile: currentUser?.profile as UserRole,
        message: currentUser?.message,
      });

      setIsLoggedIn(true);
    } catch (error: any) {
      reportError(error);
      setMyUser(undefined);
      setIsLoggedIn(false);
      showToast(error.response?.data?.message ?? error?.message ?? 'Error desconocido', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'user']);
    setIsLoggedIn(false);
    setMyUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login: loginAuth, logout, isLoading, user: myUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
