import React from 'react';
import {
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormText,
  CFormRange
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFilter, cilReload, cilDollar } from '@coreui/icons';

const ProductoFilters = ({
  filters,
  handleFilterChange,
  resetFilters,
  marcas, // Recibe las marcas como prop
}) => {
  // Calcular el rango de precios para mostrar en el slider
  const maxPriceFromFilters = filters.maxPrice ? parseFloat(filters.maxPrice) : 0;
  const minPriceFromFilters = filters.minPrice ? parseFloat(filters.minPrice) : 0;
  
  return (
    <CForm>
      <CRow className="mb-3">
        <CCol>
          <h6 className="mb-3 text-primary fw-bold">
            <CIcon icon={cilFilter} className="me-1 text-body-secondary" /> Filtrar por
          </h6>
        </CCol>
      </CRow>
      
      {/* Filtro de Marca */}
      <div className="mb-3">
        <CFormLabel className="small fw-semibold">Marca</CFormLabel>
        <CFormSelect
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          size="sm"
          className="shadow-sm"
        >
          <option value="">Todas las marcas</option>
          {marcas.map((marca, index) => (
            <option key={index} value={marca}>
              {marca}
            </option>
          ))}
        </CFormSelect>
      </div>

      {/* Filtro de Estado */}
      <div className="mb-3">
        <CFormLabel className="small fw-semibold">Estado del producto</CFormLabel>
        <CFormSelect
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          size="sm"
          className="shadow-sm"
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="BANEADO">Baneado</option>
        </CFormSelect>
      </div>

      {/* Filtro de Precio */}
      <div className="mb-4">
        <CFormLabel className="d-flex justify-content-between align-items-center">
          <span className="small fw-semibold">Rango de precio</span>
          <CIcon icon={cilDollar} className="text-success text-body-secondary" />
        </CFormLabel>
        
        <CRow className="g-2 mb-2">
          <CCol xs={6}>
            <CInputGroup size="sm">
              <CInputGroupText>Min</CInputGroupText>
              <CFormInput
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="border-start-0 shadow-sm"
              />
            </CInputGroup>
          </CCol>
          <CCol xs={6}>
            <CInputGroup size="sm">
              <CInputGroupText>Max</CInputGroupText>
              <CFormInput
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="∞"
                min="0"
                step="0.01"
                className="border-start-0 shadow-sm"
              />
            </CInputGroup>
          </CCol>
        </CRow>
        
        {/* Texto de rango seleccionado */}
        <div className="d-flex justify-content-between align-items-center">
          <CFormText className="small">
            {filters.minPrice ? `S/. ${filters.minPrice}` : 'Mínimo'}
          </CFormText>
          <CFormText className="small">
            {filters.maxPrice ? `S/. ${filters.maxPrice}` : 'Máximo'}
          </CFormText>
        </div>
      </div>

      {/* Botón para reiniciar filtros */}
      <CButton 
        color="light" 
        variant="outline"
        className="w-100 d-flex align-items-center justify-content-center shadow-sm mb-2"
        onClick={resetFilters}
      >
        <CIcon icon={cilReload} className="me-2 text-body-secondary" />
        Reiniciar filtros
      </CButton>
      
      {/* Contador de filtros activos */}
      {(filters.category || filters.status || filters.minPrice || filters.maxPrice) && (
        <div className="text-center small mt-3 text-muted">
          {Object.values(filters).filter(Boolean).length} filtros activos
        </div>
      )}
    </CForm>
  );
};

export default ProductoFilters;