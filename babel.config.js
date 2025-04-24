module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    'react-native-worklets-core/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@siga': './src',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
