import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import librosData from "../views/libros.json";

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
    setIsLoading(true);
    try {
      setLibros(librosData);
    } catch (e) {
      console.error("Error al cargar datos iniciales:", e);
      setError("No se pudieron cargar los libros.");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  const agregarLibro = useCallback(async (nuevoLibroData) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nuevoLibro = {
        id: Date.now().toString(),
        ...nuevoLibroData,
        fechaPublicacion: new Date().toISOString(),
      };

      setLibros((prevLibros) => [nuevoLibro, ...prevLibros]);
      return true;
    } catch (e) {
      console.error("Error al agregar libro:", e);
      setError("No se pudo publicar el libro. Inténtalo de nuevo.");
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
  };

  return (
    <LibrosContext.Provider value={value}>{children}</LibrosContext.Provider>
  );
};
