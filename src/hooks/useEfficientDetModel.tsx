import { useEffect } from 'react';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';

const useEfficientDetModel = () => {
  // Carga y estado del modelo TFLite
  const modelHook = useTensorflowModel(require('../assets/mobilenet_v1.tflite'));
  const actualModel = modelHook.state === 'loaded' ? modelHook.model : undefined;

  // Plugin de redimensionamiento
  const { resize } = useResizePlugin();

  // Log del modelo cuando se carga completamente
  useEffect(() => {
    if (actualModel) {
      console.log(`Modelo EfficientDet cargado con delegate: ${actualModel.delegate}`);
    }
  }, [actualModel]);

  return {
    modelState: modelHook.state,
    model: actualModel,
    resize,
  };
};

export default useEfficientDetModel;
