import React from 'react';
import {
  CRow,
  CCol,
  CFormSelect,
  CButton,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFilter } from '@coreui/icons';

const ProveedorFilters = ({ filters, onFilterChange, onResetFilters }) => {
  return (
    <CRow className="mb-3">
      <CCol sm={12} md={4} className="mb-3 mb-md-0">
        <CInputGroup>
          <CFormSelect
            name="status"
            value={filters.status}
            onChange={onFilterChange}
            aria-label="Estado del proveedor"
          >
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </CFormSelect>
        </CInputGroup>
      </CCol>
      <CCol sm={12} md={4} className="mb-3 mb-md-0">
        <CInputGroup>
          <CFormInput
            type="text"
            placeholder="Buscar por país..."
            name="pais"
            value={filters.pais || ''}
            onChange={onFilterChange}
          />
        </CInputGroup>
      </CCol>
      <CCol sm={12} md={4} className="d-flex justify-content-end">
        <CButton
          color="secondary"
          variant="outline"
          className="w-100 w-md-auto"
          onClick={onResetFilters}
        >
          <CIcon icon={cilFilter} className="me-2" />
          Limpiar Filtros
        </CButton>
      </CCol>
    </CRow>
  );
};

export default ProveedorFilters;