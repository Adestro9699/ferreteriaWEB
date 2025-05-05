import React from 'react';
import Usuarios from './views/usuarios/usuario';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Producto = React.lazy(() => import('./views/producto/producto'));
const Categoria = React.lazy(()=> import('./views/categorias/categorias'));
const Proveedor = React.lazy (() => import ('./views/proveedor/proveedor'));
const Venta = React.lazy (() => import ('./views/venta/venta'));
const Usuario = React.lazy (() => import ('./views/usuarios/usuario'));
const Cliente = React.lazy (() => import ('./views/cliente/cliente'));
const RolesYPermisos = React.lazy (() => import ('./views/rolesYpermisos/rolesYpermisos'));
const Caja = React.lazy (() => import ('./views/caja/caja'));
const Compra = React.lazy(() => import('./views/compra/compra'));

const routes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/producto', name: 'Producto', element: Producto },
  { path: '/categorias', name: 'Categoria', element: Categoria },
  { path: '/proveedor', name: 'Proveedor', element: Proveedor },
  { path: '/venta', name: 'Venta', element: Venta },
  { path: '/usuario', name: 'Usuario', element: Usuario },
  { path: '/cliente', name: 'Cliente', element: Cliente },
  { path: '/rolesYpermisos/:usuarioId?', name: 'Roles y Permisos', element: RolesYPermisos },
  { path: '/caja', name: 'Caja', element: Caja },
  { path: '/compra', name: 'Compra', element: Compra },
];

export default routes;