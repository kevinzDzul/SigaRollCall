import React, {useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {
  Skia,
  createPicture,
  Canvas,
  Picture,
  AlphaType,
  ColorType,
} from '@shopify/react-native-skia';
import {Worklets, useSharedValue} from 'react-native-worklets-core';
import {
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';

const WIDTH = 160;
const HEIGHT = 160;

function CameraTestContainer() {
  const [cameraActive, setCameraActive] = React.useState(false);
  const [frameTimestamp, setFrameTimestamp] = React.useState(0);
  const resizedFrameData = useSharedValue(
    new Array(WIDTH * HEIGHT * 4).fill(0),
  );

  const faceDetectionOptions = useRef<FaceDetectionOptions>({}).current;
  const {detectFaces} = useFaceDetector(faceDetectionOptions);

  const updateDataFromWorklet = Worklets.createRunOnJS(setFrameTimestamp);

  const camera = React.useRef(null);

  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 640, height: 480}},
    {fps: 5},
    {videoStabilizationMode: 'auto'},
  ]);
  const {resize} = useResizePlugin();

  const picture = React.useMemo(
    () =>
      createPicture(canvas => {
        if (resizedFrameData.value) {
          const imageArray = new Uint8Array(resizedFrameData.value);
          const skiaImageInfo = {
            width: WIDTH,
            height: HEIGHT,
            alphaType: AlphaType.Opaque,
            colorType: ColorType.RGBA_8888,
          };

          const skiaImageData = Skia.Data.fromBytes(imageArray);
          const image = Skia.Image.MakeImage(
            skiaImageInfo,
            skiaImageData,
            WIDTH * 4,
          );

          canvas.drawImage(image, 0, 0);
        }
      }),
    [frameTimestamp],
  );

  const getCameraPermissions = async cameraStatus => {
    const cameraPermissionStatus = await Camera.getCameraPermissionStatus();

    if (cameraPermissionStatus !== 'granted') {
      await Camera.requestCameraPermission();

      const cameraPermissionStatus = await Camera.getCameraPermissionStatus();

      if (cameraPermissionStatus === 'granted') {
        setCameraActive(cameraStatus);
      }
    } else {
      setCameraActive(cameraStatus);
    }
  };

  const setCamera = async cameraStatus => {
    await getCameraPermissions(cameraStatus);
  };

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';

      //runAtTargetFps(1, async () => {
      const width = 160;
      const height = 160;

      const faces = detectFaces(frame);
      if (faces.length > 0) {
        const data = resize(frame, {
          scale: {
            width,
            height,
          },
          crop: {
            x: faces[0].bounds.y,
            y: faces[0].bounds.x,
            width: faces[0].bounds.height,
            height: faces[0].bounds.width,
          },
          rotation: '90deg',
          pixelFormat: 'rgb',
          dataType: 'float32',
        });

        const arrayData = new Array(width * height * 4);
        for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
          arrayData[j] = data[i] * 255; // R
          arrayData[j + 1] = data[i + 1] * 255; // G
          arrayData[j + 2] = data[i + 2] * 255; // B
          arrayData[j + 3] = 255; // A
        }

        resizedFrameData.value = arrayData;
      }

      updateDataFromWorklet(new Date().valueOf());

      //}

      //});
    },
    [updateDataFromWorklet],
  );

  if (cameraActive) {
    return (
      <View style={{flex: 1}}>
        <Camera
          style={{width: 240, height: 320, marginBottom: 20}}
          ref={camera}
          device={device}
          format={format}
          isActive={true}
          isMirrored={true}
          pixelFormat="yuv"
          frameProcessor={frameProcessor}
        />
        <Canvas style={{width: 320, height: 320}}>
          <Picture picture={picture} />
        </Canvas>
        <TouchableOpacity
          onPress={() => {
            setCamera(false);
          }}>
          <Text style={{fontSize: 20, color: 'blue'}}>Close Camera</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setCamera(true);
          }}>
          <Text style={{fontSize: 20, color: 'blue'}}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default CameraTestContainer;
