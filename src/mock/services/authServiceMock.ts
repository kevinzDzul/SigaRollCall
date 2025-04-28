import { LoginRequest, LoginResponse } from '@siga/api/authService';

export const loginService = async (data: LoginRequest): Promise<LoginResponse> => {
  if (data.usuario === 'admin' && data.password === '1234') {
    return {
      idEmpleado: 1,
      success: true,
      username: 'admin',
      profile: 'admin',
      error: undefined,
    };
  }

  return {
    idEmpleado: 0,
    success: false,
    username: undefined,
    profile: undefined,
    error: 'Credenciales inválidas',
  };
};
