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
import { Worklets } from 'react-native-worklets-core';
import { reportError } from '@siga/util/reportError';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  position?: CameraPosition;
  onCapture: (originalPath: string) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function CameraView({ position = 'front', onCapture, showCircleFace }: Props) {
  const isFocused = useIsFocused();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice(position);
  const format = useCameraFormat(device, []);
  const theme = useTheme();

  const [hasPermission, setHasPermission] = useState(false);
  const [message, setMessage] = useState('Buscando rostro...');
  const [done, setDone] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCounting = useRef(false);

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
    if (camera.current && !done) {
      try {
        const photo = await camera.current.takeSnapshot();
        onCapture(photo.path);
        setMessage('Foto tomada exitosamente');
        setDone(true);
        isCounting.current = false;
      } catch (error) {
        reportError(error);
      }
    }
  };

  const startCountdown = () => {
    if (isCounting.current) {return;}

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
    if (done) {return;}

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
    });
  }, [handleFrame]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (!isFocused || !device || !hasPermission) {return null;}

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
