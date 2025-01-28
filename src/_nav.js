import React from 'react'
import CIcon from '@coreui/icons-react'
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
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
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
  },
  {
    component: CNavItem,
    name: 'Categorías',
    to: '/categorias',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Proveedores',
    to: '/proveedores',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Movimientos',
    to: '/movimientos',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Facturación',
  },
  {
    component: CNavItem,
    name: 'Ventas',
    to: '/ventas',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cotizaciones',
    to: '/cotizaciones',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Compras',
    to: '/compras',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Clientes',
  },
  {
    component: CNavItem,
    name: 'Lista de Clientes',
    to: '/clientes',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Créditos',
    to: '/creditos',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Usuarios y Permisos',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/usuarios',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Roles',
    to: '/roles',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Reportes',
  },
  {
    component: CNavItem,
    name: 'Reportes de Ventas',
    to: '/reportes-ventas',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reportes de Inventario',
    to: '/reportes-inventario',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Configuración',
  },
  {
    component: CNavItem,
    name: 'Empresa',
    to: '/empresa',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Impuestos',
    to: '/impuestos',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Backup',
    to: '/backup',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavItem,
    name: 'Notificaciones',
    to: '/notificaciones',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Calendario',
    to: '/calendario',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Soporte',
    to: '/soporte',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
];

export default _nav;