import React, { useState } from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CCard, CCardBody } from '@coreui/react';
import GlobalUtilidad from './GlobalUtilidad';
import SpecificUtilidad from './SpecificUtilidad';
import UnidadMedida from './UnidadMedida';
import Comprobante from './Comprobante';
import TipoPago from './TipoPago';
import TipoDocumento from './TipoDocumento';

const Utilidad = () => {
  const [activeKey, setActiveKey] = useState(1);

  return (
    <CCard>
      <CCardBody>
        <CNav variant="tabs" role="tablist" className="mb-3">
          <CNavItem>
            <CNavLink
              active={activeKey === 1}
              onClick={() => setActiveKey(1)}
              style={{ cursor: 'pointer' }}
            >
              Utilidad Global
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 2}
              onClick={() => setActiveKey(2)}
              style={{ cursor: 'pointer' }}
            >
              Utilidad Específica
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 3}
              onClick={() => setActiveKey(3)}
              style={{ cursor: 'pointer' }}
            >
              Unidad de Medida
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 4}
              onClick={() => setActiveKey(4)}
              style={{ cursor: 'pointer' }}
            >
              Tipos de Comprobante
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 5}
              onClick={() => setActiveKey(5)}
              style={{ cursor: 'pointer' }}
            >
              Tipos de Pago
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 6}
              onClick={() => setActiveKey(6)}
              style={{ cursor: 'pointer' }}
            >
              Tipos de Documento
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="global-tab" visible={activeKey === 1}>
            <GlobalUtilidad />
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="specific-tab" visible={activeKey === 2}>
            <SpecificUtilidad />
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="unidad-tab" visible={activeKey === 3}>
            <UnidadMedida />
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="comprobante-tab" visible={activeKey === 4}>
            <Comprobante />
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="pago-tab" visible={activeKey === 5}>
            <TipoPago />
          </CTabPane>
          <CTabPane role="tabpanel" aria-labelledby="documento-tab" visible={activeKey === 6}>
            <TipoDocumento />
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  );
};

export default Utilidad;