import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCaptureStore } from '@siga/store/capture';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { CoordsProps, useLocation } from '@siga/hooks/useLocation';
import { registerFaceService } from '@siga/api/registerFaceService';
import { validateFaceService } from '@siga/api/validateFaceService';
import { reportError } from '@siga/util/reportError';
import { fetchImageToB64 } from '@siga/util/fileToBase64';
import { useAuth } from '@siga/context/authProvider';
import { useUnmountBrightness } from '@reeq/react-native-device-brightness';

export type RootStackParamList = {
    CaptureScreen: {
        id?: string | undefined,
        mode: 'register' | 'validate'
    }
}

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'CaptureScreen'>

export default function CaptureScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const route = useRoute<CaptureScreenRouteProp>();
    const showToast = useToastTop();
    const { goBack } = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { setResult, clearResult } = useCaptureStore((state) => state);
    const { getLocation } = useLocation();

    useUnmountBrightness(1);

    const validateUserFace = async (originalPath: string, coords: CoordsProps) => {
        const base64 = await fetchImageToB64(`file://${originalPath}`);
        const { message, success } = await validateFaceService({
            empleadoIdLogged: user?.idEmpleado,
            lat: coords?.latitude,
            lng: coords?.longitude,
            photo: base64,
        });
        setResult(success, message);
    };

    const registerUserFace = async (originalPath: string, id: string) => {
        const base64 = await fetchImageToB64(`file://${originalPath}`);
        const { message, success } = await registerFaceService({
            empleadoIdLogged: user?.idEmpleado,
            photo: base64,
            idEmpleado: id,
        });
        setResult(success, message);
    };

    const handleCapture = async (originalPath: string) => {
        setIsLoading(true);
        try {
            const mode = route?.params?.mode;
            const id = route?.params?.id;

            const location = await getLocation();

            if (!location) {
                showToast('🔥 Se requieren permisos de localización');
                return;
            }

            if (!mode) {
                return;
            }

            if (mode === 'register' && !id) {
                showToast('🔥 Se requiere identificador del usuario, Intenta nuevamente');
                return;
            }

            if (mode === 'register' && id) {
                await registerUserFace(originalPath, id);
            } else if (mode === 'validate') {
                await validateUserFace(originalPath, location);
            } else {
                showToast(`🔥 Modo desconocido: ${mode} o undefined`);
            }
        } catch (error: any) {
            reportError(error);
            showToast(error.response?.data?.message ?? error?.message ?? 'Error desconocido');
            clearResult();
        } finally {
            setIsLoading(false);
            goBack();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header mode={isLoading ? undefined : 'back'} />
            </View>
            {isLoading ?
                <View style={styles.containerLoading}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
                : null}
            {!isLoading ?
                <CameraView
                    position={'front'}
                    onCapture={handleCapture}
                    showCircleFace
                /> : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
    },
    containerHeader: {
        position: 'absolute',
        width: '100%',
        zIndex: 200,
    },
});
