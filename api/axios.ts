import axios from "axios";
import { toast } from "react-toastify";
import { getApiConfig } from "./config";
import { clearToken, getAccessToken, getRefreshToken, setToken } from "../auth/TokenService";

const { apiUrl } = getApiConfig();

const api = axios.create({
    baseURL: apiUrl, 
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
  
      // Token expired ve retry edilmemişse
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              },
              reject,
            });
          });
        }
  
        isRefreshing = true;
  
        try {
          const refreshToken = getRefreshToken();
  
          const response = await axios.post('auth/refreshtoken', {
            refreshToken,
          });
  
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          setToken(accessToken, newRefreshToken);
          processQueue(null, accessToken);
  
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (err.response?.status === 400) {
        handle400Error(err.response.data);
        return Promise.resolve(undefined);
      }
  
      return Promise.reject(err);
    }
    
  );
  
  function handle400Error(data: any) {
    if (Array.isArray(data)) {
      data.forEach((res: { code: string; name: string }) => {
        toast.error(`${res.code}: ${res.name}`);
      });
    } else if (data?.errors && Array.isArray(data.errors)) {
      data.errors.forEach((res: { code: string; name: string }) => {
        toast.error(`${res.code}: ${res.name}`);
      });
    } else if (data?.code && data?.name) {
      toast.error(`${data.code}: ${data.name}`);
    } else {
      toast.error('Geçersiz istek. Lütfen bilgilerinizi kontrol edin.');
      console.error('Unhandled 400 error structure:', data);
    }
  }

  
export default api;
