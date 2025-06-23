import axios from 'axios';
import { config } from '../config';

// Crear una instancia de axios con una configuración base
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false 
});

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
      // Agrega los headers de usuario para endpoints que los requieren
      const url = config.url ?? '';
      if (url.includes('/book/cover') || url.includes('/book/reviews')) {
        if (user?.id) config.headers['x-user-id'] = user.id;
        if (user?.username) config.headers['x-username'] = user.username;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;
