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
  // TODO - manejar camel case
  id_empleado: string;
  vector_face: string | undefined;
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
