import { RegisterFaceRequest, RegisterFaceResponse } from '@siga/api/registerFaceService';

export async function registerFaceService(
  data: RegisterFaceRequest
): Promise<RegisterFaceResponse> {
  console.debug('[Mock] register face called with:', data);

  await new Promise((res: any) => setTimeout(res, 300));

  return {
    success: true,
    message: undefined,
  };
}
