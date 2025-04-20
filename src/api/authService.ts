import api from "./axiosInstance";

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  username: string | undefined;
  profile: string | undefined;
  error: string | undefined;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse, any, LoginRequest>(
    "/login.php",
    data
  );
  return response.data;
};
