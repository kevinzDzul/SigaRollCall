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
  users: Employee[];
  message?: string;
}

function mapRawToEmployee(raw: RawEmployee): Employee {
  return {
    id: raw.id_empleado,
    username: raw.usuario,
    firstName: raw.nombre_empleado,
    lastName: raw.a_paterno,
    middleName: raw.a_materno,
  };
}

export const searchUsersService = async (
  params: SearchUsersParams
): Promise<SearchUsersResponse> => {
  const response = await api.get<SearchUsersResponse, any, SearchUsersParams>(
    '/search_user.php',
    { params }
  );

  return {
    ...response.data,
    users: mapRawToEmployee(response.data.data),
  };
};
