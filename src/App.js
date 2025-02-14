import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner } from '@coreui/react';
import './scss/style.scss';

// Componentes lazy-loaded
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  // Obtener el estado de autenticación y el rol desde Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const userPermissions = useSelector((state) => state.auth.permissions);

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