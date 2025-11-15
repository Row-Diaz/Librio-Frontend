import { api } from './api';

export const authService = {
  // POST /login - Iniciar sesión
  async login(credentials) {
    try {
      console.log('📡 Enviando petición de login a:', '/login');
      console.log('📡 Credenciales:', { email: credentials.email, password: '***' });
      const response = await api.post('/login', credentials);
      console.log('📡 Respuesta del servidor:', response.data);
      const { token } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      
      // Decodificar token para obtener info del usuario
      const userInfo = this.decodeToken(token);
      console.log('📡 Usuario decodificado:', userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { success: true, token, user: userInfo };
    } catch (error) {
      console.error('📡 Error en login:', error);
      console.error('📡 Error response completo:', JSON.stringify(error.response?.data, null, 2));
      console.error('📡 Status:', error.response?.status);
      console.error('📡 Headers:', error.response?.headers);
      const message = error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  },

  // POST /usuarios - Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await api.post('/usuarios', userData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      return { success: false, error: message };
    }
  },

  // GET /usuarios - Obtener datos del usuario autenticado
  async getCurrentUser() {
    try {
      const response = await api.get('/usuarios');
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener datos del usuario';
      return { success: false, error: message };
    }
  },

  // GET /usuarios/:id - Obtener usuario por ID
  async getUserById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return { success: true, user: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener usuario';
      return { success: false, error: message };
    }
  },

  // Logout local
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Verificar si el token no ha expirado
    try {
      const payload = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Obtener token actual
  getToken() {
    return localStorage.getItem('token');
  },

  // Obtener usuario actual del localStorage
  getCurrentUserFromStorage() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Decodificar JWT (básico - solo payload)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  // Verificar si el usuario es administrador
  isAdmin() {
    const user = this.getCurrentUserFromStorage();
    // El token JWT del backend usa 'admin', no 'isAdmin'
    return user?.admin || user?.isAdmin || false;
  },

  /**
   * Actualizar foto de perfil del usuario autenticado
   */
  async actualizarFotoPerfil(foto_perfil) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await axios.put(
        `${API_URL}/usuarios/foto-perfil`,
        { foto_perfil },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar usuario en localStorage
      const user = this.getCurrentUserFromStorage();
      const updatedUser = { ...user, foto_perfil: response.data.foto_perfil };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, usuario: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar foto de perfil'
      };
    }
  }
};

export default authService;