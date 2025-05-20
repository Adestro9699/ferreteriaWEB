import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
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

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleVisibleChange}
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

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={handleTogglerClick}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
