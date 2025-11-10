import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const userFromStorage = authService.getCurrentUserFromStorage();
          
          if (userFromStorage) {
            setUser(userFromStorage);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        // Error silencioso, no bloquear la app
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error inesperado al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error inesperado al registrar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Refrescar datos del usuario
  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.user);
      }
    } catch (error) {
      // Error silencioso al refrescar usuario
    }
  };

  // Verificar si es administrador
  const isAdmin = () => {
    return authService.isAdmin();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;