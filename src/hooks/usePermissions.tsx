import { useAuth } from '@siga/context/authProvider';

export const usePermissions = () => {
    const { role } = useAuth();

    const canAccess = (requiredRoles: string | string[]) => {
        if (!role) {return false;}
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(role);
        }
        return role === requiredRoles;
    };

    return { canAccess };
};
