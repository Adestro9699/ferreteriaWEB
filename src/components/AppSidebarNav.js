import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react';

export const AppSidebarNav = ({ items }) => {
  const navItems = typeof items === 'function' ? items() : items;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  // Usar useCallback para evitar recreación de la función
  const closeSidebar = useCallback(() => {
    try {
      // Enfoque más directo para asegurar la actualización del estado
      if (window.innerWidth < 992) {
        // Aplicar un pequeño retraso antes del dispatch
        setTimeout(() => {
          dispatch({ type: 'set', payload: { sidebarShow: false } });
        }, 50);
      }
    } catch (error) {
      console.error('Error al cerrar sidebar:', error);
    }
  }, [dispatch, sidebarShow]);

  // Reemplazar la función handleNavClick por una nueva implementación
  const handleNavLink = useCallback((to, name) => {
    try {
      // Primero cerramos el sidebar en dispositivos móviles
      if (window.innerWidth < 992) {
        // Opción 1: Utilizar directamente el store global 
        // para bypasear cualquier problema con el contexto de React
        if (window.store) {
          window.store.dispatch({ type: 'set', payload: { sidebarShow: false } });
        } else {
          // Opción 2: Usar el dispatch normal 
          dispatch({ type: 'set', payload: { sidebarShow: false } });
        }
      }
      
      // Esperar un momento antes de navegar para permitir que 
      // el cierre del sidebar se complete primero
      setTimeout(() => {
        navigate(to);
        
        // Verificar si el sidebar realmente se cerró
        setTimeout(() => {
          if (window.store) {
            const currentState = window.store.getState();
            
            // Asegurar que esté cerrado si es móvil
            if (window.innerWidth < 992 && currentState.sidebarShow) {
              window.store.dispatch({ type: 'set', payload: { sidebarShow: false } });
            }
          }
        }, 100);
      }, 100);
    } catch (error) {
      console.error('Error en manejo de navegación:', error);
      
      // Intento de navegación en caso de error
      try {
        navigate(to);
      } catch (navError) {
        console.error('Error crítico al navegar:', navError);
      }
    }
  }, [dispatch, navigate]);

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
            onClick={(e) => {
              if (rest.to) {
                e.preventDefault();
                // Usar la nueva implementación
                handleNavLink(rest.to, name);
              }
            }}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item;
    const Component = component;
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {navItems &&
        navItems.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.func]).isRequired,
};