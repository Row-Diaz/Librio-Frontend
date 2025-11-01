import { Container } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="text-center">
        <h2 className="footer-title">LIBRIO</h2>
        <p className="footer-text">© Librio - Todos los derechos reservados</p>
      </Container>
    </footer>
  );
};

export default Footer;
