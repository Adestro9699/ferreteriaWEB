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
  marcas, // Recibe las marcas como prop
}) => {
  return (
    <CForm>
      {/* Filtro de Marca */}
      <CFormLabel>Marca</CFormLabel>
      <CFormSelect
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">Todas</option>
        {marcas.map((marca, index) => (
          <option key={index} value={marca}>
            {marca}
          </option>
        ))}
      </CFormSelect>

      {/* Filtro de Estado */}
      <CFormLabel className="mt-3">Estado</CFormLabel>
      <CFormSelect
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
      >
        <option value="">Todos</option>
        <option value="ACTIVO">Activo</option>
        <option value="INACTIVO">Inactivo</option>
      </CFormSelect>

      {/* Filtro de Precio Mínimo */}
      <CFormLabel className="mt-3">Precio Mínimo</CFormLabel>
      <CFormInput
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleFilterChange}
        placeholder="Mínimo"
      />

      {/* Filtro de Precio Máximo */}
      <CFormLabel className="mt-3">Precio Máximo</CFormLabel>
      <CFormInput
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleFilterChange}
        placeholder="Máximo"
      />

      {/* Botón para reiniciar filtros */}
      <CButton color="secondary" className="mt-3" onClick={resetFilters}>
        Reiniciar Filtros
      </CButton>
    </CForm>
  );
};

export default ProductoFilters;