import React from 'react';
import { CFormSelect, CInputGroup, CFormInput, CInputGroupText, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

const ProveedorFilters = ({ statusFilter, setStatusFilter, searchTerm, setSearchTerm, clearSearch }) => {
  return (
    <div>
      <CFormSelect
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3"
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </CFormSelect>
      <CInputGroup>
        <CFormInput
          type="text"
          placeholder="Buscar proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CInputGroupText>
          <CButton color="transparent" size="sm" onClick={clearSearch}>
            <CIcon icon={cilX} />
          </CButton>
        </CInputGroupText>
      </CInputGroup>
    </div>
  );
};

export default ProveedorFilters;