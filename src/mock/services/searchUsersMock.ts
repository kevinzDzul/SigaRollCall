import {
  Employee,
  SearchUsersParams,
  SearchUsersResponse,
} from '@siga/api/searchUsersService';

interface RawEmployee {
  id_empleado: string;
  usuario: string;
  nombre_empleado: string;
  a_paterno: string;
  a_materno: string;
}

const mockRawEmployees: RawEmployee[] = [
  {
    id_empleado: '1',
    usuario: 'juan123',
    nombre_empleado: 'Juan',
    a_paterno: 'Pérez',
    a_materno: 'Gómez',
  },
  {
    id_empleado: '2',
    usuario: 'maria456',
    nombre_empleado: 'María',
    a_paterno: 'López',
    a_materno: 'Ramírez',
  },
];

function mapRawToEmployee(raw: RawEmployee): Employee {
  return {
    id: raw.id_empleado,
    username: raw.usuario,
    firstName: raw.nombre_empleado,
    lastName: raw.a_paterno,
    middleName: raw.a_materno,
  };
}
export async function searchUsersService(
  params: SearchUsersParams
): Promise<SearchUsersResponse> {
  console.debug('[Mock] searchUsers called with:', params);

  await new Promise((res: any) => setTimeout(res, 300));

  const data: Employee[] = mockRawEmployees.map(mapRawToEmployee);

  return {
    success: true,
    data,
    message: 'Mock: usuarios encontrados correctamente',
  };
}
