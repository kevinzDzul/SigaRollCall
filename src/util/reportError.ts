import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

export function reportError(error: any) {
  if (Config.SENTRY_ENV === 'production') {
    Sentry.captureException(error);
    Sentry.captureMessage(error?.response?.data?.message ?? error?.message ?? 'Error desconocido', 'error');
  } else {
    console.error('❌ [DEBUG ERROR]:', error);
  }
}
