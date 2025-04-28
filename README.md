# SigaRollCall


**SigaRollCall** is a cross-platform mobile application built with React Native that facilitates roll call attendance and monitoring through real-time face detection and geolocation. The app leverages modern libraries and native modules to ensure high performance, smooth animations, and reliable error tracking.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)

## Features

- Real-time face detection powered by TensorFlow Lite and Vision Camera
- Geolocation tracking for attendance verification
- Intuitive navigation with bottom tabs and drawer menus
- Smooth animations and gesture handling
- Error monitoring with Sentry integration for crash reporting
- Cross-platform support for Android and iOS

## Prerequisites

- Node.js >= 18.x
- Yarn >= 1.22.x (or npm)
- Android Studio (for Android builds)
- Xcode and CocoaPods (for iOS builds)

Refer to the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide for detailed instructions.

## Installation

Clone the repository and install dependencies:
```sh
git clone <repository_url>
cd SigaRollCall
yarn install
```

For iOS, install CocoaPods dependencies:
```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

## Usage

Start the Metro bundler:
```sh
yarn start
```

In a separate terminal, launch the app:

- Android: `yarn android`
- iOS: `yarn ios`

## Dependencies

The project uses the following primary libraries:

| Package                                   | Version | Description                                                                                       |
|-------------------------------------------|---------|---------------------------------------------------------------------------------------------------|
| react                                     | 19.0.0  | Core library for building user interfaces                                                         |
| react-native                              | 0.79.1  | Framework for building native mobile apps using React                                              |
| @react-navigation/native                 | 7.0.14  | Core utilities and components for React Navigation                                                 |
| @react-navigation/native-stack            | 7.2.0   | Native stack navigator for React Navigation                                                        |
| @react-navigation/bottom-tabs             | 7.2.0   | Bottom tab navigator for seamless tab navigation                                                   |
| @react-navigation/drawer                 | 7.1.1   | Drawer navigator for sidebar-style navigation                                                      |
| react-native-gesture-handler              | 2.25.0  | Gesture handler for improved touch interactions                                                   |
| react-native-reanimated                   | 3.17.4  | High-performance animations library                                                                |
| react-native-screens                      | 4.10.0  | Native screen primitives for React Navigation                                                      |
| react-native-safe-area-context            | 5.4.0   | Provides safe area boundaries for devices with notches and rounded corners                         |
| react-native-safe-area-view               | 1.1.1   | Legacy safe area view component                                                                    |
| @react-native-community/geolocation      | 3.4.0   | Access device GPS location                                                                          |
| @react-native-community/image-editor     | 4.3.0   | Native image editing capabilities                                                                   |
| @react-native-vector-icons/common        | 11.0.0  | Common interface for vector icons                                                                   |
| @react-native-vector-icons/fontawesome6  | 6.7.1   | FontAwesome 6 icon pack                                                                            |
| @react-native-vector-icons/ionicons      | 7.4.0   | Ionicons icon pack                                                                                  |
| axios                                     | 1.8.4   | Promise-based HTTP client                                                                           |
| add                                       | 2.0.6   | Utility library for basic arithmetic operations                                                     |
| zustand                                   | 5.0.3   | Lightweight state management using hooks                                                            |
| @sentry/react-native                     | 6.11.0  | React Native integration for Sentry error monitoring                                                |
| @sentry/react                            | 9.14.0  | React integration for Sentry error monitoring                                                       |
| react-native-vision-camera               | 4.6.4   | High-performance camera module for React Native                                                     |
| react-native-vision-camera-face-detector | 1.8.2   | Face detection plugin for Vision Camera                                                             |
| react-native-fast-tflite                  | 1.6.1   | TensorFlow Lite inference for React Native                                                          |
| vision-camera-resize-plugin               | 3.2.0   | Image resizing plugin for Vision Camera                                                             |
| @reeq/react-native-device-brightness     | 1.0.6   | Access and control device brightness                                                                |
| lottie-react-native                       | 7.2.2   | Lottie animation support                                                                            |

For a complete list, see [package.json](./package.json).

## Development

- Linting: `yarn lint`
- Testing: `yarn test`
- Formatting: `yarn prettier --check .`


**Referencias** 
Herramienta para inspecionar un modelo (https://netron.app/)

Post de ejemplo de tensorflow lite para react native [Android](https://mrousavy.com/blog/VisionCamera-Pose-Detection-TFLite)
Post de medium dond explican como crear un proyecto similar [Android](https://proandroiddev.com/building-on-device-face-recognition-in-android-076a40dbaac6#acbe)
Codigo ejemplo en android [Android](https://github.com/shubham0204/OnDevice-Face-Recognition-Android/tree/main)
Codigo ejemplo en android [Android](https://github.com/shubham0204/FaceRecognition_With_FaceNet_Android/tree/master?tab=readme-ov-file)
Codigo ejemplo en android [Android](https://github.com/pillarpond/face-recognizer-android/tree/master?tab=readme-ov-file)
Codigo ejemplo en android [Android](https://medium.com/@estebanuri/real-time-face-recognition-with-android-tensorflow-lite-14e9c6cc53a5)
Codigo ejemplo en android [Android](https://github.com/estebanuri/face_recognition?tab=readme-ov-file)
Codigo ejemplo de uso de resize y vision camera: [Resize](https://github.com/c-goettert/vision-camera-resize-plugin-debug-demo/tree/main)
Codigo Ejemplo Blur en cara con react native [Blur face](https://github.com/mrousavy/FaceBlurApp)
Explicación de como cambiar tamaño de imagen, pasarle y analizarlo con un modelo de [Tensor](https://github.com/mrousavy/react-native-fast-tflite/issues/15)




## License
MIT License
