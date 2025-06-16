import api from './axiosInstance';

export interface RegisterFaceRequest {
  empleadoIdLogged?: number;
  idEmpleado: string;
  photo: string | undefined;
}

export interface RegisterFaceResponse {
  success: boolean;
  message: string | undefined;
}

export const registerFaceService = async (
  data: RegisterFaceRequest
): Promise<RegisterFaceResponse> => {
  const response = await api.post<
    RegisterFaceResponse,
    any,
    RegisterFaceRequest
  >('/face_vector_storage.php', data);

  return response.data;
};
