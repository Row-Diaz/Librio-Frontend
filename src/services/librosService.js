import { api } from './api';

// Datos de respaldo si el backend falla
const LIBROS_BACKUP = [];

// Helper para despertar backend
const wakeUpBackend = async () => {
  try {
    await fetch('https://backup-librio-backend.onrender.com/health', { method: 'GET', mode: 'cors' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function para reintentar requests con delay
const retryRequest = async (requestFn, retries = 2, delay = 3000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ERR_CONNECTION_RESET' ||
                            error.message === 'Network Error';
      
      if (i < retries && isNetworkError) {
        console.log(`í´„ Reintento ${i + 1}/${retries}...`);
        
        // Despertar backend en el primer reintento
        if (i === 0) {
          console.log('â³ Despertando backend...');
          await wakeUpBackend();
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export const librosService = {
  // GET /libros - Obtener todos los libros
  async getAllLibros() {
    try {
      const response = await retryRequest(() => api.get('/libros'));
      
      // Guardar en backup para futuras cargas
      if (response.data && response.data.length > 0) {
        localStorage.setItem('libros_backup', JSON.stringify(response.data));
      }
      
      return { success: true, libros: response.data };
    } catch (error) {
      console.warn('Backend no disponible, usando datos locales');
      
      // Intentar cargar desde localStorage
      const backup = localStorage.getItem('libros_backup');
      if (backup) {
        const libros = JSON.parse(backup);
        return { success: true, libros, fromCache: true };
      }
      
      const message = error.response?.data?.message || 'Error al obtener libros';
      return { success: false, error: message };
    }
  },

  // GET /libros/:id - Obtener un libro por ID
  async getLibroById(id) {
    try {
      const response = await retryRequest(() => api.get(`/libros/${id}`));
      return { success: true, libro: response.data };
    } catch (error) {
      // Buscar en backup local
      const backup = localStorage.getItem('libros_backup');
      if (backup) {
        const libros = JSON.parse(backup);
        const libro = libros.find(l => l.id_libros === parseInt(id));
        if (libro) {
          return { success: true, libro, fromCache: true };
        }
      }
      
      const message = error.response?.data?.message || 'Error al obtener el libro';
      return { success: false, error: message };
    }
  },

  // POST /libros - Agregar un nuevo libro (requiere admin)
  async createLibro(libroData) {
    try {
      const backendData = {
        titulo: libroData.titulo,
        autor: libroData.autor,
        editorial: libroData.editorial,
        anio_publicacion: String(libroData.aÃ±o).substring(0, 4),
        genero: libroData.genero,
        descripcion: libroData.descripcion,
        precio: parseFloat(libroData.precio),
        url_img: libroData.urlImagen
      };

      const response = await retryRequest(() => api.post('/libros', backendData));
      return { success: true, libro: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Error al crear el libro';
      return { success: false, error: message };
    }
  },

  // DELETE /libros/:id - Eliminar un libro (requiere admin)
  async deleteLibro(id) {
    try {
      await retryRequest(() => api.delete(`/libros/${id}`));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar el libro';
      return { success: false, error: message };
    }
  },

  normalizeLibroFromBackend(libro) {
    return {
      id: libro.id_libros,
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      aÃ±o: libro.anio_publicacion,
      genero: libro.genero,
      descripcion: libro.descripcion,
      precio: libro.precio,
      urlImagen: libro.url_img,
      fechaPublicacion: libro.created_at || libro.fecha_publicacion
    };
  },

  async searchLibros(query) {
    try {
      const result = await this.getAllLibros();
      if (!result.success) return result;

      const filteredLibros = result.libros.filter(libro =>
        libro.titulo.toLowerCase().includes(query.toLowerCase()) ||
        libro.autor.toLowerCase().includes(query.toLowerCase()) ||
        libro.genero.toLowerCase().includes(query.toLowerCase())
      );

      return { success: true, libros: filteredLibros };
    } catch (error) {
      return { success: false, error: 'Error al buscar libros' };
    }
  }
};
