// Importaciones principales de React y librerías de UI/ruteo
import React from "react";
import { Container, Navbar, Nav, Badge } from "react-bootstrap"; // Componentes de Bootstrap para construir la barra de navegación
import { Link, useNavigate } from "react-router-dom"; // Navegación interna entre rutas
import { useCart } from "../../src/context/CartContext"; // Hook del contexto de carrito para leer cantidad de items
import { useAuth } from "../../src/context/AuthContext"; // Hook del contexto de autenticación
import "./Navbar.css"; // Estilos específicos de la barra de navegación

// Componente de barra de navegación principal del sitio
const CustomNavbar = () => {
  const navigate = useNavigate();
  // Extraemos del contexto la función que calcula la cantidad de productos en el carrito
  const { obtenerCantidadTotalCarrito } = useCart();
  // Cantidad total de ítems en carrito (se actualiza cuando cambia el contexto)
  const cantidadCarrito = obtenerCantidadTotalCarrito();
  // Obtener estado de autenticación y usuario del contexto
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/images/logo.PNG"
            alt="Librio Logo"
            className="logo-image me-2"
          />
          <span className="logo-text">LIBRIO</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="custom-nav-link">
              Inicio
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/galeria" className="custom-nav-link">
                  Galería
                </Nav.Link>
                
                {/* Opción de Publicar solo visible para administradores */}
                {isAdmin() && (
                  <Nav.Link as={Link} to="/publicar" className="custom-nav-link">
                    Publicar
                  </Nav.Link>
                )}
                
                <Nav.Link
                  as={Link}
                  to="/carrito"
                  className="custom-nav-link position-relative"
                >
                  Carrito
                  {cantidadCarrito > 0 && (
                    <Badge bg="danger" pill className="carrito-badge">
                      {cantidadCarrito > 99 ? "99+" : cantidadCarrito}
                    </Badge>
                  )}
                </Nav.Link>
                
                <Nav.Link
                  as={Link}
                  to="/mi-perfil"
                  className="custom-nav-link profile-icon"
                  title={user?.nombre || "Mi Perfil"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {isAdmin() && <Badge bg="warning" pill className="ms-1" style={{fontSize: '0.6rem'}}>Admin</Badge>}
                </Nav.Link>
                
                <Nav.Link
                  className="custom-nav-link"
                  onClick={handleLogout}
                  style={{ cursor: 'pointer' }}
                >
                  Cerrar Sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/registro" className="custom-nav-link">
                  Registrate
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/iniciar-sesion"
                  className="custom-nav-link"
                >
                  Iniciar Sesión
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

