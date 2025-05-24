import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

// Componente de carga
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <CSpinner color="primary" />
  </div>
);

// Componente de error
const ErrorFallback = ({ error }) => (
  <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <h3 className="text-danger mb-3">Error al cargar el módulo</h3>
    <p className="text-muted">{error?.message || 'Ha ocurrido un error inesperado'}</p>
    <button 
      className="btn btn-primary mt-3"
      onClick={() => window.location.reload()}
    >
      Reintentar
    </button>
  </div>
);

// Clase ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en el componente:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Importaciones dinámicas
const Login = lazy(() => import('./views/pages/login/Login'));
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'));
const Producto = lazy(() => import('./views/producto/producto'));
const Categoria = lazy(() => import('./views/categorias/categorias'));
const Proveedor = lazy(() => import('./views/proveedor/proveedor'));
const Venta = lazy(() => import('./views/venta/venta'));
const Usuario = lazy(() => import('./views/usuarios/usuario'));
const Cliente = lazy(() => import('./views/cliente/cliente'));
const RolesYPermisos = lazy(() => import('./views/rolesYpermisos/rolesYpermisos'));
const Caja = lazy(() => import('./views/caja/caja'));
const Empresa = lazy(() => import('./views/empresa/empresa'));
const ListarVenta = lazy(() => import('./views/listarVenta/listarVenta'));
const DetalleVentaPage = lazy(() => import('./components/listarVentaComp/DetalleVentaPage'));
const Utilidad = lazy(() => import('./views/utilidad/utilidad'));
const Compra = lazy(() => import('./views/compra/compra'));
const Cotizacion = lazy(() => import('./views/cotizacion/cotizacion'));
const DetalleCotizacion = lazy(() => import('./components/cotizacionComp/DetalleCotizacionPage'));

// Componente que envuelve un componente lazy con ErrorBoundary y Suspense
const LazyComponent = ({ component: Component }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

const routes = [
  { path: '/', element: <Navigate to="/login" /> },
  { 
    path: '/login', 
    element: <LazyComponent component={Login} />
  },
  { 
    path: '/dashboard', 
    element: <LazyComponent component={Dashboard} />
  },
  { 
    path: '/producto', 
    element: <LazyComponent component={Producto} />
  },
  { 
    path: '/categorias', 
    element: <LazyComponent component={Categoria} />
  },
  { 
    path: '/proveedor', 
    element: <LazyComponent component={Proveedor} />
  },
  { 
    path: '/venta', 
    element: <LazyComponent component={Venta} />
  },
  { 
    path: '/usuario', 
    element: <LazyComponent component={Usuario} />
  },
  { 
    path: '/cliente', 
    element: <LazyComponent component={Cliente} />
  },
  { 
    path: '/rolesYpermisos/:usuarioId?', 
    element: <LazyComponent component={RolesYPermisos} />
  },
  { 
    path: '/caja', 
    element: <LazyComponent component={Caja} />
  },
  { 
    path: '/empresa', 
    element: <LazyComponent component={Empresa} />
  },
  { 
    path: '/listarVenta', 
    element: <LazyComponent component={ListarVenta} />
  },
  { 
    path: '/venta/detalle/:id', 
    element: <LazyComponent component={DetalleVentaPage} />
  },
  { 
    path: '/utilidad', 
    element: <LazyComponent component={Utilidad} />
  },
  { 
    path: '/compra', 
    element: <LazyComponent component={Compra} />
  },
  { 
    path: '/cotizacion', 
    element: <LazyComponent component={Cotizacion} />
  },
  {
    path: '/cotizaciones/:id/detalle',
    element: <LazyComponent component={DetalleCotizacion} />
  }
];

export default routes;