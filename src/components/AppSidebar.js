import React from 'react';
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
console.log('Logo URL:', logoPng);


const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', payload: { sidebarShow: visible } });
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
          onClick={() => {
            dispatch({ type: 'set', payload: { sidebarShow: false } });
          }}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => {
            dispatch({ type: 'set', payload: { sidebarUnfoldable: !unfoldable } });
          }}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
