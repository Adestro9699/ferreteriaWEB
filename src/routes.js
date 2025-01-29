import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Producto = React.lazy(() => import('./views/producto/producto'));
const Proveedor = React.lazy (() => import ('./views/proveedor/proveedor'));

const routes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/producto', name: 'Producto', element: Producto },
  { path: '/proveedor', name: 'Proveedor', element: Proveedor },
];

export default routes;