import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
//import { getFaceEmbedding } from '@siga/utils/faceService';
import { getAllFaceEmbeddings, saveFaceEmbedding } from '@siga/utils/faceStorage';
import { cosineSimilarity } from '@siga/utils/similarity';
import CameraView from '@siga/components/CameraView';
import Header from '@siga/components/Header';
import { useToastTop } from '@siga/context/toastProvider';
import { useIsMounted } from '@siga/hooks/useIsMounted';

export type RootStackParamList = {
    CaptureScreen: { mode: 'register' | 'validate' }
}

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'CaptureScreen'>

export default function CaptureScreen() {
    const isMounted = useIsMounted();
    const route = useRoute<CaptureScreenRouteProp>();
    const mode = route.params.mode;
    const showToast = useToastTop();

    const [loading, setLoading] = useState(false);

    /*const handleCapture = async (imagePath: string) => {
        setLoading(true);
        try {
            const embedding = await getFaceEmbedding(imagePath);
            if (!isMounted.current) {return;}

            if (!embedding) {
                showToast('❌ No se detectó ningún rostro.', 'warning');
                setLoading(false);
                return;
            }

            if (mode === 'register') {
                const newId = Date.now().toString();
                await saveFaceEmbedding(newId, embedding);
                showToast('✅ Rostro registrado correctamente.', 'success');
            }

            if (mode === 'validate') {
                const all = await getAllFaceEmbeddings();
                let matchFound = false;

                for (const [id, savedEmbedding] of Object.entries(all)) {

                    if (embedding.length !== savedEmbedding.length) {
                        console.warn(`⚠️ Longitud incompatible con ${id}. Skipping...`);
                        continue;
                    }

                    const sim = cosineSimilarity(embedding, savedEmbedding);
                    console.log(`🧠 Comparando con ${id} → similitud: ${sim.toFixed(3)}`);

                    if (sim > 0.9) {
                        matchFound = true;
                        showToast(`✅ Rostro reconocido (match con ${id}).`, 'success');
                        break;
                    }
                }

                if (!matchFound) {
                    showToast('❌ Rostro no registrado.', 'error');
                }
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Hubo un problema al procesar la imagen.');
        }
        setLoading(false);
    };*/

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', width: '100%', zIndex: 200 }}>
                <Header mode={loading ? undefined : 'back'} />
            </View>
            <CameraView
                onCapture={() => {}}
                isLoading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
