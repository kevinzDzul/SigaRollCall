import React from 'react';
import { AuthProvider } from '@siga/context/authProvider';
import { ThemeProvider } from '@siga/context/themeProvider';
import { ToastProvider } from '@siga/context/toastProvider';
import RootNavigator from '@siga/navigation/RootNavigator';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

const sentryEnv = Config.SENTRY_ENV;
const config = {
  enabled: true, // true para produccion
  debug: false, //false para produccion
  environment: 'production', // 'production' | 'development' para produccion
};

if (sentryEnv === 'production') {
  Sentry.init({
    dsn: Config.SENTRY_DNS,
    ...config,
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default sentryEnv === 'production' ? Sentry.wrap(App) : App;

