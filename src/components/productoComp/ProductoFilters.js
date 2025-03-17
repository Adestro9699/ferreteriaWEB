import React from 'react';
import {
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CButton,
} from '@coreui/react';

const ProductoFilters = ({
  filters,
  handleFilterChange,
  resetFilters,
}) => {
  return (
    <CForm>
      <CFormLabel>Marca</CFormLabel>
      <CFormSelect
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">Todas</option>
        <option value="Truper">Truper</option>
        {/* Agrega más opciones según las marcas disponibles */}
      </CFormSelect>

      <CFormLabel className="mt-3">Estado</CFormLabel>
      <CFormSelect
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
      >
        <option value="">Todos</option>
        <option value="ACTIVO">Activo</option>
        <option value="INACTIVO">Inactivo</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="BANEADO">Baneado</option>
      </CFormSelect>

      <CFormLabel className="mt-3">Precio Mínimo</CFormLabel>
      <CFormInput
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleFilterChange}
        placeholder="Mínimo"
      />

      <CFormLabel className="mt-3">Precio Máximo</CFormLabel>
      <CFormInput
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleFilterChange}
        placeholder="Máximo"
      />

      <CButton color="secondary" className="mt-3" onClick={resetFilters}>
        Reiniciar Filtros
      </CButton>
    </CForm>
  );
};

export default ProductoFilters;