import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@siga/context/themeProvider';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
  Bounds,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

interface Props {
  onCapture: (path: string, bounds?: Bounds) => void;
  showCircleFace?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function CameraView({ onCapture, showCircleFace }: Props) {
  const { colors } = useTheme();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  const [hasFace, setHasFace] = useState(false);
  const [bounds, setBounds] = useState<Bounds | undefined>(undefined);

  const [hasPermission, setHasPermission] = useState(false);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({}).current;
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission !== 'denied');
    })();
  }, []);

  const takePhoto = async () => {
    if (camera.current && hasFace) {
      try {
        /*** tomamos un screen shot en lugar de foto por que la foto queda oscura */
        const photo = await camera.current.takeSnapshot({ quality: 90 });
        onCapture(photo.path, bounds);
      } catch (error) {
        console.error('❌ Error al capturar foto:', error);
      }
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS((
    faces: Face[]
  ) => {
    setHasFace((faces?.length ?? 0) > 0);
    setBounds(faces[0]?.bounds);
  });

  const frameProcessor = useFrameProcessor(async (frame) => {
    'worklet';
    const faces = detectFaces(frame);
    handleDetectedFaces(faces);

  }, [handleDetectedFaces]);

  if (!device || !hasPermission) { return null; }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      {showCircleFace ? <View style={styles.circleOverlay} /> : null}
      <View style={styles.captureContainer}>
        {!hasFace ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <TouchableOpacity
            onPress={takePhoto}
            style={styles.captureButtonOuter}>
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
    top: height / 2 - 240,
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
