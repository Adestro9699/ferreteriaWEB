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
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from './AppSidebarNav';
import { logo } from 'src/assets/brand/logo';
import { sygnet } from 'src/assets/brand/sygnet';
import navigation from '../_nav';

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
      {/* Encabezado de la barra lateral */}
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        {/* Botón para cerrar la barra lateral (solo en dispositivos móviles) */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => {
            dispatch({ type: 'set', payload: { sidebarShow: false } });
          }}
        />
      </CSidebarHeader>

      {/* Menú de navegación */}
      <AppSidebarNav items={navigation} />

      {/* Pie de la barra lateral */}
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => {
            dispatch({ type: 'set', payload: { sidebarUnfoldable: !unfoldable } }); // Envía el payload correcto
          }}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);