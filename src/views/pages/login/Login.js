import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'src/actions/authActions'; // Importa la acción de autenticación
import apiClient from '../../../services/apiClient'; // Importa el cliente Axios personalizado
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const trabajadorData = {
        idTrabajador: usuario.trabajador.idTrabajador,
        nombreTrabajador: usuario.trabajador.nombreTrabajador,
      };

      // Almacenar el token en localStorage
      localStorage.setItem('token', token);

      // Actualizar el estado de autenticación en Redux
      dispatch(
        loginSuccess({
          token, // Token JWT
          user: userData, // Solo el id y nombre del usuario
          trabajador: trabajadorData, // Solo el id y nombre del trabajador
          role: rol, // Rol del usuario
          permissions: permisos || {}, // Permisos del usuario (o un objeto vacío si es null)
        })
      );

      // Redirigir al usuario al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Credenciales inválidas. Intenta nuevamente.');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <p className="text-body-secondary">Ingresa a tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Iniciar sesión
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Olvidó contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Crea tu cuenta</h2>
                    <p>
                      Crea tu cuenta para ingresar al sistema de gestión de la Ferretería ...
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Regístrate!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;