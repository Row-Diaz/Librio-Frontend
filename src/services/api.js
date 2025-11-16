import axios from 'axios';

// Configuraci√≥n base de la API
// Vite usa import.meta.env en lugar de process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backup-librio-backend.onrender.com';

console.log('Ì¥ó API URL configurada:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para a√±adir token JWT autom√°ticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticaci√≥n
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inv√°lido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
