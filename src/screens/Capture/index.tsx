import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCaptureStore } from '@siga/store/capture';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { CoordsProps, useLocation } from '@siga/hooks/useLocation';
import { registerFaceService, TypeArray } from '@siga/api/registerFaceService';
import { validateFaceService } from '@siga/api/validateFaceService';
import { reportError } from '@siga/util/reportError';
import { fetchImageToB64 } from '@siga/util/fileToBase64';
import { useAuth } from '@siga/context/authProvider';
import { CameraPosition } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@siga/components/SwitchCamera';

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
    const [cameraType, setCameraType] = useState<CameraPosition>('front');

    useEffect(() => {
        // Cargar el valor guardado al iniciar
        const loadSwitchValue = async () => {
            try {
                const savedValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedValue !== null) {
                    setCameraType(savedValue === 'true' ? 'back' : 'front');
                }
            } catch (e) {
                console.error('Error loading switch value:', e);
            }
        };
        loadSwitchValue();
    }, []);

    const setResult = useCaptureStore((state) => state.setResult);
    const clearResult = useCaptureStore((state) => state.clearResult);
    const { getLocation } = useLocation();

    const validateUserFace = async (vector: TypeArray, coords: CoordsProps) => {
        const vectorRequest: number[] = Object.values(vector);
        const { message, success } = await validateFaceService({
            empleadoIdLogged: user?.idEmpleado,
            lat: coords?.latitude,
            lng: coords?.longitude,
            faceToken: JSON.stringify(vectorRequest),
        });
        setResult(success, message);
    };

    const registerUserFace = async (originalPath: string, vector: TypeArray, id: string) => {
        const vectorRequest: number[] = Object.values(vector);
        const base64 = await fetchImageToB64(`file://${originalPath}`);
        const { message, success } = await registerFaceService({
            empleadoIdLogged: user?.idEmpleado,
            photo: base64,
            idEmpleado: id,
            vectorFace: JSON.stringify(vectorRequest),
        });
        setResult(success, message);
    };

    const handleCapture = async (originalPath: string, vector: TypeArray) => {
        const mode = route?.params?.mode;
        const id = route?.params?.id;
        setIsLoading(true);

        const location = await getLocation();

        if (!location) {
            showToast('Se requieren permisos de localización');
            return;
        }

        if (!mode) {
            showToast('Modo no especificado');
            return;
        }

        if (mode === 'register' && !id) {
            showToast('Se requiere identificador');
            return;
        }

        try {
            if (mode === 'register' && id) {
                await registerUserFace(originalPath, vector, id);
            } else if (mode === 'validate') {
                await validateUserFace(vector, location);
            } else {
                showToast(`Modo desconocido: ${mode} o undefined`);
            }
        } catch (error: any) {
            reportError(error);
            showToast(error.response?.data?.message ?? error?.message ?? 'Error desconocido');
            clearResult();
        } finally {
            setIsLoading(false);
            goBack();/// TODO -  hay un warning, resolverlo, deberia hacer un navigate.
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
                    position={cameraType}
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
