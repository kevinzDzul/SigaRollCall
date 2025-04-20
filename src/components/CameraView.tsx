import { Camera, useCameraDevice } from 'react-native-vision-camera'
import { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useTheme } from '@siga/context/themeProvider';

interface Props {
  onCapture: (path: string) => void;
  isLoading?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function CameraView({ onCapture, isLoading }: Props) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission !== 'denied');
    })();
  }, []);

  const takePhoto = async () => {
    if (camera.current && !isLoading) {
      try {
        const photo = await camera.current.takePhoto();
        onCapture(photo.path);
      } catch (error) {
        console.error("❌ Error al capturar foto:", error);
      }
    }
  };

  if (!device || !hasPermission) return null;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.circleOverlay} />
      <View style={styles.captureContainer}>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <TouchableOpacity
            onPress={takePhoto}
            disabled={isLoading}
            style={styles.captureButtonOuter}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  circleOverlay: {
    position: 'absolute',
    borderStyle: 'dashed',
    top: height / 2 - 300,
    left: width / 2 - 140,
    width: 280,
    height: 400,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    zIndex: 20,
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
