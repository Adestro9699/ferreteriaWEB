import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CSpinner, CAlert } from '@coreui/react';
import './scss/style.scss';
import apiClient from './services/apiClient'; // Importa tu apiClient
import { loginSuccess } from './actions/authActions'; // Importa la acción de autenticación
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

// Componente de error para la carga dinámica
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  if (hasError) {
    return (
      <CAlert color="danger" className="m-3">
        <h4>Error al cargar el componente</h4>
        <p>{error?.message || 'Ha ocurrido un error inesperado'}</p>
      </CAlert>
    );
  }

  return children;
};

// Componente de carga
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <CSpinner color="primary" />
  </div>
);

//COMPONENTE QUE PERMITE UNA VISTA SE RENDERICE SI TIENE LOS PERMISOS

// Componentes lazy-loaded con manejo de errores mejorado
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const AccesoDenegado = React.lazy(() => import('./views/pages/page404/Page404'));

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
const ListarVenta = React.lazy(() => import('./views/listarVenta/listarVenta'));
const DetalleVentaPage = React.lazy(() => import('./components/listarVentaComp/DetalleVentaPage'));
const Utilidad = React.lazy(() => import('./views/utilidad/utilidad'));
const Compra = React.lazy(() => import('./views/compra/compra'));
const Cotizacion = React.lazy(() => import('./views/cotizacion/cotizacion'));
const DetalleCotizacionPage = React.lazy(() => import('./components/cotizacionComp/DetalleCotizacionPage'));
const Transferencias = React.lazy(() => import('./views/transferencias/transferencias'));
const Sucursales = React.lazy(() => import('./views/sucursales/sucursales'));
const Almacenes = React.lazy(() => import('./views/almacenes/almacenes'));
const Trabajadores = React.lazy(() => import('./views/trabajadores/trabajadores'));


const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const userPermissions = useSelector((state) => state.auth.permissions);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Verificar la autenticación al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (sessionChecked) {
      return;
    }

    if (token && !isAuthenticated) {
      setIsLoading(true);
      
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const trabajadorData = JSON.parse(localStorage.getItem('trabajador') || '{}');
        const rol = localStorage.getItem('rol');
        const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
        
        if (userData.idUsuario && rol) {
          dispatch(
            loginSuccess({
              token,
              user: userData,
              trabajador: trabajadorData,
              role: rol,
              permissions: permissions || {},
            })
          );
          
          apiClient.get('/usuarios')
            .catch((error) => {
              console.error('Token inválido detectado:', error);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('trabajador');
              localStorage.removeItem('rol');
              localStorage.removeItem('permissions');
              dispatch({ type: 'LOGOUT' });
              window.location.href = '/#/login';
            });
            
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        apiClient.get('/usuarios')
          .then((response) => {
              throw new Error('Datos de sesión incompletos, se requiere reinicio de sesión');
          })
          .catch((error) => {
            console.error('Error al restaurar la sesión:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('trabajador');
            localStorage.removeItem('rol');
            localStorage.removeItem('permissions');
            dispatch({ type: 'LOGOUT' });
            window.location.href = '/#/login';
          })
          .finally(() => {
            setIsLoading(false);
            setSessionChecked(true);
          });
      } catch (error) {
        console.error('Error al restaurar sesión desde localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('trabajador');
        localStorage.removeItem('rol');
        localStorage.removeItem('permissions');
        dispatch({ type: 'LOGOUT' });
        setIsLoading(false);
        setSessionChecked(true);
        window.location.href = '/#/login';
      }
    } else {
      setIsLoading(false);
      setSessionChecked(true);
    }
  }, [dispatch, isAuthenticated, sessionChecked]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DefaultLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/producto" element={<Producto />} />
                <Route path="/categorias" element={<Categoria />} />
                <Route path="/proveedor" element={<Proveedor />} />
                <Route path="/venta" element={<Venta />} />
                <Route path="/usuario" element={<Usuario />} />
                <Route path="/cliente" element={<Cliente />} />
                <Route path="/rolesYpermisos/:usuarioId?" element={<RolesYPermisos />} />
                <Route path="/caja" element={<Caja />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/listarVenta" element={<ListarVenta />} />
                <Route path="/venta/detalle/:id" element={<DetalleVentaPage />} />
                <Route path="/utilidad" element={<Utilidad />} />
                <Route path="/compra" element={<Compra />} />
                <Route path="/cotizacion" element={<Cotizacion />} />
                <Route path="/cotizaciones/:id/detalle" element={<DetalleCotizacionPage />} />
                <Route path="/transferencias" element={<Transferencias />} />
                <Route path="/sucursales" element={<Sucursales />} />
                <Route path="/almacenes" element={<Almacenes />} />
                <Route path="/trabajadores" element={<Trabajadores />} />
              </Route>
          </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </HashRouter>
  );
};

export default App;