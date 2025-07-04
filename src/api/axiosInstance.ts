import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import Config from 'react-native-config';

const ENABLE_LOGS = Config.ENABLE_LOGS === 'true';
const isSentryProduction = Config.SENTRY_ENV === 'production';

const logRequest = <D>(config: InternalAxiosRequestConfig<D>) => {
  if (ENABLE_LOGS) {
    const { method, url, headers, data } = config;
    const logData: any = {
      method: method,
      url: url,
      headers: headers,
      data: data,
    };

    if (isSentryProduction) {
      logData.method = String(method);
      logData.headers = JSON.stringify(headers);
    }
    console.log('📤 Request:', logData);
  }
  return config;
};

const logResponse = <T>(response: AxiosResponse<T>) => {
  if (ENABLE_LOGS) {
    console.log('📥 Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
  }
  return response;
};

const logError = (error: any) => {
  if (ENABLE_LOGS) {
    if (error.response) {
      const { config, status, data } = error.response;
      const logData: any = {
        url: config?.url,
        status: status,
        data: data,
        method: config?.method,
        headers: config?.headers,
      };

      if (isSentryProduction) {
        logData.method = String(config?.method);
        logData.headers = JSON.stringify(config?.headers);
      }
      console.log('❌ Error Response:', logData);
    } else {
      console.log('❌ Request Error:', error.message);
    }
  }
  return Promise.reject(error);
};

// 🎛️ Instancia tipada
const axiosInstance: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: 30000,
});

// 🎣 Interceptores
//axiosInstance.interceptors.request.use(logRequest, logError);
//axiosInstance.interceptors.response.use(logResponse, logError);

// → Interceptores Antes de despegar la request 🚀
axiosInstance.interceptors.request.use((config) => {
  if (config.data) {config.data = snakecaseKeys(config.data, { deep: true });}
  if (config.params)
    {config.params = snakecaseKeys(config.params, { deep: true });}
  logRequest(config);
  return config;
}, logError);

// ← Interceptores Al aterrizar la response
axiosInstance.interceptors.response.use((response) => {
  response.data = camelcaseKeys(response.data, { deep: true });
  logResponse(response);
  return response;
}, logError);

export default axiosInstance;
