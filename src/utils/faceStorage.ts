// src/storage/faceStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const FACE_PREFIX = "face_"; // Para clave única por rostro

export async function saveFaceEmbedding(
  id: string,
  embedding: number[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${FACE_PREFIX}${id}`,
      JSON.stringify(embedding)
    );
  } catch (e) {
    console.error("Error al guardar el rostro:", e);
  }
}

export async function getAllFaceEmbeddings(): Promise<
  Record<string, number[]>
> {
  const keys = await AsyncStorage.getAllKeys();
  const faceKeys = keys.filter((k) => k.startsWith(FACE_PREFIX));
  const entries = await AsyncStorage.multiGet(faceKeys);

  const embeddings: Record<string, number[]> = {};
  entries.forEach(([key, value]) => {
    if (key && value) {
      embeddings[key] = JSON.parse(value);
    }
  });

  return embeddings;
}

export async function clearAllFaces(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const faceKeys = keys.filter((k) => k.startsWith(FACE_PREFIX));
  await AsyncStorage.multiRemove(faceKeys);
}
