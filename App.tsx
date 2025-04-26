import React from 'react';
import { AuthProvider } from '@siga/context/authProvider';
import { ThemeProvider } from '@siga/context/themeProvider';
import { ToastProvider } from '@siga/context/toastProvider';
import RootNavigator from '@siga/navigation/RootNavigator';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://3cfa9ad43ede4cdbf73a516f0684d717@o4509216713474048.ingest.us.sentry.io/4509216717275136',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});


export default Sentry.wrap(function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
});