import { UserRole } from '@siga/constants/Roles';
import { usePermissions } from '@siga/hooks/usePermissions';
import React from 'react';

type WithPermissionProps = {
    allowedRoles: UserRole | UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

const WithPermission: React.FC<WithPermissionProps> = ({ allowedRoles, children, fallback = null }) => {
    const { canAccess } = usePermissions();

    return canAccess(allowedRoles) ? <>{children}</> : <>{fallback}</>;
};

export default WithPermission;
