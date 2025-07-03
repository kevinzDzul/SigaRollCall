import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type CoordsProps = {
    latitude: number;
    longitude: number;
}

export const useLocation = () => {

    const checkAndRequestPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
            return isGranted;
        }
        // iOS asumimos que Info.plist ya está configurado
        return true;
    };

    const getLocation = async (): Promise<CoordsProps | undefined> => {
        const hasPermission = await checkAndRequestPermission();
        if (!hasPermission) { return undefined; }

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                error => {
                    console.warn(error.message);
                    reject(undefined);
                },
                { enableHighAccuracy: false, timeout: 25000, maximumAge: 10000 }
            );
        });
    };

    return {
        getLocation,
        checkAndRequestPermission,
    };
};
