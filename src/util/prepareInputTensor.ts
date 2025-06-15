import ImageResizer from 'react-native-image-resizer';
import { decode } from 'jpeg-js'; // O alguna librería similar

// Recorta y redimensiona la imagen a 128x128
export async function prepareInputTensor(imageUri: string) {
  const resizedImage = await ImageResizer.createResizedImage(
    imageUri,
    128,
    128,
    'JPEG',
    100
  );
  const response = await fetch(resizedImage.uri);
  const imageData = await response.arrayBuffer();
  const { data } = decode(new Uint8Array(imageData));
  // data: [R, G, B, A, R, G, B, A, ...] (si es JPEG puede ser solo RGB)

  // Construir el tensor: [1, 128, 128, 3]
  const floatArray = new Float32Array(1 * 128 * 128 * 3);
  let dataIndex = 0;
  for (let i = 0; i < 128 * 128; i++) {
    floatArray[dataIndex++] = data[i * 4] / 255; // R
    floatArray[dataIndex++] = data[i * 4 + 1] / 255; // G
    floatArray[dataIndex++] = data[i * 4 + 2] / 255; // B
    // OJO: Si tu data es RGB sin canal alpha, cambia el step a 3
  }
  // Devuelve tensor con shape [1, 128, 128, 3]
  return [floatArray];
}
