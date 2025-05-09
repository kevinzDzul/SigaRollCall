import { Camera, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useTheme } from '@siga/context/themeProvider';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
  Bounds,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { reportError } from '@siga/util/reportError';
import ImageEditor from '@react-native-community/image-editor';

interface Props {
  onCapture: (originalPath: string, cropPath: string) => void;
  showCircleFace?: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function CameraView({ onCapture, showCircleFace }: Props) {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [{ fps: 5 }]);
  const theme = useTheme();

  const [hasPermission, setHasPermission] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [message, setMessage] = useState('Buscando rostro...');
  const [done, setDone] = useState(false);

  const prevEyeClosedRef = useRef(false);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate',
    contourMode: 'all',
    landmarkMode: 'all',
    classificationMode: 'all',
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

  const takePhoto = async (bounds: Bounds) => {
    if (camera.current && hasFace && !done) {
      try {
        const photo = await camera.current.takeSnapshot();

        const croppedUri = await ImageEditor.cropImage(`file://${photo.path}`, {
          offset: { x: bounds.x, y: bounds.y },
          size: { width: bounds.width, height: bounds.height },
        });

        onCapture(photo.path, croppedUri.path);
        setMessage('Foto tomada exitosamente');
        setDone(true);
      } catch (error) {
        reportError(error);
      }
    }
  };

  const handleFrame = Worklets.createRunOnJS((faces: Face[]) => {
    if (done) { return; }

    if (faces.length === 0) {
      setHasFace(false);
      prevEyeClosedRef.current = false;
      setBlinkCount(0);
      setMessage('Se necesita rostro');
      return;
    }

    setHasFace(true);
    setMessage(`Parpadeos: ${blinkCount}/3`);

    const face = faces[0];
    const leftOpen = face.leftEyeOpenProbability ?? 1;
    const rightOpen = face.rightEyeOpenProbability ?? 1;
    const closed = leftOpen < 0.5 && rightOpen < 0.5;

    if (!prevEyeClosedRef.current && closed) {
      prevEyeClosedRef.current = true;
    } else if (prevEyeClosedRef.current && !closed) {
      prevEyeClosedRef.current = false;
      const nextCount = blinkCount + 1;
      setBlinkCount(nextCount);
      setMessage(`Parpadeos: ${nextCount}/3`);
      if (nextCount >= 2) {
        takePhoto(face.bounds);
      }
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const faces = detectFaces(frame);
    handleFrame(faces);

  }, [handleFrame]);

  if (!device || !hasPermission) { return null; }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={!done}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
        isMirrored={false}
        outputOrientation="device"
        format={format}
      />

      {showCircleFace && !done && <View style={styles.circleOverlay} />}

      <View style={styles.messageContainer}>
        <Text style={[styles.messageText, { color: theme.colors.onPrimary }]}> {message} </Text>
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
