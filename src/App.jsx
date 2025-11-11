import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import IniciarSesion from "./views/IniciarSesion.jsx";
import Detalles from "./views/Detalles.jsx";
import Galeria from "./views/Galeria.jsx";
import MiPerfil from "./views/MiPerfil.jsx";
import Publicar from "./views/Publicar.jsx";
import RegistroUsuario from "./views/RegistroUsuario.jsx";
import Carrito from "./views/Carrito.jsx";
import { LibrosProvider } from "./context/LibrosContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CustomNavbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <LibrosProvider>
        <CartProvider>
          <Router>
          <div className="app-container">
            <CustomNavbar />

            <main className="content-wrap">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<IniciarSesion />} />
                <Route path="/iniciar-sesion" element={<IniciarSesion />} />
                <Route path="/registro" element={<RegistroUsuario />} />
                <Route path="/registrarse" element={<RegistroUsuario />} />
                <Route path="/mi-perfil" element={<MiPerfil />} />
                <Route path="/perfil" element={<MiPerfil />} />
                <Route path="/publicar" element={<Publicar />} />
                <Route path="/vender" element={<Publicar />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="/libros" element={<Galeria />} />
                <Route path="/detalles/:id" element={<Detalles />} />
                <Route path="/carrito" element={<Carrito />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
        </CartProvider>
      </LibrosProvider>
    </AuthProvider>
  );
}

export default App;
