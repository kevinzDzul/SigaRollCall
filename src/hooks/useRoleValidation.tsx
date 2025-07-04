import { UserRole } from '@siga/constants/Roles';
import { useAuth } from '@siga/context/authProvider';

export const useRoleValidation = () => {
    const { user } = useAuth();

    const canAccess = (requiredRoles: UserRole | UserRole[]) => {
        if (!user?.profile) { return false; }
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(user?.profile);
        }
        return user?.profile === requiredRoles;
    };

    return { canAccess };
};
