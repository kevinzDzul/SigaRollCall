import React from 'react';
import { AuthProvider } from '@siga/context/authProvider';
import { ThemeProvider } from '@siga/context/themeProvider';
import { ToastProvider } from '@siga/context/toastProvider';
import RootNavigator from '@siga/navigation/RootNavigator';


export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
