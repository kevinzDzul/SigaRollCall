import ImageResizer from 'react-native-image-resizer';
import { decode } from 'jpeg-js'; // O alguna librería similar
import { fetchImageToB64 } from './fileToBase64';

// Recorta y redimensiona la imagen a 128x128
export async function prepareInputTensor(imageUri: string, targetSize = 128) {
  const resizedImage = await ImageResizer.createResizedImage(
    imageUri,
    targetSize,
    targetSize,
    'JPEG',
    100,
    0,
    undefined,
    false,
    {
      mode: 'stretch',
    }
  );

  console.log('width:', resizedImage.width);
  console.log('height:', resizedImage.height);

  const base64 = await fetchImageToB64(`file://${resizedImage.path}`);
  console.log(base64);

  const response = await fetch(resizedImage.uri);
  const imageData = await response.arrayBuffer();
  const { data, width, height } = decode(new Uint8Array(imageData), {
    useTArray: true,
  });
  console.log('width:', width);
  console.log('height:', height);
  console.log('data length:', data.length);

  if (width !== targetSize || height !== targetSize) {
    throw new Error('Intenta nuevamente');
  }

  // data: [R, G, B, A, R, G, B, A, ...] (si es JPEG puede ser solo RGB)

  // Construir el tensor: [1, 128, 128, 3]
  const floatArray = new Float32Array(1 * targetSize * targetSize * 3);
  let rgbIndex = 0;
  for (let i = 0; i < data.length; i += 4) {
    floatArray[rgbIndex++] = data[i]; // R
    floatArray[rgbIndex++] = data[i + 1]; // G
    floatArray[rgbIndex++] = data[i + 2]; // B
    // saltar data[i+3] (Alpha)
  }
  // Devuelve tensor con shape [1, 128, 128, 3]
  return [floatArray];
}
