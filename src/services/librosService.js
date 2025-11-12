import { api } from './api';

export const librosService = {
  // GET /libros - Obtener todos los libros
  async getAllLibros() {
    try {
      const response = await api.get('/libros');
      return { success: true, libros: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener libros';
      return { success: false, error: message };
    }
  },

  // GET /libros/:id - Obtener un libro por ID
  async getLibroById(id) {
    try {
      const response = await api.get(`/libros/${id}`);
      return { success: true, libro: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener el libro';
      return { success: false, error: message };
    }
  },

  // POST /libros - Agregar un nuevo libro (requiere admin)
  async createLibro(libroData) {
    try {
      // Mapear campos del frontend al backend
      const backendData = {
        titulo: libroData.titulo,
        autor: libroData.autor,
        editorial: libroData.editorial,
        anio_publicacion: String(libroData.año).substring(0, 4), // Asegurar 4 caracteres
        genero: libroData.genero,
        descripcion: libroData.descripcion,
        precio: parseFloat(libroData.precio),
        url_img: libroData.urlImagen // urlImagen -> url_img
      };

      const response = await api.post('/libros', backendData);
      return { success: true, libro: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Error al crear el libro';
      return { success: false, error: message };
    }
  },

  // DELETE /libros/:id - Eliminar un libro (requiere admin)
  async deleteLibro(id) {
    try {
      await api.delete(`/libros/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar el libro';
      return { success: false, error: message };
    }
  },

  // Función auxiliar para normalizar datos del backend al frontend
  normalizeLibroFromBackend(libro) {
    return {
      id: libro.id_libros, // El backend usa id_libros
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      año: libro.anio_publicacion, // anio_publicacion -> año
      genero: libro.genero,
      descripcion: libro.descripcion,
      precio: libro.precio,
      urlImagen: libro.url_img, // url_img -> urlImagen
      fechaPublicacion: libro.created_at || libro.fecha_publicacion
    };
  },

  // Función auxiliar para búsquedas y filtros (si se implementan después)
  async searchLibros(query) {
    try {
      // Por ahora obtener todos y filtrar en frontend
      // Más adelante se puede implementar en backend
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

export default librosService;