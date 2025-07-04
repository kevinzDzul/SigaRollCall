import { Camera } from 'react-native-vision-camera';
import { useLocation } from './useLocation';
import { useToastTop } from '@siga/context/toastProvider';

export const useAppPermissions = () => {
    const { checkAndRequestPermission: checkAndRequestLocationPermission } = useLocation();
    const showToast = useToastTop();

    const requestRequiredPermissions = async (): Promise<boolean> => {
        // Solicitar permiso de cámara
        const cameraPermission = await Camera.requestCameraPermission();
        if (cameraPermission !== 'granted') {
            showToast('El permiso de la cámara es necesario');
            return false;
        }

        // Solicitar permiso de ubicación
        const locationPermission = await checkAndRequestLocationPermission();
        if (!locationPermission) {
            // El hook useLocation ya muestra un toast en caso de error
            return false;
        }

        return true;
    };

    return { requestRequiredPermissions };
}; 