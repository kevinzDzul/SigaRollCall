import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import Container from '@siga/components/Container';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@siga/screens/Capture';
import { useNavigation } from '@react-navigation/native';
import Button from '@siga/components/Button';
import Header from '@siga/components/Header';
import { useCaptureStore } from '@siga/store/capture';
import { CustomText } from '@siga/components/CustomText';
import TipCard from './components/TipsCard';
import { useTheme } from '@siga/context/themeProvider';
import { useValidateGeolocation } from '@siga/hooks/useValidateGeolocation';
import { useIsMounted } from '@siga/hooks/useIsMounted';
import CustomModal from '@siga/components/CustomModal';
import ContentBody from '@siga/components/ContentBody';
import { useAppPermissions } from '@siga/hooks/useAppPermissions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function FacialRecognitionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isLoadingPermission, setIsLoadingPermission] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const { message, status, clearResult } = useCaptureStore((state) => state);
  const { validateGeolocation } = useValidateGeolocation();
  const { requestRequiredPermissions } = useAppPermissions();

  const handleValidateFace = async () => {
    setIsLoadingPermission(true);

    const havePermissions = await requestRequiredPermissions();
    if (!havePermissions) {
      isMounted.current && setIsLoadingPermission(false);
      return;
    }

    const isGeolocationValid = await validateGeolocation();
    if (isGeolocationValid) {
      navigation.navigate('CaptureScreen', { mode: 'validate' });
    }
    isMounted.current && setIsLoadingPermission(false);
  };

  return (
    <Container >
      <Header mode="drawer" />
      <ContentBody style={styles.body}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
          <CustomText style={styles.emoji}>📸</CustomText>
        </View>

        <View style={styles.infoContainer}>
          <CustomText style={styles.infoText}>
            🌟 Este módulo te permite registrar tu entrada y salida mediante reconocimiento facial.
          </CustomText>
        </View>
        <CustomText style={styles.title}>Validación Facial</CustomText>
        <CustomText style={styles.subtitle}>Coloca tu rostro frente a la cámara</CustomText>

        <View style={styles.tipsContainer}>
          <TipCard emoji="💡" text="Asegúrate de estar en un lugar bien iluminado" style={styles.tipCard} />
          <TipCard emoji="👓" text="Mantén tu rostro centrado y sin objetos que lo cubran" />
        </View>

      </ContentBody>
      <Button
        isLoading={isLoadingPermission}
        style={styles.button}
        title="🔍 Validar Rostro"
        onPress={() => handleValidateFace()}
      />
      <CustomModal
        title="¡Hola! 👋"
        visible={!!message} onClose={() => clearResult()}>
        <CustomText style={styles.infoText}>
          {`${status ? '🌟' : '🔥'} ${message}`}
        </CustomText>
      </CustomModal>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 10,
    margin: 8,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    color: '#0d47a1',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
