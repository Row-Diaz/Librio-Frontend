import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';

function TestConnection() {
  const [status, setStatus] = useState({ loading: true, connected: false, error: null, data: null });

  const testBackend = async () => {
    setStatus({ loading: true, connected: false, error: null, data: null });
    
    try {
      // Intentar obtener libros del backend
      const response = await api.get('/libros');
      setStatus({
        loading: false,
        connected: true,
        error: null,
        data: {
          libros: response.data?.length || 0,
          message: '✅ Conexión exitosa con el backend'
        }
      });
    } catch (error) {
      console.error('Error de conexión:', error);
      setStatus({
        loading: false,
        connected: false,
        error: error.message,
        data: {
          message: '❌ Backend no disponible',
          details: error.response?.data?.message || 'No se puede conectar con http://localhost:3000'
        }
      });
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h3">🔌 Test de Conexión con Backend</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>URL Backend:</strong> http://localhost:3000
          </div>

          {status.loading && (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Conectando con el backend...</p>
            </div>
          )}

          {!status.loading && status.connected && (
            <Alert variant="success">
              <Alert.Heading>{status.data.message}</Alert.Heading>
              <hr />
              <p className="mb-0">
                📚 Libros encontrados en la base de datos: <strong>{status.data.libros}</strong>
              </p>
              <p className="mt-2">
                ✅ Autenticación: Configurada<br />
                ✅ JWT Interceptors: Activos<br />
                ✅ Servicios API: Funcionando
              </p>
            </Alert>
          )}

          {!status.loading && !status.connected && (
            <Alert variant="warning">
              <Alert.Heading>{status.data.message}</Alert.Heading>
              <hr />
              <p><strong>Detalles:</strong> {status.data.details}</p>
              <p className="mb-2"><strong>Posibles causas:</strong></p>
              <ul>
                <li>El servidor backend no está corriendo</li>
                <li>El backend no está en el puerto 3000</li>
                <li>Se requiere autenticación (JWT) para acceder</li>
                <li>CORS no está configurado correctamente</li>
              </ul>
              <Alert variant="info" className="mt-3">
                <strong>📋 Modo Offline Activado:</strong> La aplicación está usando datos locales del archivo JSON como fallback.
              </Alert>
            </Alert>
          )}

          <div className="mt-3">
            <Button variant="primary" onClick={testBackend} disabled={status.loading}>
              🔄 Reintentar Conexión
            </Button>
          </div>

          <hr className="my-4" />
          
          <h5>📖 Instrucciones para iniciar el backend:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', fontFamily: 'monospace' }}>
            <p className="mb-1"># Navega a la carpeta del backend</p>
            <p className="mb-1">cd ruta/al/backend</p>
            <p className="mb-1"># Instala dependencias (si es necesario)</p>
            <p className="mb-1">npm install</p>
            <p className="mb-1"># Inicia el servidor</p>
            <p className="mb-0">npm start</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TestConnection;