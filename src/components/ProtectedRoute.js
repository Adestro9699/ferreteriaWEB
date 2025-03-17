import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredPermissions = [], children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role); // Obtener el rol del usuario
  const userPermissions = useSelector((state) => state.auth.permissions);

  // Verifica si el usuario tiene todos los permisos requeridos
  const hasPermission = (requiredPermissions) => {
    // Si el usuario es ADMIN, no se validan los permisos
    if (userRole === 'ADMIN') return true;

    // Si no se requieren permisos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    // Verificar que el usuario tenga todos los permisos requeridos
    return requiredPermissions.every((permission) => userPermissions[permission]);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirigir al login si no está autenticado
  }

  if (!hasPermission(requiredPermissions)) {
    return <Navigate to="/acceso-denegado" />; // Redirigir si no tiene permisos
  }

  return children ? children : <Outlet />; // Renderizar el componente hijo o el Outlet
};

export default ProtectedRoute;