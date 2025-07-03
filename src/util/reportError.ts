import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

export function reportError(error: any) {
  if (Config.SENTRY_ENV === 'production') {
    Sentry.captureException(error, {
      extra: {
        // Aseguramos que los datos de la respuesta se serialicen como JSON
        responseData: error?.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No response data',
      },
    });
    Sentry.captureMessage(error?.response?.data?.message ?? error?.message ?? 'Error desconocido', 'error');
  } else {
    console.error('❌ [DEBUG ERROR]:', error);
  }
}
