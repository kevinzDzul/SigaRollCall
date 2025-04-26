const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const {
    withSentryConfig,
} = require('@sentry/react-native/metro');

const root = path.resolve(__dirname, '..');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [root],
    resolver: {
        assetExts: ['tflite', 'png', 'jpg'],
    },
};

module.exports = withSentryConfig(mergeConfig(getDefaultConfig(__dirname), config));
