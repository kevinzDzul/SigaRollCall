import api from './axiosInstance';

export interface SearchUsersParams {
  query: string;
}

interface RawEmployee {
  idEmpleado: string;
  usuario: string;
  nombreEmpleado: string;
  aPaterno: string;
  aMaterno: string;
}

export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface SearchUsersResponse {
  success: boolean;
  data: Employee[];
  message?: string;
}

function mapRawToEmployee(raw: RawEmployee[]): Employee[] {
  return raw.map((item) => ({
    id: item.idEmpleado,
    username: item.usuario,
    firstName: item.nombreEmpleado,
    lastName: item.aPaterno,
    middleName: item.aMaterno,
  }));
}

export const searchUsersService = async (
  params: SearchUsersParams
): Promise<SearchUsersResponse> => {
  const response = await api.get<SearchUsersResponse, any, SearchUsersParams>(
    '/search_user.php',
    { params: { ...params } }
  );

  return {
    ...response.data,
    data: mapRawToEmployee(response.data.data),
  };
};
