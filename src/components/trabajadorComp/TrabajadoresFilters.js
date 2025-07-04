import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormInput,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilReload } from '@coreui/icons';

const TrabajadoresFilters = ({ onFilter, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    onFilter({ search: searchTerm });
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CRow className="g-3">
          <CCol md={8}>
            <CFormInput
              placeholder="Buscar por nombre, apellido, DNI o sucursal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </CCol>
          
          <CCol md={4}>
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                onClick={handleFilter}
                className="flex-fill"
              >
                <CIcon icon={cilSearch} className="me-2" />
                Buscar
              </CButton>
              <CButton
                color="secondary"
                onClick={handleClear}
                title="Limpiar búsqueda"
              >
                <CIcon icon={cilReload} />
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default TrabajadoresFilters; 