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
  const userRole = useSelector((state) => state.auth.role);
  
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
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Inventario',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Productos',
      to: '/producto',
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      show: isAuthenticated && userRole === 'ADMIN', // Solo mostrar si el usuario es ADMIN
    },
    {
      component: CNavItem,
      name: 'Categorías',
      to: '/categorias',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Proveedores',
      to: '/proveedor',
      icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Movimientos',
      to: '/movimientos',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Facturación',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Ventas',
      to: '/venta',
      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Lista Ventas',
      to: '/listventas',
      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Cotizaciones',
      to: '/cotizaciones',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Compras',
      to: '/compras',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Trasnferencias',
      to: '/trans',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Clientes',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Lista de Clientes',
      to: '/clientes',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Créditos',
      to: '/creditos',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Usuarios y Permisos',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Usuarios',
      to: '/usuarios',
      icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Roles y Permisos',
      to: '/roles',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Cajas',
      to: '/cajas',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Reportes',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Reportes de Ventas',
      to: '/reportes-ventas',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Reportes de Compras',
      to: '/reportes-compras',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Reportes de Inventario',
      to: '/reportes-inventario',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Reportes de Transferencias',
      to: '/reportes-transferencias',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Configuración',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Empresa',
      to: '/empresa',
      icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Parametría/Impuestos   ',
      to: '/impuestos',
      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Backup',
      to: '/backup',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavTitle,
      name: 'Extras',
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Notificaciones',
      to: '/notificaciones',
      icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Calendario',
      to: '/calendario',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
    {
      component: CNavItem,
      name: 'Soporte',
      to: '/soporte',
      icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
      show: isAuthenticated, // Solo mostrar si el usuario está autenticado
    },
  ];


  // Filtra las rutas y elimina la propiedad `show`
  return rawItems
    .filter((item) => item.show !== false)
    .map(({ show, ...rest }) => rest); // Elimina la propiedad `show`
};

export default _nav;