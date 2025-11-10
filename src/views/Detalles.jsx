import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Spinner } from "react-bootstrap";
import { useLibros } from "../context/LibrosContext";
import { useCart } from "../context/CartContext";
import "../assets/styles/Detalles.css";

const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { libros, isLoading: isLoadingLibros } = useLibros();
  const { addToCart } = useCart();

  const [libro, setLibro] = useState(null);

  useEffect(() => {
    if (libros.length > 0) {
      // Convertir ambos IDs a string para comparación
      const libroEncontrado = libros.find((item) => String(item.id) === String(id));
      
      if (libroEncontrado) {
        setLibro(libroEncontrado);
      } else {
        navigate("/galeria");
      }
    }
  }, [id, libros, navigate]);

  const handleAgregarAlCarrito = () => {
    if (libro) {
      addToCart(libro);
      navigate("/carrito");
    }
  };

  if (isLoadingLibros || !libro) {
    return (
      <div className="detalles-loading-container">
        <Spinner animation="border" variant="light" />
        <p className="mt-3">Cargando detalles del libro...</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="detalles-pagina-container">
      <Container>
        <Button
          variant="outline-light"
          onClick={() => navigate("/galeria")}
          className="mb-4"
        >
          ← Volver a la Galería
        </Button>

        <Row className="detalles-content-wrapper">
          <Col md={5} lg={4} className="detalles-img-col">
            <Image
              src={libro.urlImagen}
              alt={`Portada de ${libro.titulo}`}
              className="detalles-img"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/400x600/8b5a8c/ffffff?text=Sin+Imagen";
              }}
            />
          </Col>

          <Col md={7} lg={8} className="detalles-info-col">
            <h1 className="detalles-titulo">{libro.titulo}</h1>
            <h2 className="detalles-autor">por {libro.autor}</h2>

            <p className="detalles-descripcion">
              {libro.descripcion || "No hay descripción disponible."}
            </p>

            <div className="detalles-metadata">
              <span>
                <strong>Año:</strong> {libro.año}
              </span>
              <span>
                <strong>Editorial:</strong> {libro.editorial || "N/A"}
              </span>
              <span>
                <strong>Género:</strong> {libro.genero || "N/A"}
              </span>
            </div>

            <div className="detalles-precio-y-accion">
              <span className="detalles-precio">
                {formatNumber(libro.precio)}
              </span>
              <Button
                className="detalles-btn-agregar"
                size="lg"
                onClick={handleAgregarAlCarrito}
              >
                Agregar al carrito
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Detalles;
