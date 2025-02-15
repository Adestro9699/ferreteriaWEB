import React from 'react';
import { useSelector } from 'react-redux'; // Importa el hook de Redux
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Obtener el estado de autenticación
  const userRole = useSelector((state) => state.auth.role); // Obtener el rol del usuario
  const userPermissions = useSelector((state) => state.auth.permissions); // Obtener los permisos del usuario

  // Logs para verificar el estado global
  console.log('Estado de autenticación:', isAuthenticated);
  console.log('Rol del usuario:', userRole);
  console.log('Permisos del usuario:', userPermissions);

  // Función auxiliar para verificar permisos
  const hasPermission = (requiredPermission) => {
    const result = userRole === 'ADMIN' || userPermissions?.[requiredPermission];
    console.log(`Verificando permiso para ${requiredPermission}:`, result);
    return !!result; // Asegura que siempre devuelva `true` o `false`
  };

  // Estructura del menú
  const menuStructure = {
    inventario: ['/producto', '/categorias', '/proveedores', '/movimientos'],
    facturacion: ['/venta', '/lis-tventas', '/compras', '/cotizaciones', '/trans'], 
    clientes: ['/clientes', '/creditos'],
    usuarios: ['/usuarios', '/roles', '/cajas'],
    reportes: ['/reportes-ventas', '/reportes-compras', '/reportes-inventario', '/reportes-transferencias'],
    configuracion: ['/empresa', '/impuestos', '/backup'],
    extras: ['/notificaciones', '/calendario', '/soporte'],
  };

  // Lista de elementos del menú
  const rawItems = [
    {
      component: CNavItem,  
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated, // Todos los usuarios autenticados pueden ver el dashboard   
    },
    {
      component: CNavTitle,
      name: 'Inventario',
      show: isAuthenticated && (hasPermission('/producto') || hasPermission('/categorias')),
    },
    {
      component: CNavItem,
      name: 'Productos',
      to: '/producto',
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/producto'),
    },
    {
      component: CNavItem,
      name: 'Categorías',
      to: '/categorias',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/categorias'),
    },
    {
      component: CNavItem,
      name: 'Proveedores',
      to: '/proveedor',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/proveedores'),
    },
    {
      component: CNavItem,
      name: 'Movimientos',
      to: '/movimientos',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/movimientos'),
    },
    {
      component: CNavTitle,
      name: 'Facturacion',
      show: isAuthenticated && (hasPermission('/venta') || hasPermission('/compras')),
    },
    {
      component: CNavItem,
      name: 'Ventas',
      to: '/venta',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/venta'),
    },
    {
      component: CNavItem,
      name: 'Lista Ventas',
      to: '/listventas',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/list-ventas'),
    },
    {
      component: CNavItem,
      name: 'Cotizaciones',
      to: '/cotizaciones',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/cotizaciones'),
    },
    {
      component: CNavItem,
      name: 'Compras',
      to: '/compras',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/compras'),
    },
    {
      component: CNavItem,
      name: 'Transferencias',
      to: '/trans',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/transferencias'),
    },
    {
      component: CNavTitle,
      name: 'Clientes',
      show: isAuthenticated && hasPermission('/clientes'),
    },
    {
      component: CNavItem,
      name: 'Lista de Clientes',
      to: '/clientes',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/listclientes'),
    },
    {
      component: CNavItem,
      name: 'Créditos',
      to: '/creditos',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/creditos'),
    },
    {
      component: CNavTitle,
      name: 'Usuarios y Permisos',
      show: isAuthenticated && hasPermission('/usuarios'),
    },
    {
      component: CNavItem,
      name: 'Usuarios',
      to: '/usuarios',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/usuarios'),
    },
    {
      component: CNavItem,
      name: 'Roles y Permisos',
      to: '/roles',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/roles'),
    },
    {
      component: CNavItem,
      name: 'Cajas',
      to: '/cajas',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/cajas'),
    },
    {
      component: CNavTitle,
      name: 'Reportes',
      show: isAuthenticated && (hasPermission('/reportesVentas') || hasPermission('/reportesCompras') || hasPermission('/reportesInventario')),
    },
    {
      component: CNavItem,
      name: 'Reportes de Ventas',
      to: '/reportes-ventas',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/reportes-ventas'),
    },
    {
      component: CNavItem,
      name: 'Reportes de Compras',
      to: '/reportes-compras',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/reportesCompras'),
    },
    {
      component: CNavItem,
      name: 'Reportes de Inventario',
      to: '/reportes-inventario',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/reportesInventario'),
    },
    {
      component: CNavItem,
      name: 'Reportes de Transferencias',
      to: '/reportes-transferencias',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/reportesTransferencias'),
    },
    {
      component: CNavTitle,
      name: 'Configuración',
      show: isAuthenticated && hasPermission('/configuracion'),
    },
    {
      component: CNavItem,
      name: 'Empresa',
      to: '/empresa',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/empresa'),
    },
    {
      component: CNavItem,
      name: 'Parametría/Impuestos',
      to: '/impuestos',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/impuestos'),
    },
    {
      component: CNavItem,
      name: 'Backup',
      to: '/backup',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/backup'),
    },
    {
      component: CNavTitle,
      name: 'Extras',
      show: isAuthenticated && (hasPermission('/notificaciones') || hasPermission('/calendario') || hasPermission('/soporte')),
    },
    {
      component: CNavItem,
      name: 'Notificaciones',
      to: '/notificaciones',
      icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/notificaciones'),
    },
    {
      component: CNavItem,
      name: 'Calendario',
      to: '/calendario',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/calendario'),
    },
    {
      component: CNavItem,
      name: 'Soporte',
      to: '/soporte',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      show: isAuthenticated && hasPermission('/soporte'),
    },
  ];

  // Filtra las rutas basadas en los permisos del usuario
  const filteredItems = rawItems.filter((item) => {
    if (!isAuthenticated) {
      console.log('Usuario no autenticado. Ocultando todos los elementos.');
      return false; // Si no está autenticado, ocultar todo
    }
    if (userRole === 'ADMIN') {
      console.log('Usuario es ADMIN. Mostrando todos los elementos.');
      return true; // Si es ADMIN, mostrar todo
    }
    if (Object.keys(userPermissions).length === 0) {
      console.log('Usuario sin permisos. Mostrando solo el dashboard.');
      return item.to === '/dashboard'; // Si el usuario tiene permisos vacíos, solo mostrar el dashboard
    }

    // Para títulos principales, verificar si tienen subelementos visibles
    if (item.component === CNavTitle) {
      const relatedPermissions = menuStructure[item.name.toLowerCase()];
      if (!relatedPermissions) {
        console.log(`No se encontraron permisos para el título "${item.name}"`);
        return false;
      }
      const isVisible = relatedPermissions.some((perm) => userPermissions[perm]);
      console.log(`Título principal "${item.name}" visible:`, isVisible);
      return isVisible;
    }

    // Para otros elementos, verificar los permisos directamente
    const requiredPermission = item.to;
    const isVisible = !requiredPermission || userPermissions[requiredPermission];
    console.log(`Elemento "${item.name}" visible:`, isVisible);
    return isVisible;
  });

  console.log('Elementos filtrados del menú:', filteredItems);
  return filteredItems.map(({ show, ...rest }) => rest); // Elimina la propiedad `show`
};

export default _nav;