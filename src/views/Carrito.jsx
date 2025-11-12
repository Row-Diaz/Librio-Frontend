import React, { useState } from "react";
import { Button, Alert, Container, Row, Col, Image } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import "../assets/styles/Carrito.css";

const Carrito = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    calculateTotal,
    clearCart,
  } = useCart();

  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [messageVariant, setMessageVariant] = useState("success");

  const formatNumber = (num) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const total = calculateTotal();

  const handleCheckout = async () => {
    setCheckoutMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCheckoutMessage("¡Compra realizada con éxito!");
      setMessageVariant("success");
      clearCart();
    } catch (error) {
      setCheckoutMessage("Error de red o el servidor no está disponible.");
      setMessageVariant("danger");
    }
  };

  return (
    <div className="carrito-pagina-container">
      <Container>
        <h2 className="carrito-titulo text-center">Carrito de Compras</h2>

        {checkoutMessage && (
          <Alert variant={messageVariant} className="my-4">
            {checkoutMessage}
          </Alert>
        )}

        {cart.length === 0 && !checkoutMessage ? (
          <p className="carrito-vacio-mensaje text-center">
            Tu carrito está vacío.
          </p>
        ) : (
          <div className="carrito-lista">
            {cart.map((item) => (
              <Row
                key={item.id}
                className="carrito-item-card align-items-center"
              >
                <Col xs={3} md={2}>
                  <Image
                    src={item.urlImagen || item.url_img}
                    alt={item.titulo}
                    className="carrito-item-img"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x120/8b5a8c/ffffff?text=Sin+Imagen";
                    }}
                  />
                </Col>

                <Col xs={5} md={6} className="carrito-item-info">
                  <h5 className="carrito-item-titulo">{item.titulo}</h5>
                  <p className="carrito-item-precio mb-1">
                    Precio unitario: {formatNumber(item.precio)}
                  </p>
                  <p className="carrito-item-cantidad-texto mb-1">
                    Cantidad: {item.count}
                  </p>
                  <p className="carrito-item-subtotal">
                    <strong>Subtotal: {formatNumber(item.precio * item.count)}</strong>
                  </p>
                </Col>

                <Col xs={4} md={4} className="carrito-item-controles">
                  <Button
                    variant="dark"
                    className="carrito-btn-control"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </Button>
                  <span className="carrito-item-cantidad">{item.count}</span>
                  <Button
                    variant="light"
                    className="carrito-btn-control"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </Button>
                </Col>
              </Row>
            ))}

            {cart.length > 0 && (
              <Row className="mt-5 justify-content-center text-center">
                <Col xs={12}>
                  <h3 className="carrito-total">
                    Total: {formatNumber(total)}
                  </h3>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    className="carrito-btn-pagar"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Pagar
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Carrito;
