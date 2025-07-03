// hooks/useValidateGeolocation.ts
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import Geolocation, {
  GeolocationError,
  GeolocationOptions,
} from '@react-native-community/geolocation';
import { useLocation } from '@siga/hooks/useLocation';
import { useToastTop } from '@siga/context/toastProvider';

export function useValidateGeolocation() {
  const [loading, setLoading] = useState(false);
  const { checkAndRequestPermission } = useLocation();
  const showToast = useToastTop();

  const validateGeolocation = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // 1) Pedir permiso de ubicación
      const hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        showToast('Permiso de ubicación denegado', 'warning');
        return false;
      }

      // 2) En Android, intentar obtener posición para ver si el GPS está activo
      if (Platform.OS === 'android') {
        let isEnabled = true;
        await new Promise<void>((resolve) => {
          const options: GeolocationOptions = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 1000,
          };

          Geolocation.getCurrentPosition(
            () => {
              // GPS activo
              resolve();
            },
            (error: GeolocationError) => {
              if (error.code === 2) {
                // POSITION_UNAVAILABLE → GPS apagado
                showToast(
                  'Ubicación desactivada. Por favor actívala en Ajustes.',
                  'error'
                );
                isEnabled = false;
              }
              resolve();
            },
            options
          );
        });
        return isEnabled;
      }

      // 3) En iOS (o en cualquier otro caso), asumimos que basta con el permiso
      return true;
    } finally {
      setLoading(false);
    }
  }, [checkAndRequestPermission, showToast]);

  return { validateGeolocation, loading };
}
