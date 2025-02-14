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

    const rawItems = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
        show: isAuthenticated, // Todos los usuarios autenticados pueden ver el dashboard
      },
      {
        component: CNavTitle,
        name: 'Inventario',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.productos || userPermissions?.categorias),
      },
      {
        component: CNavItem,
        name: 'Productos',
        to: '/producto',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.productos),
      },
      {
        component: CNavItem,
        name: 'Categorías',
        to: '/categorias',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.categorias),
      },
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/proveedor',
        icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.proveedores),
      },
      {
        component: CNavItem,
        name: 'Movimientos',
        to: '/movimientos',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.movimientos),
      },
      {
        component: CNavTitle,
        name: 'Facturación',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.ventas || userPermissions?.compras),
      },
      {
        component: CNavItem,
        name: 'Ventas',
        to: '/venta',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.ventas),
      },
      {
        component: CNavItem,
        name: 'Lista Ventas',
        to: '/listventas',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.ventas),
      },
      {
        component: CNavItem,
        name: 'Cotizaciones',
        to: '/cotizaciones',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.cotizaciones),
      },
      {
        component: CNavItem,
        name: 'Compras',
        to: '/compras',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.compras),
      },
      {
        component: CNavItem,
        name: 'Transferencias',
        to: '/trans',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.transferencias),
      },
      {
        component: CNavTitle,
        name: 'Clientes',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.clientes),
      },
      {
        component: CNavItem,
        name: 'Lista de Clientes',
        to: '/clientes',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.clientes),
      },
      {
        component: CNavItem,
        name: 'Créditos',
        to: '/creditos',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.creditos),
      },
      {
        component: CNavTitle,
        name: 'Usuarios y Permisos',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.usuarios),
      },
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/usuarios',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.usuarios),
      },
      {
        component: CNavItem,
        name: 'Roles y Permisos',
        to: '/roles',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.roles),
      },
      {
        component: CNavItem,
        name: 'Cajas',
        to: '/cajas',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.cajas),
      },
      {
        component: CNavTitle,
        name: 'Reportes',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.reportesVentas || userPermissions?.reportesCompras || userPermissions?.reportesInventario),
      },
      {
        component: CNavItem,
        name: 'Reportes de Ventas',
        to: '/reportes-ventas',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.reportesVentas),
      },
      {
        component: CNavItem,
        name: 'Reportes de Compras',
        to: '/reportes-compras',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.reportesCompras),
      },
      {
        component: CNavItem,
        name: 'Reportes de Inventario',
        to: '/reportes-inventario',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.reportesInventario),
      },
      {
        component: CNavItem,
        name: 'Reportes de Transferencias',
        to: '/reportes-transferencias',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.reportesTransferencias),
      },
      {
        component: CNavTitle,
        name: 'Configuración',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.configuracion),
      },
      {
        component: CNavItem,
        name: 'Empresa',
        to: '/empresa',
        icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.configuracion),
      },
      {
        component: CNavItem,
        name: 'Parametría/Impuestos',
        to: '/impuestos',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.configuracion),
      },
      {
        component: CNavItem,
        name: 'Backup',
        to: '/backup',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.configuracion),
      },
      {
        component: CNavTitle,
        name: 'Extras',
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.notificaciones || userPermissions?.calendario || userPermissions?.soporte),
      },
      {
        component: CNavItem,
        name: 'Notificaciones',
        to: '/notificaciones',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.notificaciones),
      },
      {
        component: CNavItem,
        name: 'Calendario',
        to: '/calendario',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.calendario),
      },
      {
        component: CNavItem,
        name: 'Soporte',
        to: '/soporte',
        icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
        show: isAuthenticated && (userRole === 'ADMIN' || userPermissions?.soporte),
      },
    ];

    // Filtra las rutas basadas en los permisos del usuario
    return rawItems
      .filter((item) => {
        if (!isAuthenticated) return false; // Si no está autenticado, ocultar todo
        if (userRole === 'ADMIN') return true; // Si es ADMIN, mostrar todo
        if (Object.keys(userPermissions).length === 0) {
          // Si el usuario tiene permisos vacíos, solo mostrar el dashboard
          return item.to === '/dashboard';
        }
        return item.show !== false; // Para otros roles, seguir las reglas definidas en `show`
      })
      .map(({ show, ...rest }) => rest); // Elimina la propiedad `show`
  };

  export default _nav;  