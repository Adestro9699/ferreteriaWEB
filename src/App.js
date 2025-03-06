import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CSpinner } from '@coreui/react';
import './scss/style.scss';
import apiClient from './services/apiClient'; // Importa tu apiClient
import { loginSuccess } from './actions/authActions'; // Importa la acción de autenticación

// Componentes lazy-loaded
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const userPermissions = useSelector((state) => state.auth.permissions);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga inicial

  // Verificar la autenticación al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // Si hay un token pero el estado no está autenticado, intenta restaurar la sesión
      apiClient.get('/user') // Endpoint para obtener los datos del usuario
        .then((response) => {
          const { user, trabajador, role, permissions } = response.data;
          dispatch(
            loginSuccess({
              token,
              user,
              trabajador,
              role,
              permissions: permissions || {},
            })
          );
        })
        .catch((error) => {
          console.error('Error al restaurar la sesión:', error);
          localStorage.removeItem('token'); // Limpiar el token si hay un error
        })
        .finally(() => {
          setIsLoading(false); // Finalizar la carga
        });
    } else {
      setIsLoading(false); // Finalizar la carga si no hay token
    }
  }, [dispatch, isAuthenticated]);

  // Mostrar un spinner mientras se verifica la autenticación
  if (isLoading) {
    return <CSpinner color="primary" />;
  }

  return (
    <HashRouter>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Redirigir al login si no está autenticado */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                Object.keys(userPermissions).length === 0 && userRole === 'USER' ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <DefaultLayout />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="*"
            element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;