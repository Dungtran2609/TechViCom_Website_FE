import axios from 'axios';
import { API_CONFIG, getAuthToken } from './config';

const api = axios.create({
  baseURL: API_CONFIG.getBaseURL(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
