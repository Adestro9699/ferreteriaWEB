import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CSpinner } from '@coreui/react';
import './scss/style.scss';
import apiClient from './services/apiClient'; // Importa tu apiClient
import { loginSuccess } from './actions/authActions'; // Importa la acción de autenticación
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

//COMPONENTE QUE PERMITE UNA VISTA SE RENDERICE SI TIENE LOS PERMISOS

// Componentes lazy-loaded
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const AccesoDenegado = React.lazy(() => import('./views/pages/page404/Page404')); // Importa la página de acceso denegado

// Importar componentes de las vistas
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Producto = React.lazy(() => import('./views/producto/producto'));
const Categoria = React.lazy(() => import('./views/categorias/categorias'));
const Proveedor = React.lazy(() => import('./views/proveedor/proveedor'));
const Venta = React.lazy(() => import('./views/venta/venta'));
const Usuario = React.lazy(() => import('./views/usuarios/usuario'));
const Cliente = React.lazy(() => import('./views/cliente/cliente'));
const RolesYPermisos = React.lazy(() => import('./views/rolesYpermisos/rolesYpermisos'));
const Caja = React.lazy(() => import('./views/caja/caja'));
const Empresa = React.lazy(() => import('./views/empresa/empresa'));
const ListarVenta = React.lazy (() => import('./views/listarVenta/listarVenta'));



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
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Ruta raíz */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProtectedRoute requiredPermissions={[]}>
                  <DefaultLayout />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            {/* Rutas secundarias protegidas */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredPermissions={[]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="producto"
              element={
                <ProtectedRoute requiredPermissions={[
                  '/productos',
                  '/productos/:id:GET',
                  '/productos/:id:PUT',
                  '/productos/:id:DELETE',
                  '/productos/upload',
                  '/productos/imagen/{fileName:.+}',
                  '/categorias',
                  '/subcategorias',
                  '/proveedores',
                  '/unidades-medida']}>
                  <Producto />
                </ProtectedRoute>
              }
            />
            <Route
              path="categorias"
              element={
                <ProtectedRoute requiredPermissions={[
                  '/categorias', // Permiso para acceder a la vista de categorías
                  '/categorias/:id:GET', // Permiso para obtener una categoría por ID
                  '/categorias/:id:PUT', // Permiso para actualizar una categoría por ID
                  '/categorias/:id:DELETE', // Permiso para eliminar una categoría por ID
                  '/subcategorias', // Permiso para acceder a subcategorías
                  '/subcategorias/:id:GET', // Permiso para obtener una subcategoría por ID
                  '/subcategorias/:id:PUT', // Permiso para actualizar una subcategoría por ID
                  '/subcategorias/:id:DELETE', // Permiso para eliminar una subcategoría por ID
                ]}>
                  <Categoria />
                </ProtectedRoute>
              }
            />
            <Route
              path="proveedor"
              element={
                <ProtectedRoute requiredPermissions={[
                  '/proveedores',
                  '/proveedores/:id:GET',
                  '/proveedores/:id:PUT',
                  '/proveedores/:id:DELETE',
                ]}>
                  <Proveedor />
                </ProtectedRoute>
              }
            />
            <Route
              path="venta"
              element={
                <ProtectedRoute requiredPermissions={['/ventas', '/lista-ventas']}>
                  <Venta />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuario"
              element={
                <ProtectedRoute requiredPermissions={['/usuarios', '/rolesYpermisos']}>
                  <Usuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="cliente"
              element={
                <ProtectedRoute requiredPermissions={['/clientes', '/creditos']}>
                  <Cliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="rolesYpermisos/:usuarioId?"
              element={
                <ProtectedRoute requiredPermissions={['/rolesYpermisos', '/usuarios']}>
                  <RolesYPermisos />
                </ProtectedRoute>
              }
            />
            <Route
              path="caja"
              element={
                <ProtectedRoute requiredPermissions={[
                  '/cajas',                  
                  '/cajas/:id:GET',          
                  '/cajas/:id:PUT',         
                  '/cajas/abrir:POST',       
                  '/cajas/cerrar:POST',      
                  '/cajas/:idCaja/entrada-manual:POST', 
                  '/cajas/:idCaja/salida-manual:POST',  
                ]}>
                  <Caja />
                </ProtectedRoute>
              }
            />
            <Route
              path="empresa"
              element={
                <ProtectedRoute requiredPermissions={['/empresa']}>
                  <Empresa />
                </ProtectedRoute>
              }
            />
            <Route
              path="listarVenta"
              element={
                <ProtectedRoute requiredPermissions={['/listarVenta']}>
                  <ListarVenta />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* Ruta para manejar rutas no encontradas */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;