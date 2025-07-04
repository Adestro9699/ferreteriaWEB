import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';
import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../_nav';
import logoPng from '../assets/images/logo.png';

// Borrar log de consola innecesario
// console.log('Logo URL:', logoPng);

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const resizeTimeoutRef = useRef(null);
  const lastWidthRef = useRef(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para filtrar la navegación basada en el término de búsqueda
  const filterNavigation = (items, searchTerm) => {
    if (!searchTerm) return items;

    const filteredItems = [];
    
    items.forEach(item => {
      // Si es un grupo (tiene items)
      if (item.items) {
        const filteredGroupItems = item.items.filter(subItem => {
          // Buscar en el nombre del subitem
          if (subItem.name && subItem.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
          // Si el subitem también tiene items (subgrupos)
          if (subItem.items) {
            return subItem.items.some(subSubItem => 
              subSubItem.name && subSubItem.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          return false;
        });

        // Si el grupo tiene items que coinciden, incluirlo
        if (filteredGroupItems.length > 0) {
          filteredItems.push({
            ...item,
            items: filteredGroupItems
          });
        }
      } else {
        // Si es un item individual, buscar en su nombre
        if (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredItems.push(item);
        }
      }
    });

    return filteredItems;
  };

  // Obtener la navegación filtrada
  const getFilteredNavigation = () => {
    const navItems = typeof navigation === 'function' ? navigation() : navigation;
    return filterNavigation(navItems, searchTerm);
  };

  // Este efecto asegura que la barra lateral se maneje correctamente al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      // Cancelar cualquier timeout anterior para evitar múltiples ejecuciones
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Usar un timeout para evitar demasiadas actualizaciones durante el redimensionamiento
      resizeTimeoutRef.current = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const wasMobile = lastWidthRef.current < 992;
        const isMobile = currentWidth < 992;
        
        // Actualizar la referencia del último ancho
        lastWidthRef.current = currentWidth;
        
        // Solo ejecutar la lógica si estamos cambiando entre móvil y escritorio
        if (wasMobile !== isMobile) {
          if (isMobile) {
            // Al cambiar a móvil, cerrar el sidebar
            dispatch({ type: 'set', payload: { sidebarShow: false } });
          } else {
            // Al cambiar a escritorio, abrir el sidebar
            dispatch({ type: 'set', payload: { sidebarShow: true } });
          }
        }
      }, 150); // Delay de 150ms para debounce
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [dispatch]);  // Eliminamos sidebarShow de las dependencias para evitar el bucle

  // Manejar cambios de visibilidad
  const handleVisibleChange = (visible) => {
    dispatch({ type: 'set', payload: { sidebarShow: visible } });
  };

  // Manejar clic en botón cerrar
  const handleCloseClick = () => {
    dispatch({ type: 'set', payload: { sidebarShow: false } });
  };

  // Manejar clic en toggler
  const handleTogglerClick = () => {
    dispatch({ type: 'set', payload: { sidebarUnfoldable: !unfoldable } });
  };

  // Limpiar búsqueda cuando se cierra el sidebar
  const handleSidebarClose = () => {
    setSearchTerm('');
  };

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        handleVisibleChange(visible);
        if (!visible) {
          handleSidebarClose();
        }
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          to="/"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '56px',
            padding: '0',
            overflow: 'hidden', // Si hay algo fuera de tamaño, lo esconde
            width: '100%', // Ocupa todo el ancho disponible
          }}
        >
          <img
            src={logoPng}
            alt="Logo"
            style={{
              maxHeight: '130px',   // Ajusta la altura máxima sin deformar
              maxWidth: '80%',     // El logo nunca será más ancho que el 80% del contenedor
              width: 'auto',       // Respeta la proporción original
              height: 'auto',      // Respeta la proporción original
              filter: 'invert(100%)',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={handleCloseClick}
        />
      </CSidebarHeader>

      {/* Barra de búsqueda */}
      <div className="p-3 border-bottom">
        <div className="position-relative">
          <CFormInput
            placeholder="Buscar vistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark text-white border-secondary"
            style={{
              paddingLeft: '2.5rem',
              fontSize: '0.875rem'
            }}
          />
          <CIcon
            icon={cilSearch}
            className="position-absolute"
            style={{
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c757d',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <AppSidebarNav items={getFilteredNavigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={handleTogglerClick}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
