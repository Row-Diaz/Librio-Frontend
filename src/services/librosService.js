import { api } from './api';

// Helper function para reintentar requests con delay
const retryRequest = async (requestFn, retries = 2, delay = 2000) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      console.log(`Reintentando... (${retries} intentos restantes)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retries - 1, delay);
    }
    throw error;
  }
};

export const librosService = {
  // GET /libros - Obtener todos los libros
  async getAllLibros() {
    try {
      const response = await retryRequest(() => api.get('/libros'));
      return { success: true, libros: response.data };
    } catch (error) {
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
        anio_publicacion: String(libroData.año).substring(0, 4),
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
      año: libro.anio_publicacion,
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
