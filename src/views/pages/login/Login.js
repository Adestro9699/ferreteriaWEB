import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'src/actions/authActions'; // Importa la acción de autenticación
import apiClient from '../../../services/apiClient'; // Importa el cliente Axios personalizado
import './Login.css'; // Importar los estilos CSS
import { ferreteriaLogo } from 'src/assets/brand/ferreteria-logo'; // Importar el logo personalizado
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage,
  CCardTitle,
  CCardText,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese usuario y contraseña');
      setLoading(false);
      return;
    }

    try {
      // Enviar las credenciales al backend para iniciar sesión
      const response = await apiClient.post('/usuarios/login', {
        nombreUsuario: username,
        contrasena: password,
      });

      // Extraer la respuesta del backend
      const { token, usuario, rol, permisos } = response.data;

      // Extraer solo los campos necesarios del usuario y el trabajador
      const userData = {
        idUsuario: usuario.idUsuario,
        nombreUsuario: usuario.nombreUsuario,
      };

      const trabajadorData = usuario.trabajador ? {
        idTrabajador: usuario.trabajador.idTrabajador,
        nombreTrabajador: usuario.trabajador.nombreTrabajador,
      } : null;

      // Almacenar los datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('trabajador', JSON.stringify(trabajadorData));
      localStorage.setItem('rol', rol); // Guardar como 'rol' en localStorage
      localStorage.setItem('permissions', JSON.stringify(permisos || {}));
      
      // Iniciar sesión activa en sessionStorage
      sessionStorage.setItem('sessionActive', 'true');

      // Actualizar el estado de autenticación en Redux
      dispatch(
        loginSuccess({
          token, // Token JWT
          user: userData, // Solo el id y nombre del usuario
          trabajador: trabajadorData, // Solo el id y nombre del trabajador
          role: rol, // Rol del usuario (note que aquí se usa 'role' para el Redux store)
          permissions: permisos || {}, // Permisos del usuario (o un objeto vacío si es null)
        })
      );

      // Redirigir al usuario al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales inválidas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={10} lg={8} xl={6}>
            {/* Logo y título */}
            <div className="text-center mb-4">
              <div className="mb-3" style={{ maxWidth: '120px', margin: '0 auto' }}>
                <div dangerouslySetInnerHTML={{ __html: ferreteriaLogo[1] }} />
              </div>
              <h1 className="login-title mb-1">Ferretería SemGar</h1>
              <p className="login-subtitle">Sistema de Gestión</p>
            </div>
            
            {/* Tarjeta de login */}
            <CCard className="login-card shadow-lg border-0 rounded-3 overflow-hidden">
              <CRow className="g-0">
                {/* Formulario de login */}
                <CCol xs={12} md={7} className="order-md-1">
                  <CCardBody className="p-4 p-md-5">
                    <CCardTitle tag="h2" className="mb-4 fw-bold text-center text-md-start">
                      Iniciar sesión
                    </CCardTitle>
                    
                    {error && (
                      <CAlert color="danger" className="mb-4">
                        {error}
                      </CAlert>
                    )}
                    
                    <CForm onSubmit={handleSubmit}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilUser} className="input-icon" />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Usuario"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                          autoComplete="username"
                          required
                        />
                      </CInputGroup>
                      
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} className="input-icon" />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          autoComplete="current-password"
                          required
                        />
                      </CInputGroup>
                      
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <CButton 
                          color="primary" 
                          type="submit" 
                          className={`btn-login px-4 py-2 mb-3 mb-md-0 ${!loading ? 'pulse-animation' : ''}`}
                          disabled={loading}
                        >
                          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </CButton>
                        
                        <CButton color="link" className="text-decoration-none px-0">
                          ¿Olvidó su contraseña?
                        </CButton>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCol>
                
                {/* Imagen lateral / Bloque de registro */}
                <CCol xs={12} md={5} className="login-banner bg-primary text-white order-md-2">
                  <div className="h-100 p-4 p-md-5 d-flex flex-column justify-content-center text-center">
                    <div className="d-none d-md-block">
                      {/* Versión para escritorio */}
                      <h2 className="mb-3 fw-bold">Bienvenido</h2>
                      <p className="mb-4">
                        Sistema integral para la gestión de inventario, ventas, compras y más
                      </p>
                      <div className="mb-4">
                        <p className="mb-2">¿No tienes una cuenta?</p>
                        <Link to="/register">
                          <CButton color="light" className="px-4 fw-bold">
                            Regístrate ahora
                          </CButton>
                        </Link>
                      </div>
                    </div>
                    <div className="d-block d-md-none">
                      {/* Versión para móvil */}
                      <h2 className="mb-2 fw-bold">Bienvenido al Sistema</h2>
                      <p className="mb-3">
                        Gestión integral para su ferretería
                      </p>
                      <div className="mb-3">
                        <Link to="/register">
                          <CButton color="light" size="sm" className="px-3 fw-bold">
                            Crear cuenta
                          </CButton>
                        </Link>
                      </div>
                    </div>
                    <p className="mt-auto mb-0">
                      <small>© 2025 Ferretería SemGar</small>
                    </p>
                  </div>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;