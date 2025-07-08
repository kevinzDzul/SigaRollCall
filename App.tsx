import React from 'react';
import { AuthProvider } from '@siga/context/authProvider';
import { ThemeProvider } from '@siga/context/themeProvider';
import { ToastProvider } from '@siga/context/toastProvider';
import RootNavigator from '@siga/navigation/RootNavigator';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import { getVersion, getBuildNumber, getBundleId } from 'react-native-device-info';
import { NetworkProvider } from '@siga/context/networkProvider';
import { ConnectionStatusModal } from '@siga/components/ConnectionStatusModal';
import { NavigationContainerRef } from '@react-navigation/native';
import RNUxcam from 'react-native-ux-cam';
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const routingInstrumentation = Sentry.reactNavigationIntegration({
  routeChangeTimeoutMs: 500, // How long it will wait for the route change to complete.
});

const sentryEnv = Config.SENTRY_ENV;
const config = {
  enabled: true, // true para produccion
  debug: false, //false para produccion
  environment: 'production', // 'production' | 'development' para produccion
};

if (sentryEnv === 'production') {
  Sentry.init({
    dsn: Config.SENTRY_DNS,
    release: `${getBundleId()}@${getVersion()}+${getBuildNumber()}`,
    ...config,
    integrations: [routingInstrumentation],
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}


const App = () => {
  if (sentryEnv === 'production') {
    RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
    const uxCamKey = Config.UX_CAM;
    if (uxCamKey) {
      const configuration = {
        userAppKey: uxCamKey,
        enableAutomaticScreenNameTagging: true,
        enableImprovedScreenCapture: true,
      };
      RNUxcam.startWithConfiguration(configuration);
    }
  }

  return (
    <ThemeProvider>
      <NetworkProvider>
        <ToastProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ToastProvider>
        <ConnectionStatusModal />
      </NetworkProvider>
    </ThemeProvider>
  );
};

export default sentryEnv === 'production' ? Sentry.wrap(App) : App;

