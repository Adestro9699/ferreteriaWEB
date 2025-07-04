import React, { useState } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import TransferenciasTable from './TransferenciasTable';
import RecepcionesTable from './RecepcionesTable';

const TransferenciasTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === 0}
            onClick={() => handleTabChange(0)}
            style={{ cursor: 'pointer' }}
          >
            Transferencias Salientes
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 1}
            onClick={() => handleTabChange(1)}
            style={{ cursor: 'pointer' }}
          >
            Recepciones
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 0}>
          <TransferenciasTable />
        </CTabPane>
        <CTabPane visible={activeTab === 1}>
          <RecepcionesTable />
        </CTabPane>
      </CTabContent>
    </div>
  );
};

export default TransferenciasTabs; 