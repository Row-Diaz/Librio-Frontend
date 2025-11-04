// Vista de registro: controla formulario, valida y simula envío
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"; // UI
import { Link } from "react-router-dom"; // Navegación
import "../assets/styles/RegistroUsuario.css"; // Estilos

const RegistroUsuario = () => {
  // Estado controlado del formulario de registro
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Errores por campo

  // Actualiza el campo editado y limpia su error si existía
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validación básica de campos (nombre, email con regex y longitud mínima de password)
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es obligatorio.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del email no es válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return newErrors;
  };

  // Envía el formulario si es válido (aquí sólo se loggea como demostración)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Formulario válido, enviando datos:", formData);
  };

  return (
    <div className="registro-container">
      <main className="registro-main">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <Card className="registro-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div className="registro-logo">
                      <img
                        src="/images/logo.PNG"
                        alt="Librio Logo"
                        className="logo-image-large"
                      />
                    </div>
                  </div>

                  <h2 className="registro-title text-center mb-4">
                    Regístrate
                  </h2>
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="registro-label">
                        Nombre Completo
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        isInvalid={!!errors.nombreCompleto}
                        className="registro-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombreCompleto}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="registro-label">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        className="registro-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="registro-label">
                        Contraseña
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        className="registro-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid mb-4">
                      <Button
                        type="submit"
                        className="registro-button"
                        size="lg"
                      >
                        Registrarse
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="login-text">
                        ¿Tienes una cuenta?{" "}
                        <Link to="/iniciar-sesion" className="login-link">
                          Inicia Sesión
                        </Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default RegistroUsuario;
