import { LoginRequest, LoginResponse } from '@siga/api/authService';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  if (data.usuario === 'admin' && data.password === '1234') {
    return {
      success: true,
      username: 'admin',
      profile: 'admin',
      error: undefined,
    };
  }

  return {
    success: false,
    username: undefined,
    profile: undefined,
    error: 'Credenciales inválidas',
  };
};
