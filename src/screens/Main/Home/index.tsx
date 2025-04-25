import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Container from '@siga/components/Container';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@siga/screens/Capture';
import { useNavigation } from '@react-navigation/native';
import Button from '@siga/components/Button';
import Header from '@siga/components/Header';
import { useCaptureStore } from '@siga/store/capture';
import { useToastTop } from '@siga/context/toastProvider';
import { useLocation } from '@siga/hooks/useLocation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function FacialRecognitionScreen() {
  const navigation = useNavigation<NavigationProp>();

  const showToast = useToastTop();
  const status = useCaptureStore((state) => state.status);
  const clearResult = useCaptureStore((state) => state.clearResult);
  const { checkAndRequestPermission } = useLocation();

  useEffect(() => {
    checkAndRequestPermission();
  }, [checkAndRequestPermission]);

  useEffect(() => {
    if (status) {
      showToast('Registro completo');
      clearResult();
    }
  }, [status, showToast, clearResult]);

  return (
    <Container >
      <Header mode="drawer" />
      <View style={styles.body}>
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>🤖</Text>
        </View>

        <Text style={styles.title}>Reconocimiento Facial</Text>
        <Text style={styles.subtitle}>Coloca tu rostro frente a la cámara</Text>

        <View style={styles.tipsContainer}>
          <Text style={styles.tip}>• Asegúrate de estar en un lugar bien iluminado 💡</Text>
          <Text style={styles.tip}>• Mantén tu rostro centrado y sin objetos que lo cubran 👓</Text>
        </View>

        <Button
          title="🔍 Validar Rostro"
          onPress={() => navigation.navigate('CaptureScreen', { mode: 'validate' })}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipsContainer: {
    marginBottom: 30,
    alignSelf: 'stretch',
  },
  tip: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
  },
});
