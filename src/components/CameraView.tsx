import { Camera, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@siga/context/themeProvider';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { useSharedValue, Worklets } from 'react-native-worklets-core';
import { useUnmountBrightness } from '@reeq/react-native-device-brightness';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import useEfficientDetModel from '@siga/hooks/useEfficientDetModel';
import { TypeArray } from '@siga/api/registerFaceService';

interface Props {
  onCapture: (path: string, vector: TypeArray) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function CameraView({ onCapture, showCircleFace }: Props) {
  const { colors } = useTheme();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [{ fps: 30 }]);

  const [hasFace, setHasFace] = useState(false);

  const [hasPermission, setHasPermission] = useState(false);

  const vectorData = useSharedValue<any>([]);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    contourMode: 'all',
    landmarkMode: 'none',
    classificationMode: 'none',
  }).current;
  const { detectFaces } = useFaceDetector(faceDetectionOptions);
  const { resize } = useResizePlugin();
  const { model } = useEfficientDetModel();
  useUnmountBrightness(1);

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
        onCapture(photo.path, vectorData.value);
      } catch (error) {
        console.error('❌ Error al capturar foto:', error);
      }
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS((
    faces: Face[],
  ) => {
    setHasFace((faces?.length ?? 0) > 0);
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const faces = detectFaces(frame);
    handleDetectedFaces(faces);


    if (!model || model == null || faces.length <= 0) return;

    const raw = resize(frame, {
      scale: {
        width: 160,//requerido para el modelo
        height: 160,//requerido para el modelo
      },
      pixelFormat: 'rgb',
      dataType: 'float32',
    });
    const detector = model?.runSync([raw]);
    vectorData.value = detector[0];

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
        pixelFormat="yuv"
        isMirrored={false}
        outputOrientation="device"
        format={format}
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

      {/* <View
        style={{
          position: 'absolute',
          left: (bounds?.x ?? 0) * (SCREEN_W / width),
          top: (bounds?.y ?? 0) * (SCREEN_H / height),
          width: (bounds?.width ?? 0) * (SCREEN_W / width),
          height: (bounds?.height ?? 0) * (SCREEN_H / height),
          borderWidth: 2,
          borderColor: 'red',
        }}
      /> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  circleOverlay: {
    position: 'absolute',
    borderStyle: 'dashed',
    top: SCREEN_H / 2 - 240,
    left: SCREEN_W / 2 - 140,
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
