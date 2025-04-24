import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import useEfficientDetModel from '@siga/hooks/useEfficientDetModel';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCaptureStore } from '@siga/store/capture';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { registerFaceService } from '@siga/mock/services/registerFaceMock';
import { validateFaceService } from '@siga/mock/services/validateFaceMock';

export type RootStackParamList = {
    CaptureScreen: { id?: string | undefined, mode: 'register' | 'validate' }
}

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'CaptureScreen'>

export default function CaptureScreen() {
    const { colors } = useTheme();
    const route = useRoute<CaptureScreenRouteProp>();
    const showToast = useToastTop();
    const { goBack } = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setResult = useCaptureStore((state) => state.setResult);

    const { modelState, model } = useEfficientDetModel();

    const extractFile = async (imagePath: string) => {
        const response = await fetch(`file://${imagePath}`);
        const imageData = await response.arrayBuffer();
        return new Uint8Array(imageData);
    };

    const validateUserFace = async (imagePath: string) => {
        const raw = await extractFile(imagePath);
        const detector = await model?.run([raw]);
        const { error, success } = await validateFaceService({ vector: detector });
        setResult(success, error);
    };

    const registerUserFace = async (id: string, imagePath: string) => {
        const raw = await extractFile(imagePath);
        const detector = await model?.run([raw]);
        const { error, success } = await registerFaceService({ id: id, vector: detector });
        setResult(success, error);
    };

    const handleCapture = async (imagePath: string) => {
        const mode = route?.params?.mode;
        setIsLoading(true);
        try {
            if (mode === 'register') {
                const id = route?.params?.id;
                if (!id) {
                    showToast('Se requiere identificador');
                    return;
                }
                await registerUserFace(id, imagePath);
            }
            if (mode === 'validate') {
                await validateUserFace(imagePath);
            }
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            showToast('Ocurrio un error');
            setIsLoading(false);
        } finally {
            goBack();
        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header mode={isLoading ? undefined : 'back'} />
            </View>
            {isLoading ? <ActivityIndicator color={colors.primary} size="large" /> : null}
            {modelState === 'loaded' && isLoading === false ? <CameraView onCapture={handleCapture} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    containerHeader: {
        position: 'absolute',
        width: '100%',
        zIndex: 200,
    },
});
