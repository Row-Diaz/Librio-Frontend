// Vista para publicar (vender) un libro nuevo
import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap"; // UI
import { useLibros } from "../context/LibrosContext"; // Acción agregarLibro y estados
import "../assets/styles/Publicar.css"; // Estilos

const Publicar = () => {
  const { agregarLibro, isLoading } = useLibros();

  // Estado controlado del formulario del libro a publicar
  const [libroData, setLibroData] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    año: "",
    genero: "",
    descripcion: "",
    precio: "",
    urlImagen: "",
  });
  const [errors, setErrors] = useState({}); // Errores por campo
  const [mensaje, setMensaje] = useState(null); // Mensaje de resultado

  // Actualiza el campo editado y limpia su error si existía
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLibroData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Validaciones básicas de negocio para publicar
  const validateForm = () => {
    const newErrors = {};
    if (!libroData.titulo.trim())
      newErrors.titulo = "El título es obligatorio.";
    if (!libroData.autor.trim()) newErrors.autor = "El autor es obligatorio.";
    if (!libroData.precio) newErrors.precio = "El precio es obligatorio.";
    else if (parseFloat(libroData.precio) <= 0)
      newErrors.precio = "El precio debe ser positivo.";
    if (!libroData.año) newErrors.año = "El año es obligatorio.";
    else if (parseInt(libroData.año) > new Date().getFullYear())
      newErrors.año = "El año no puede ser futuro.";
    if (!libroData.urlImagen.trim())
      newErrors.urlImagen = "La URL de la imagen es obligatoria.";
    return newErrors;
  };

  // Envío del formulario: normaliza tipos y llama a agregarLibro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const resultado = await agregarLibro({
      ...libroData,
      precio: parseFloat(libroData.precio),
      año: parseInt(libroData.año),
    });

    if (resultado.success) {
      setMensaje("¡Libro publicado exitosamente!");
      setLibroData({
        titulo: "",
        autor: "",
        editorial: "",
        año: "",
        genero: "",
        descripcion: "",
        precio: "",
        urlImagen: "",
      });
      setErrors({});
    } else {
      setMensaje(`Error: ${resultado.error}`);
    }
  };

  return (
    <div className="publicar-pagina-container">
      <Container>
        <Card className="publicar-form-container">
          <Card.Body>
            <h2 className="publicar-titulo text-center">Vender un Libro</h2>

            {mensaje && (
              <Alert
                variant={mensaje.includes("Error") ? "danger" : "success"}
                className="mt-4"
              >
                {mensaje}
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit} className="mt-4">
              {/* Usamos los campos que definiste, no los de la imagen nueva */}
              <Form.Group className="mb-3" controlId="formTitulo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={libroData.titulo}
                  onChange={handleInputChange}
                  isInvalid={!!errors.titulo}
                  className="publicar-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.titulo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAutor">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  name="autor"
                  value={libroData.autor}
                  onChange={handleInputChange}
                  isInvalid={!!errors.autor}
                  className="publicar-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.autor}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEditorial">
                <Form.Label>Editorial</Form.Label>
                <Form.Control
                  type="text"
                  name="editorial"
                  value={libroData.editorial}
                  onChange={handleInputChange}
                  className="publicar-input"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAño">
                <Form.Label>Año</Form.Label>
                <Form.Control
                  type="number"
                  name="año"
                  value={libroData.año}
                  onChange={handleInputChange}
                  isInvalid={!!errors.año}
                  className="publicar-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.año}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGenero">
                <Form.Label>Género</Form.Label>
                <Form.Control
                  type="text"
                  name="genero"
                  value={libroData.genero}
                  onChange={handleInputChange}
                  className="publicar-input"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={libroData.descripcion}
                  onChange={handleInputChange}
                  className="publicar-input"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPrecio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={libroData.precio}
                  onChange={handleInputChange}
                  isInvalid={!!errors.precio}
                  className="publicar-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.precio}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formUrlImagen">
                <Form.Label>URL de la Imagen</Form.Label>
                <Form.Control
                  type="url"
                  name="urlImagen"
                  value={libroData.urlImagen}
                  onChange={handleInputChange}
                  isInvalid={!!errors.urlImagen}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="publicar-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.urlImagen}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  className="publicar-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="ms-2">Publicando...</span>
                    </>
                  ) : (
                    "Publicar"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Publicar;
