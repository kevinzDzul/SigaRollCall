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

export interface ValidateFaceRequest {
  // TODO - ajustar a camel case
  face_token: string;
  lat?: number | null;
  lng?: number | null;
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
