import axios from 'axios';

// Configuración base de la API
// Vite usa import.meta.env en lugar de process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Request con token JWT');
    } else {
      console.log('📤 Request sin autenticación');
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró o no es válido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Opcional: redirigir a login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;