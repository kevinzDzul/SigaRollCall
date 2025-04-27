import api from './axiosInstance';

export interface SearchUsersParams {
  query: string;
}

interface RawEmployee {
  id_empleado: string;
  usuario: string;
  nombre_empleado: string;
  a_paterno: string;
  a_materno: string;
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
    id: item.id_empleado, // TODO - convertir a camel case
    username: item.usuario,
    firstName: item.nombre_empleado,
    lastName: item.a_paterno,
    middleName: item.a_materno,
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
