import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import Container from '@siga/components/Container';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@siga/screens/Capture';
import { useNavigation } from '@react-navigation/native';
import Button from '@siga/components/Button';
import Header from '@siga/components/Header';
import { useCaptureStore } from '@siga/store/capture';
import { useToastTop } from '@siga/context/toastProvider';
import { useLocation } from '@siga/hooks/useLocation';
import { CustomText } from '@siga/components/CustomText';
import TipCard from './components/TipsCard';
import { useTheme } from '@siga/context/themeProvider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function FacialRecognitionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const showToast = useToastTop();
  const message = useCaptureStore((state) => state.error);
  const clearResult = useCaptureStore((state) => state.clearResult);
  const { checkAndRequestPermission } = useLocation();

  useEffect(() => {
    checkAndRequestPermission();
  }, [checkAndRequestPermission]);

  useEffect(() => {
    if (message) {
      showToast(message, 'warning');
      clearResult();
    }
  }, [message, showToast, clearResult]);

  return (
    <Container >
      <Header mode="drawer" />
      <View style={styles.body}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
          <CustomText style={styles.emoji}>📸</CustomText>
        </View>

        <CustomText style={styles.title}>Reconocimiento Facial</CustomText>
        <CustomText style={styles.subtitle}>Coloca tu rostro frente a la cámara</CustomText>

        <View style={styles.tipsContainer}>
          <TipCard emoji="💡" text="Asegúrate de estar en un lugar bien iluminado" style={styles.tipCard} />
          <TipCard emoji=" 👓" text="Mantén tu rostro centrado y sin objetos que lo cubran" />
        </View>
      </View>
      <Button
        style={styles.button}
        title="🔍 Validar Rostro"
        onPress={() => navigation.navigate('CaptureScreen', { mode: 'validate' })}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  tipsContainer: {
    marginBottom: 30,
    alignSelf: 'stretch',
  },
  tipCard: {
    marginBottom: 8,
  },
  button: {
    borderRadius: 0,
  },
});
