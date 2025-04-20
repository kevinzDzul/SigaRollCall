// src/services/faceService.ts
import * as tf from '@tensorflow/tfjs';
import * as faceMesh from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-react-native';
//import { decodeJpeg } from '@tensorflow/tfjs-react-native';

let model: faceMesh.FaceMesh | null = null;

// Inicializa TensorFlow y carga el modelo si no está cargado
export async function loadModel(): Promise<void> {
  await tf.ready();
  if (!model) {
    model = await faceMesh.load({ maxFaces: 1 });
    console.log('✅ FaceMesh cargado');
  }
}

// Convierte una imagen en base64 (usando su ruta) a un tensor
/*async function imageToTensor(imagePath: string): Promise<tf.Tensor3D> {
  try {
    const response = await fetch(`file://${imagePath}`);
    const imageData = await response.arrayBuffer();
    const raw = new Uint8Array(imageData);
    const imageTensor = decodeJpeg(raw);
    return imageTensor;
  } catch (error) {
    console.error('❌ Error leyendo imagen:', error);
    throw error;
  }
}*/

// Extrae el vector facial a partir de la malla facial
/*export async function getFaceEmbedding(
  imagePath: string
): Promise<number[] | null> {
  if (!model) {
    await loadModel();
  }

  const imageTensor = await imageToTensor(imagePath);
  const predictions = await model!.estimateFaces(imageTensor);

  if (predictions.length > 0) {
    const face = predictions[0];

    // `scaledMesh` es un array de 468 puntos [x, y, z]
    if (face.scaledMesh && Array.isArray(face.scaledMesh)) {
      const vector = face.scaledMesh.flat(); // Aplana para convertir en vector 1D
      return vector;
    }
  }

  return null;
}*/
