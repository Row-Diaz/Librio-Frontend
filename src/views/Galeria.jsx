import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Galeria.css"; // Se importa el CSS actualizado
import libros from "./libros.json";

const Galeria = () => {
  const navigate = useNavigate();
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
        <Row className="justify-content-center g-4">
          {libros.map((libro) => (
            <Col key={libro.id} xs={12} sm={6} md={4}>
              <Card className="galeria-card">
                <Card.Img
                  src={libro.urlImagen}
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
      </Container>
    </div>
  );
};

export default Galeria;
