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
import {
  Canvas,
  Path,
  Skia,
  PathOp,
  Oval,
} from '@shopify/react-native-skia';

interface Props {
  position?: CameraPosition;
  onCapture: (originalPath: string) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const isFacingForward = (face: Face, yawThreshold = 15, pitchThreshold = 15) => {
  return (
    Math.abs(face.yawAngle) < yawThreshold &&
    Math.abs(face.pitchAngle) < pitchThreshold
  );
};

export default function CameraView({
  position = 'front',
  onCapture,
  showCircleFace,
}: Props) {
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
    performanceMode: 'fast',
    classificationMode: 'all',
    autoMode: true,
    cameraFacing: 'front',
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

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    isCounting.current = false;
  };

  const startCountdown = () => {
    if (isCounting.current) {
      return;
    }

    isCounting.current = true;
    let seconds = 5;
    setMessage(`Foto en ${seconds}...`);

    countdownRef.current = setInterval(() => {
      seconds--;
      setMessage(`Foto en ${seconds}...`);

      if (seconds === 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        takePhoto();
      }
    }, 1000);
  };

  const handleFrame = Worklets.createRunOnJS((faces: Face[]) => {
    if (done) {
      return;
    }

    if (faces.length === 0) {
      stopCountdown();
      setMessage('Buscando rostro...');
      return;
    }

    const face = faces[0];

    if (!isFacingForward(face)) {
      stopCountdown();
      setMessage('Mira hacia la cámara');
      return;
    }

    if (!isCounting.current) {
      setMessage('¡No te muevas!');
      startCountdown();
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAtTargetFps(1, async () => {
        const faces = detectFaces(frame);
        handleFrame(faces);
      });
    },
    [handleFrame, detectFaces],
  );

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (!isFocused || !device || !hasPermission) {
    return null;
  }

  const OVAL_WIDTH = SCREEN_W * 0.8;
  const OVAL_HEIGHT = OVAL_WIDTH * 1.4;
  const OVAL_X = (SCREEN_W - OVAL_WIDTH) / 2;
  const OVAL_Y = (SCREEN_H - OVAL_HEIGHT) / 2.5;

  const overlayPath = Skia.Path.Make();
  overlayPath.addRect(Skia.XYWHRect(0, 0, SCREEN_W, SCREEN_H));
  const ovalPath = Skia.Path.Make();
  ovalPath.addOval(Skia.XYWHRect(OVAL_X, OVAL_Y, OVAL_WIDTH, OVAL_HEIGHT));
  overlayPath.op(ovalPath, PathOp.Difference);

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

      {showCircleFace && !done && (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path path={overlayPath} color="rgba(0, 0, 0, 0.5)" />
          <Oval
            x={OVAL_X}
            y={OVAL_Y}
            width={OVAL_WIDTH}
            height={OVAL_HEIGHT}
            style="stroke"
            strokeWidth={3}
            color="white"
          />
        </Canvas>
      )}

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
