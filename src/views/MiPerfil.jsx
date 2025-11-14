/**
 * Componente MiPerfil - Página de perfil de usuario
 * 
 * Este componente renderiza la página de perfil del usuario en Librio.
 * Incluye información personal, foto de perfil y historial de pedidos.
 * Utiliza componentes modulares (Navbar y Footer) y React Bootstrap.
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Table,
  Spinner,
  Form,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { pedidosService } from '../services/pedidosService';
import { authService } from '../services/authService';
import '../assets/styles/MiPerfil.css';

/**
 * Componente funcional MiPerfil
 */
const MiPerfil = () => {
  const { user, updateUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(true);
  const [urlImagen, setUrlImagen] = useState('');
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  /**
   * Cargar pedidos del usuario al montar el componente
   */
  useEffect(() => {
    const cargarPedidos = async () => {
      if (!user) return;
      
      try {
        setIsLoadingPedidos(true);
        const result = await pedidosService.obtenerPedidosUsuario();
        
        if (result.success) {
          setPedidos(result.pedidos);
        } else {
          console.error('Error al cargar pedidos:', result.error);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setIsLoadingPedidos(false);
      }
    };

    cargarPedidos();
  }, [user]);

  /**
   * Maneja la actualización de la foto de perfil
   */
  const handleImageUpload = async () => {
    if (!urlImagen.trim()) {
      setMensaje({ tipo: 'danger', texto: 'Por favor ingresa una URL de imagen' });
      return;
    }

    setIsUpdatingImage(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const result = await authService.actualizarFotoPerfil(urlImagen);
      
      if (result.success) {
        setMensaje({ tipo: 'success', texto: '¡Foto de perfil actualizada exitosamente!' });
        setUrlImagen('');
        // Actualizar el contexto con la nueva foto
        if (updateUser) {
          updateUser({ ...user, foto_perfil: urlImagen });
        }
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      } else {
        setMensaje({ tipo: 'danger', texto: result.error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al actualizar la foto de perfil' });
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  if (!user) {
    return null;
  }

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
                          {user.foto_perfil ? (
                            <Image 
                              src={user.foto_perfil} 
                              alt="Foto de perfil" 
                              roundedCircle 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="user-icon"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ====== INFORMACIÓN PERSONAL ====== */}
                    <div className="text-center mb-4">
                      {/* Nombre del usuario */}
                      <h2 className="perfil-nombre">
                        {user.nombre}
                      </h2>

                      {/* Email del usuario */}
                      <p className="perfil-email">
                        {user.email}
                      </p>
                    </div>

                    {/* ====== SECCIÓN DE CONTENIDO PRINCIPAL ====== */}
                    <Row className="align-items-center">

                      {/* ====== CARGAR IMAGEN ====== */}
                      <Col md={12} className="mb-4">
                        <div className="cargar-imagen-section">
                          {/* Título de la sección */}
                          <h4 className="seccion-titulo text-center mb-3">
                            Actualizar Foto de Perfil
                          </h4>

                          {/* Mensaje de feedback */}
                          {mensaje.texto && (
                            <Alert variant={mensaje.tipo} className="mb-3">
                              {mensaje.texto}
                            </Alert>
                          )}

                          {/* Formulario de URL de imagen */}
                          <Form.Group className="mb-3">
                            <Form.Label>URL de la imagen</Form.Label>
                            <Form.Control
                              type="url"
                              placeholder="https://ejemplo.com/mi-foto.jpg"
                              value={urlImagen}
                              onChange={(e) => setUrlImagen(e.target.value)}
                              disabled={isUpdatingImage}
                            />
                            <Form.Text className="text-muted">
                              Ingresa la URL de tu foto de perfil
                            </Form.Text>
                          </Form.Group>

                          {/* Botón de carga */}
                          <div className="text-center">
                            <Button
                              className="cargar-imagen-btn"
                              onClick={handleImageUpload}
                              disabled={isUpdatingImage}
                            >
                              {isUpdatingImage ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                  />
                                  Actualizando...
                                </>
                              ) : (
                                <>
                                  {/* Icono de subida */}
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="upload-icon me-2"
                                    style={{ width: '20px', height: '20px', display: 'inline-block' }}
                                  >
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                    <path d="M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
                                  </svg>
                                  {/* Texto del botón */}
                                  <span>Actualizar Foto</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Col>

                      {/* ====== HISTORIAL DE PEDIDOS ====== */}
                      <Col md={12}>
                        <div className="pedidos-section">
                          <h4 className="seccion-titulo mb-3">
                            Mis Pedidos
                          </h4>

                          {isLoadingPedidos ? (
                            <div className="text-center py-4">
                              <Spinner animation="border" variant="primary" />
                            </div>
                          ) : pedidos.length === 0 ? (
                            <p className="text-muted text-center py-4">
                              No tienes pedidos realizados aún.
                            </p>
                          ) : (
                            <Table responsive hover className="pedidos-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Fecha</th>
                                  <th>Total</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pedidos.map((pedido, index) => (
                                  <tr key={pedido.id_pedido}>
                                    <td>{index + 1}</td>
                                    <td>{formatearFecha(pedido.fecha_pedido)}</td>
                                    <td>{formatearPrecio(pedido.monto_total)}</td>
                                    <td>
                                      <span className={`badge ${pedido.estado ? 'bg-success' : 'bg-warning'}`}>
                                        {pedido.estado ? 'Completado' : 'Pendiente'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
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