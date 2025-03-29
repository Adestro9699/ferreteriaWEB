import React, { useState } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import ProductTable from '../../components/utilidadComp/ProductTable'; // Solo importa ProductTable
import CategoryTable from '../../components/utilidadComp/CategoryTable'; // Solo importa CategoryTable

const SpecificUtilidad = () => {
  const [activeTab, setActiveTab] = useState('product');

  return (
    <CCard>
      <CCardHeader>
        <CNav variant="tabs" className="card-header-tabs">
          <CNavItem>
            <CNavLink
              active={activeTab === 'product'}
              onClick={() => setActiveTab('product')}
            >
              Por Producto
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'category'}
              onClick={() => setActiveTab('category')}
            >
              Por Categoría
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCardHeader>
      <CCardBody>
        <CTabContent>
          {/* Pestaña "Por Producto" */}
          <CTabPane visible={activeTab === 'product'}>
            <ProductTable /> {/* Solo usa ProductTable aquí */}
          </CTabPane>

          {/* Pestaña "Por Categoría" */}
          <CTabPane visible={activeTab === 'category'}>
            <CategoryTable /> {/* Solo usa CategoryTable aquí */}
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  );
};

export default SpecificUtilidad;