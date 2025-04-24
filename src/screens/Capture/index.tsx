import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import useEfficientDetModel from '@siga/hooks/useEfficientDetModel';
import { RouteProp, useRoute } from '@react-navigation/native';

export type RootStackParamList = {
    CaptureScreen: { mode: 'register' | 'validate' }
}

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'CaptureScreen'>

export default function CaptureScreen() {
    const route = useRoute<CaptureScreenRouteProp>();

    const { modelState, model } = useEfficientDetModel();

    const handleCapture = async (imagePath: string) => {
        const response = await fetch(`file://${imagePath}`);
        const imageData = await response.arrayBuffer();
        const raw = new Uint8Array(imageData);
        const detector = await model?.run([raw]);
        console.log(detector);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header mode={'back'} />
            </View>
            {modelState === 'loaded' ? <CameraView onCapture={handleCapture} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerHeader: {
        position: 'absolute',
        width: '100%',
        zIndex: 200,
    },
});
