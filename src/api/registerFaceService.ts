import api from './axiosInstance';

export type TypeArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array;

export interface RegisterFaceRequest {
  id: string;
  vector: string | undefined;
}

export interface RegisterFaceResponse {
  success: boolean;
  error: string | undefined;
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
