import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Producto = React.lazy(() => import('./views/producto/producto'));
const Categoria = React.lazy(()=> import('./views/categorias/categorias'));

const routes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/producto', name: 'Producto', element: Producto },
  { path: '/categorias', name: 'Categoria', element: Categoria },

];

export default routes;