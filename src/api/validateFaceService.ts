import api from './axiosInstance';
export interface ValidateFaceRequest {
  photo: string;
  lat?: number | null;
  lng?: number | null;
  empleadoIdLogged?: number;
}

export interface ValidateFaceResponse {
  success: boolean;
  message: string;
  data: number[];
}

export const validateFaceService = async (
  data: ValidateFaceRequest
): Promise<ValidateFaceResponse> => {
  const response = await api.post<
    ValidateFaceResponse,
    any,
    ValidateFaceRequest
  >('/check_user_assistance.php', data);

  return response.data;
};
