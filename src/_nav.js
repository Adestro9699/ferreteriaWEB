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
  const hasPermission = (requiredPermissions) => {
    // Si el usuario es ADMIN, siempre tiene acceso
    if (userRole === 'ADMIN') return true;

    // Si requiredPermissions es un array, verificar que todos los permisos sean true
    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.every((permission) => userPermissions[permission]);
    }

    // Si requiredPermissions es un solo permiso, verificarlo directamente
    return !!userPermissions[requiredPermissions];
  };

  // Estructura del menú para mostrar el título dependiendo si hay algún subelemento activado(endpoint activados)
  const menuStructure = {
    inventario: ['/producto', '/categorias', '/proveedores', '/movimientos'],
    facturacion: ['/venta', '/lis-tventas', '/compras', '/cotizaciones', '/trans'],
    clientes: ['/clientes', '/creditos'],
    usuarios: ['/usuarios', '/rolesYpermisos', '/cajas'],
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
    },
    {
      component: CNavItem,
      name: 'Productos',
      to: '/producto',
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,

      //Esto significa que todos estos permisos deben estar habilitados para que el usuario tenga acceso completo a la vista de productos.
      permissionsRequired: ['/productos', '/categorias', '/subcategorias', '/proveedores'],
      //Determina si este elemento debe ser visible en el menú lateral.
      show: isAuthenticated && hasPermission(['/productos', '/categorias', '/subcategorias', '/proveedores']),
    },
    {
      component: CNavItem,
      name: 'Categorías',
      to: '/categorias',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      permissionsRequired: ['/categorias', '/subcategorias'],
      show: isAuthenticated && hasPermission(['/categorias', '/subcategorias']),
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
      to: '/cliente',
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
    },
    {
      component: CNavItem,
      name: 'Usuarios',
      to: '/usuario',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      permissionsRequired: ['/usuarios'],
      show: isAuthenticated && hasPermission(['/usuarios']),
    },
    {
      component: CNavItem,
      name: 'Roles y Permisos',
      to: '/rolesYpermisos',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      permissionsRequired: ['/rolesYpermisos'],
      show: isAuthenticated && hasPermission('/rolesYpermisos'),
    },
    {
      component: CNavItem,
      name: 'Cajas',
      to: '/caja',
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
    if (!isAuthenticated) return false;
    if (item.to === '/dashboard') return true;
    if (userRole === 'ADMIN') return true;
    if (Object.keys(userPermissions).length === 0) return item.to === '/dashboard';

    if (item.component === CNavTitle) {
      const relatedPermissions = menuStructure[item.name.toLowerCase()];
      if (!relatedPermissions) return false;
      return relatedPermissions.some((perm) => userPermissions[perm]);
    }

    const requiredPermissions = item.permissionsRequired || [item.to];
    return hasPermission(requiredPermissions);
  });

  // Elimina la propiedad `permissionsRequired` antes de retornar los elementos
  return filteredItems.map(({ permissionsRequired, show, ...rest }) => rest);
};

export default _nav;