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
  Circle,
  Path,
  Skia,
  PathOp,
} from '@shopify/react-native-skia';

interface Props {
  position?: CameraPosition;
  onCapture: (originalPath: string) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MIN_BOUNDS = { height: 800, width: 800 };
const MAX_BOUNDS = { height: 1100, width: 1000 };

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
  const [isCentered, setIsCentered] = useState(false);

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
        takePhoto(); // ✅ ya no se valida si hay rostro
      }
    }, 1000);
  };

  const isFacingForward = (
    face: Face,
    yawThreshold = 10,
    pitchThreshold = 15,
  ) => {
    return (
      Math.abs(face.yawAngle) < yawThreshold &&
      Math.abs(face.pitchAngle) < pitchThreshold
    );
  };

  const isFaceCentered = (bounds: Face['bounds']) => {
    return (
      bounds.width >= MIN_BOUNDS.width &&
      bounds.width <= MAX_BOUNDS.width &&
      bounds.height >= MIN_BOUNDS.height &&
      bounds.height <= MAX_BOUNDS.height
    );
  };

  const handleFrame = Worklets.createRunOnJS((faces: Face[]) => {
    if (done) {
      return;
    }

    if (faces.length === 0) {
      setIsCentered(false);
      if (!isCounting.current) {
        setMessage('Buscando rostro...');
      }
      return;
    }

    const face = faces[0];
    const facingNow = isFacingForward(face);
    const centeredNow = isFaceCentered(face.bounds);
    setIsCentered(centeredNow);

    if (!facingNow && !isCounting.current) {
      setMessage('Mira hacia la camara');
      return;
    }

    if (!centeredNow && !isCounting.current) {
      setMessage('Centra tu rostro en el círculo');
      return;
    }

    if (facingNow && centeredNow && !isCounting.current) {
      startCountdown();
      return;
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
    [handleFrame],
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
  const circleColor = isCentered ? 'limegreen' : 'white';
  const CIRCLE_R = (SCREEN_W / 2) - 10;
  const CIRCLE_CX = SCREEN_W / 2;
  const CIRCLE_CY = SCREEN_H / 2;

  const overlayPath = Skia.Path.Make();
  overlayPath.addRect(Skia.XYWHRect(0, 0, SCREEN_W, SCREEN_H));
  const circlePath = Skia.Path.Make();
  circlePath.addCircle(CIRCLE_CX, CIRCLE_CY, CIRCLE_R);
  overlayPath.op(circlePath, PathOp.Difference);

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
          <Circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            style="stroke"
            strokeWidth={3}
            color={circleColor}
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
