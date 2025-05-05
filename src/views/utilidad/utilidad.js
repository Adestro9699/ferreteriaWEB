import React, { useState } from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CContainer } from '@coreui/react';
import GlobalUtilidad from './GlobalUtilidad';
import SpecificUtilidad from './SpecificUtilidad';

const Utilidad = () => {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <CContainer fluid className="px-4">
      <h2 className="my-4">Gestión de Utilidades</h2>
      
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink 
            active={activeTab === 'global'} 
            onClick={() => setActiveTab('global')}
            className="fw-semibold"
          >
            <i className="fas fa-globe me-2"></i> Parámetros Globales
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink 
            active={activeTab === 'specific'} 
            onClick={() => setActiveTab('specific')}
            className="fw-semibold"
          >
            <i className="fas fa-bullseye me-2"></i> Utilidades Específicas
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 'global'}>
          <GlobalUtilidad />
        </CTabPane>
        <CTabPane visible={activeTab === 'specific'}>
          <SpecificUtilidad />
        </CTabPane>
      </CTabContent>
    </CContainer>
  );
};

export default Utilidad;