import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const ENABLE_LOGS = true;

const logRequest = <D>(config: InternalAxiosRequestConfig<D>) => {
  if (ENABLE_LOGS) {
    console.log('📤 Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
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
      console.log('❌ Error Response:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.log('❌ Request Error:', error.message);
    }
  }
  return Promise.reject(error);
};

// 🎛️ Instancia tipada
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.tudominio.com',
  timeout: 10000,
});

// 🎣 Interceptores
axiosInstance.interceptors.request.use(logRequest, logError);
axiosInstance.interceptors.response.use(logResponse, logError);

export default axiosInstance;
