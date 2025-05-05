import React from 'react';
import { CFormSelect, CInputGroup, CFormInput, CInputGroupText, CButton, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

const CompraFilters = ({ statusFilter, setStatusFilter, searchTerm, setSearchTerm, clearSearch }) => {
  return (
    <CRow className="align-items-center justify-content-center mb-3"> {/* Alineación vertical y centrado */}
      {/* Columna izquierda: Barra de búsqueda */}
      <CCol xs={12} md={8}>
        <CInputGroup>
          <CFormInput
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CInputGroupText>
            <CButton color="transparent" size="sm" onClick={clearSearch}>
              <CIcon icon={cilX} />
            </CButton>
          </CInputGroupText>
        </CInputGroup>
      </CCol>

      {/* Columna derecha: Selector de estados */}
      <CCol xs={12} md={4} className="mt-3 mt-md-0 text-end">
        <CFormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '100%', maxWidth: '200px', display: 'inline-block' }}
        >
          <option value="all">Estados</option>
          <option value="COMPLETADA">COMPLETADA</option>
          <option value="PENDIENTE">PENDIENTE</option>
        </CFormSelect>
      </CCol>
    </CRow>
  );
};

export default CompraFilters;