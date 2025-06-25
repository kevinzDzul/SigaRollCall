import FaceDetection, { Frame } from '@react-native-ml-kit/face-detection';

export async function detectFace(imageUri: string): Promise<Frame> {
  const faces = await FaceDetection.detect(imageUri);
  // Suponiendo un rostro: faces[0]
  if (faces.length === 0) {
    throw new Error('No se detectó ningún rostro');
  }
  return faces[0].frame; // { left, top, right, bottom }
}
