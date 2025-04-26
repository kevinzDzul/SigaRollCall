import React from 'react';
import { AuthProvider } from '@siga/context/authProvider';
import { ThemeProvider } from '@siga/context/themeProvider';
import { ToastProvider } from '@siga/context/toastProvider';
import RootNavigator from '@siga/navigation/RootNavigator';
import * as Sentry from '@sentry/react-native';

const isProduction = false;
const config = {
  enabled: true, // true para produccion
  debug: false, //false para produccion
  environment: 'production', // 'production' | 'development' para produccion
};

if (isProduction) {
  Sentry.init({
    dsn: 'https://3cfa9ad43ede4cdbf73a516f0684d717@o4509216713474048.ingest.us.sentry.io/4509216717275136',
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

export default isProduction ? Sentry.wrap(App) : App;

