import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { librosService } from "../services/librosService";

const LibrosContext = createContext();

export const useLibros = () => {
  const context = useContext(LibrosContext);
  if (!context) {
    throw new Error("useLibros debe ser usado dentro de un LibrosProvider");
  }
  return context;
};

export const LibrosProvider = ({ children }) => {
  const [libros, setLibros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await librosService.getAllLibros();
      
      if (result.success) {
        // Normalizar datos del backend al formato del frontend
        const librosNormalizados = result.libros.map(libro => 
          librosService.normalizeLibroFromBackend(libro)
        );
        setLibros(librosNormalizados);
      } else {
        throw new Error(result.error || "No se pudieron cargar los libros.");
      }
    } catch (error) {
      console.error('Error al cargar libros desde el backend:', error);
      setError(error.message || "Error al conectar con el servidor.");
      setLibros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const agregarLibro = useCallback(async (nuevoLibroData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await librosService.createLibro(nuevoLibroData);
      
      if (result.success) {
        // Normalizar y agregar el nuevo libro al estado
        const libroNormalizado = librosService.normalizeLibroFromBackend(result.libro);
        setLibros((prevLibros) => [libroNormalizado, ...prevLibros]);
        return true;
      } else {
        setError(result.error || "No se pudo publicar el libro.");
        return false;
      }
    } catch (error) {
      setError("Error de conexión al publicar el libro.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener libro por ID
  const obtenerLibroPorId = useCallback(async (id) => {
    try {
      const result = await librosService.getLibroById(id);
      
      if (result.success) {
        return librosService.normalizeLibroFromBackend(result.libro);
      } else {
        setError(result.error);
        return null;
      }
    } catch (error) {
      setError("Error al obtener detalles del libro.");
      return null;
    }
  }, []);

  // Eliminar libro (solo admin)
  const eliminarLibro = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await librosService.deleteLibro(id);
      
      if (result.success) {
        setLibros((prevLibros) => prevLibros.filter(libro => libro.id !== id));
        return true;
      } else {
        setError(result.error || "No se pudo eliminar el libro.");
        return false;
      }
    } catch (error) {
      setError("Error de conexión al eliminar el libro.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    libros,
    isLoading,
    error,
    agregarLibro,
    obtenerLibroPorId,
    eliminarLibro,
    cargarLibros, // Para recargar desde componentes
  };

  return (
    <LibrosContext.Provider value={value}>{children}</LibrosContext.Provider>
  );
};
