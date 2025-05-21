import axios from 'axios';
import { config } from '../config';

// Creamos una instancia de axios con una configuración base
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Desactivamos credenciales para solucionar problemas CORS
});

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (Unauthorized), podríamos redireccionar al usuario al login
    if (error.response && error.response.status === 401) {
      // Podríamos limpiar el localStorage aquí si es necesario
      // localStorage.removeItem('user');
      // O podríamos emitir un evento que el AuthContext pueda escuchar
      // window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
