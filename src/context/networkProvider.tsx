import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import { useAuth } from './authProvider';
import Config from 'react-native-config';
import { navigationRef } from '../../App';

interface NetworkContextData {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextData>({ isConnected: true });

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const netInfo = useNetInfo();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(true);
  const wasConnected = useRef(true);

  useEffect(() => {
    // No actualizamos el estado si isConnected es null (estado inicial/indeterminado).
    // Esto previene que el modal aparezca al iniciar la app.
    if (netInfo.isConnected === null) {
      return;
    }

    // Consideramos que no hay conexión si isConnected es false o si isInternetReachable es explícitamente false.
    // isInternetReachable puede ser null al inicio, lo cual no significa que no haya conexión.
    const hasConnection = netInfo.isConnected === true && netInfo.isInternetReachable !== false;
    setIsConnected(hasConnection);

    // Detectar la transición de conectado a desconectado y solo reportar en producción
    if (wasConnected.current && !hasConnection && Config.SENTRY_ENV === 'production') {
      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name ?? 'Unknown';

      const cellularGeneration = netInfo.type === 'cellular' && netInfo.details?.cellularGeneration
        ? netInfo.details.cellularGeneration
        : 'unknown';

      Sentry.captureEvent({
        message: 'Conexión a Internet perdida',
        level: 'warning',
        tags: {
          'network.type': netInfo.type,
          'network.cellular_generation': cellularGeneration,
          'screen': currentRouteName,
        },
        extra: {
          'NetInfo State': {
            type: netInfo.type,
            isInternetReachable: netInfo.isInternetReachable,
            details: netInfo.details,
          },
          'User Context': {
            id: user?.idEmpleado,
            name: user?.username,
            profile: user?.profile,
          },
          'Active Screen': currentRouteName,
        }
      });
    }

    wasConnected.current = hasConnection;
  }, [netInfo, user]);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextData => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
