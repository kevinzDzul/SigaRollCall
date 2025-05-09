import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import useEfficientDetModel from '@siga/hooks/useEfficientDetModel';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCaptureStore } from '@siga/store/capture';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { CoordsProps, useLocation } from '@siga/hooks/useLocation';
import { registerFaceService, TypeArray } from '@siga/api/registerFaceService';
import { validateFaceService } from '@siga/api/validateFaceService';
import { reportError } from '@siga/util/reportError';
import { getArrayBufferForBlob } from "react-native-blob-jsi-helper";
import { fetchImageToB64 } from '@siga/util/fileToBase64';

export type RootStackParamList = {
    CaptureScreen: {
        id?: string | undefined,
        mode: 'register' | 'validate'
    }
}

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'CaptureScreen'>

export default function CaptureScreen() {
    const { colors } = useTheme();
    const route = useRoute<CaptureScreenRouteProp>();
    const showToast = useToastTop();
    const { goBack } = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setResult = useCaptureStore((state) => state.setResult);
    const clearResult = useCaptureStore((state) => state.clearResult);
    const { getLocation } = useLocation();

    const { model } = useEfficientDetModel();

    /*const extractFile = async (imagePath: string) => {
        const response = await fetch(`file://${imagePath}`);
        const imageData = await response.arrayBuffer();
        return new Uint8Array(imageData);
    };*/

    const generateFaceNet = async (path: string): Promise<TypeArray> => {
        console.log(path);
        const imageResource = await fetch(path);
        const blob = await imageResource.blob();
        const arrayBuffer = getArrayBufferForBlob(blob);
        const detector = await model?.run([arrayBuffer]);
        return detector!![0];

    };

    const validateUserFace = async (cropPath: string, coords: CoordsProps) => {
        const detector = await generateFaceNet(`file://${cropPath}`);
        const vectorRequest: number[] = Object.values(detector);
        const { message, success } = await validateFaceService({
            lat: coords?.latitude,
            lng: coords?.longitude,
            faceToken: JSON.stringify(vectorRequest),
        });
        setResult(success, message);
    };

    const registerUserFace = async (originalPath: string, cropPath: string, id: string) => {
        const base64 = await fetchImageToB64(`file://${originalPath}`);
        const detector = await generateFaceNet(`file://${cropPath}`);
        const vectorRequest: number[] = Object.values(detector);
        const { message, success } = await registerFaceService({
            photo: base64,
            idEmpleado: id,
            vectorFace: JSON.stringify(vectorRequest),
        });
        setResult(success, message);
    };

    const handleCapture = async (originalPath: string, cropPath: string) => {
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
                await registerUserFace(originalPath, cropPath, id);
            } else if (mode === 'validate') {
                await validateUserFace(cropPath, location);
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
            {model && !isLoading ?
                <CameraView
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
