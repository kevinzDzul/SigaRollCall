import { ValidateFaceRequest, ValidateFaceResponse } from '@siga/api/validateFaceService';

export async function validateFaceService(
  data: ValidateFaceRequest
): Promise<ValidateFaceResponse> {
  console.debug('[Mock] register face called with:', data);

  await new Promise((res: any) => setTimeout(res, 300));

  return {
    success: true,
    error: undefined,
  };
}
