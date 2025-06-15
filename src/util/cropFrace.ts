import ImageEditor from '@react-native-community/image-editor';
import { Frame } from '@react-native-ml-kit/face-detection';

export async function cropFace(imageUri: string, bounds: Frame) {
  const cropData = {
    offset: { x: bounds.left, y: bounds.top },
    size: { width: bounds.width, height: bounds.height },
  };
  const croppedUri = await ImageEditor.cropImage(imageUri, cropData);
  return croppedUri;
}
