import React from 'react';
import { CButton } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux'; // Importa los hooks de Redux
import { useNavigate, Outlet } from 'react-router-dom'; // Importa el hook de navegación y Outlet
import { AppSidebar, AppFooter, AppHeader } from '../components/index';

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Obtener el estado de autenticación

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar todos los datos de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('trabajador');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    dispatch({ type: 'LOGOUT' }); // Actualizar el estado de autenticación en Redux
    navigate('/login'); // Redirigir al login
  };

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader>
          {/* Botón de logout */}
          {isAuthenticated && (
            <CButton onClick={handleLogout} color="danger" style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              Cerrar sesión
            </CButton>
          )}
        </AppHeader>
        <div className="body flex-grow-1">
          <Outlet /> {/* Renderiza las rutas secundarias */}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;