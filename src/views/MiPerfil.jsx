/**
 * Componente MiPerfil - Página de perfil de usuario
 * 
 * Este componente renderiza la página de perfil del usuario en Librio.
 * Incluye información personal, foto de perfil y descripción del vendedor.
 * Utiliza componentes modulares (Navbar y Footer) y React Bootstrap.
 */

import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image
} from 'react-bootstrap';
import '../assets/styles/MiPerfil.css';

/**
 * Componente funcional MiPerfil
 */
const MiPerfil = () => {

  // ====== ESTADO DEL COMPONENTE ======
  // Estado para manejar la información del usuario
  const [usuario] = useState({
    nombre: 'John Doe',                    // Nombre del usuario
    email: 'john@gmail.com',               // Email del usuario
    descripcion: 'Soy John Doe, y te doy la bienvenida a mi selección de libros en Librio. Mi objetivo no es solo vender libros, sino asegurar que cada volumen encuentre el lector adecuado que sepa apreciar su valor.'
  });

  /**
   * Maneja la carga de imagen de perfil
   * TODO: Implementar funcionalidad de carga de imagen
   */
  const handleImageUpload = () => {
    // TODO: Abrir selector de archivos
    // TODO: Validar formato de imagen
    // TODO: Subir imagen al servidor
    // TODO: Actualizar estado con nueva imagen
  };

  return (
    <>
      {/* ====== NAVEGACIÓN ====== */}

      {/* ====== CONTENIDO PRINCIPAL ====== */}
      <div className="perfil-container">
        <main className="perfil-main">
          <Container>

            {/* ====== INFORMACIÓN DEL USUARIO ====== */}
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8} xl={6}>

                {/* Tarjeta principal del perfil */}
                <Card className="perfil-card">
                  <Card.Body className="p-4 p-md-5">

                    {/* ====== SECCIÓN FOTO DE PERFIL ====== */}
                    <div className="text-center mb-4">
                      {/* Contenedor circular para foto de perfil */}
                      <div className="perfil-imagen-container">
                        <div className="perfil-imagen">
                          {/* Icono de usuario por defecto */}
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="user-icon"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* ====== INFORMACIÓN PERSONAL ====== */}
                    <div className="text-center mb-4">
                      {/* Nombre del usuario */}
                      <h2 className="perfil-nombre">
                        {usuario.nombre}
                      </h2>

                      {/* Email del usuario */}
                      <p className="perfil-email">
                        {usuario.email}
                      </p>
                    </div>

                    {/* ====== SECCIÓN DE CONTENIDO PRINCIPAL ====== */}
                    <Row className="align-items-center">

                      {/* ====== CARGAR IMAGEN ====== */}
                      <Col md={6} className="mb-3 mb-md-0">
                        <div className="cargar-imagen-section">
                          {/* Título de la sección */}
                          <h4 className="seccion-titulo">
                            Cargar Imagen
                          </h4>

                          {/* Botón de carga con icono */}
                          <Button
                            className="cargar-imagen-btn"
                            onClick={handleImageUpload}
                          >
                            {/* Icono de subida */}
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="upload-icon me-2"
                            >
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              <path d="M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
                            </svg>
                            {/* Texto del botón */}
                            <span>Subir Imagen</span>
                          </Button>
                        </div>
                      </Col>

                      {/* ====== SOBRE MÍ ====== */}
                      <Col md={6}>
                        <div className="sobre-mi-section">
                          {/* Título de la sección */}
                          <h4 className="seccion-titulo">
                            Sobre mí
                          </h4>

                          {/* Descripción del usuario */}
                          <p className="descripcion-texto">
                            {usuario.descripcion}
                          </p>
                        </div>
                      </Col>
                    </Row>

                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>

      {/* ====== FOOTER ====== */}
    </>
  );
};

// Exportación por defecto del componente
export default MiPerfil;