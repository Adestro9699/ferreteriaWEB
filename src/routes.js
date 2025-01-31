import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Producto = React.lazy(() => import('./views/producto/producto'));
const Proveedor = React.lazy (() => import ('./views/proveedor/proveedor'));
const Venta = React.lazy (() => import ('./views/venta/venta'));

const routes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/producto', name: 'Producto', element: Producto },
  { path: '/proveedor', name: 'Proveedor', element: Proveedor },
  { path: '/venta', name: 'Venta', element: Venta },
];

export default routes;