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
  vector: TypeArray[] | undefined;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ValidateFaceResponse {
  success: boolean;
  error: string | undefined;
}

export const validateFaceService = async (
  data: ValidateFaceRequest
): Promise<ValidateFaceResponse> => {
  const response = await api.post<
  ValidateFaceResponse,
    any,
    ValidateFaceRequest
  >('/validate_face.php', data);

  return response.data;
};
