import {
  Camera,
  CameraPosition,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useTheme } from '@siga/context/themeProvider';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { useSharedValue, Worklets } from 'react-native-worklets-core';
import { reportError } from '@siga/util/reportError';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import useEfficientDetModel from '@siga/hooks/useEfficientDetModel';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  position?: CameraPosition;
  onCapture: (originalPath: string, resizedFrameData: Float32Array) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function CameraView({ position = 'front', onCapture, showCircleFace }: Props) {
  const isFocused = useIsFocused();
  const camera = useRef<Camera>(null);
  const { resize } = useResizePlugin();
  const device = useCameraDevice(position);
  const format = useCameraFormat(device, []);
  const theme = useTheme();

  const [hasPermission, setHasPermission] = useState(false);
  const [message, setMessage] = useState('Buscando rostro...');
  const [done, setDone] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCounting = useRef(false);

  const { model } = useEfficientDetModel();
  const vectorData = useSharedValue<any>([]);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    windowWidth: SCREEN_W,
    windowHeight: SCREEN_H,
  }).current;
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission !== 'denied');
    })();
  }, []);

  const takePhoto = async () => {
    if (camera.current && vectorData.value && !done) {
      try {
        const photo = await camera.current.takeSnapshot();
        onCapture(photo.path, vectorData.value);
        setMessage('Foto tomada exitosamente');
        setDone(true);
        isCounting.current = false;
      } catch (error) {
        reportError(error);
      }
    }
  };

  const startCountdown = () => {
    if (isCounting.current) return;

    isCounting.current = true;
    let seconds = 5;
    setMessage(`Foto en ${seconds}...`);

    countdownRef.current = setInterval(() => {
      seconds--;
      setMessage(`Foto en ${seconds}...`);

      if (seconds === 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        takePhoto(); // ✅ ya no se valida si hay rostro
      }
    }, 1000);
  };

  const handleFrame = Worklets.createRunOnJS((faces: Face[]) => {
    if (done) return;

    const detected = faces.length > 0;

    if (detected && !isCounting.current) {
      startCountdown();
    } else if (!detected && !isCounting.current) {
      setMessage('Buscando rostro...');
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAtTargetFps(1, async () => {

      const faces = detectFaces(frame);
      handleFrame(faces);

      if (!model || faces.length === 0) return;

      const raw = resize(frame, {
        scale: { width: 160, height: 160 },
        crop: {
          x: faces[0].bounds.y,
          y: faces[0].bounds.x,
          width: faces[0].bounds.width,
          height: faces[0].bounds.height,
        },
        rotation: '270deg',
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      const detector = model.runSync([raw]);
      vectorData.value = detector[0];
    });
  }, [handleFrame]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (!isFocused || !device || !hasPermission) return null;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={!done}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
        focusable
        isMirrored={false}
        outputOrientation="device"
        format={format}
      />

      {showCircleFace && !done && <View style={styles.circleOverlay} />}

      <View style={styles.messageContainer}>
        <Text style={[styles.messageText, { color: theme.colors.onPrimary }]}>
          {message}
        </Text>
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
  messageContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    zIndex: 20,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
