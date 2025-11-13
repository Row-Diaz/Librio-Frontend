import {
  Container,    // Contenedor responsivo de Bootstrap
  Button,       // Botón estilizado
  Row,          // Fila del grid system
  Col,          // Columna del grid system
  Image         // Componente de imagen responsiva
} from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Para navegación

import '../assets/styles/Home.css'; // Importa los estilos específicos de Home

const Home = () => {
  return (
    // 'home-page-wrapper' para controlar el layout de toda la página
    <div className="home-page-wrapper"> 

      {/* Sección Hero: El área superior con el texto y el botón */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              <h1 className="hero-title">
                "Encuentra tu próxima gran lectura. Donde cada libro tiene una nueva historia que contar."
              </h1>
              <Button size="lg" className="cta-button" as={Link} to="/iniciar-sesion">
                Empezar
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Galería de Libros: Las imágenes debajo de la sección hero */}
      <section className="books-gallery py-5">
        <Container>
          {/* El `g-3` de Bootstrap ya añade el espacio entre columnas */}
          <Row className="g-3"> 
            
            {/* Primera Fila */}
            <Col md={6} lg={8} xs={12}>
              <Image
                src="https://res.cloudinary.com/dl6c4gbix/image/upload/f_auto,q_auto/v1762991830/escudo_oi6ruz.jpg"
                alt="Estantería de libros"
                className="gallery-image" // Clase unificada para todas las imágenes de la galería
                fluid
              />
            </Col>
            <Col md={6} lg={4} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Estantería de libros"
                className="gallery-image"
                fluid
              />
            </Col>

            {/* Segunda Fila */}
            <Col md={4} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Pila de libros"
                className="gallery-image"
                fluid
              />
            </Col>
            <Col md={4} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Libro abierto"
                className="gallery-image center-book-special" // Clase adicional para el libro central
                fluid
              />
            </Col>
            <Col md={4} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Pila de libros"
                className="gallery-image"
                fluid
              />
            </Col>

            {/* Tercera Fila */}
            <Col md={6} lg={8} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Estantería de libros"
                className="gallery-image"
                fluid
              />
            </Col>
            <Col md={6} lg={4} xs={12}>
              <Image
                src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Estantería de libros"
                className="gallery-image"
                fluid
              />
            </Col>

          </Row>
        </Container>
      </section>

    </div>
  );
};

export default Home;