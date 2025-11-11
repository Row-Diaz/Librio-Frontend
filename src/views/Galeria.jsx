import { Container, Row, Col, Card, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLibros } from "../context/LibrosContext";
import { useState, useEffect } from "react";
import "../assets/styles/Galeria.css"; // Se importa el CSS actualizado

const Galeria = () => {
  const navigate = useNavigate();
  const { libros, isLoading, error } = useLibros();
  
  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const librosPorPagina = 12;
  
  // Calcular índices para la paginación
  const indiceUltimo = paginaActual * librosPorPagina;
  const indicePrimero = indiceUltimo - librosPorPagina;
  const librosActuales = libros.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(libros.length / librosPorPagina);
  
  // Reset a página 1 cuando cambian los libros
  useEffect(() => {
    setPaginaActual(1);
  }, [libros]);
  
  const handleVerDetalles = (libroId) => {
    navigate(`/detalles/${libroId}`);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);
  };
  
  const irPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    // Contenedor principal de la página, sin padding-top
    <div className="galeria-pagina-container">
      
      {/* --- NUEVA SECCIÓN HERO --- */}
      <section className="galeria-hero-section">
        <Container>
          <Row className="mb-4">
            <Col>
              <h1 className="galeria-titulo-pagina text-center">
                Galería de Libros
              </h1>
              <p className="galeria-subtitulo-pagina text-center">
                Descubre los libros disponibles en nuestra comunidad
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- ÁREA DE LAS TARJETAS DE LIBROS --- */}
      <Container className="galeria-cards-area">
        {isLoading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando libros...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {!isLoading && !error && libros.length === 0 && (
          <Alert variant="info" className="text-center">
            No hay libros disponibles en este momento.
          </Alert>
        )}

        <Row className="justify-content-center g-4">
          {librosActuales.map((libro) => (
            <Col key={libro.id} xs={12} sm={6} md={4}>
              <Card className="galeria-card">
                <Card.Img
                  src={libro.url_img || libro.urlImagen}
                  alt={`Portada de ${libro.titulo}`}
                  className="galeria-card-img"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x500/8b5a8c/ffffff?text=Sin+Imagen";
                  }}
                />

                <div className="galeria-card-overlay">
                  <div className="galeria-card-info">
                    <span className="galeria-card-titulo">{libro.titulo}</span>
                    <span className="galeria-card-precio">
                      {formatearPrecio(libro.precio)}
                    </span>
                  </div>

                  <Button
                    className="galeria-btn-ver-mas"
                    onClick={() => handleVerDetalles(libro.id)}
                  >
                    Ver mas
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Controles de paginación */}
        {!isLoading && !error && libros.length > librosPorPagina && (
          <div className="d-flex justify-content-center align-items-center mt-5 mb-4">
            <Button
              variant="outline-primary"
              onClick={irPaginaAnterior}
              disabled={paginaActual === 1}
              className="me-3"
            >
              ← Anterior
            </Button>
            
            <span className="mx-3">
              Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
              {' '}({libros.length} libros en total)
            </span>
            
            <Button
              variant="outline-primary"
              onClick={irPaginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className="ms-3"
            >
              Siguiente →
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Galeria;
