import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

export function reportError(error: unknown) {
  if (Config.SENTRY_ENV === 'production') {
    Sentry.captureException(error);
  } else {
    console.error('❌[DEBUG ERROR]:', error);
  }
}
