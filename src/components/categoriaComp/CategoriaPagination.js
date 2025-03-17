import React from 'react';
import { CPagination, CPaginationItem, CFormSelect } from '@coreui/react';

const CategoriaPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  handleItemsPerPageChange,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between gap-3">
      {/* Paginación */}
      <CPagination className="mb-0">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Anterior
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <CPaginationItem
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Siguiente
        </CPaginationItem>
      </CPagination>

      {/* Selector de cantidad de elementos por página */}
      <div className="d-flex align-items-center">
        <span className="me-2">Mostrar:</span>
        <CFormSelect
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={{ width: '80px' }} // Ancho fijo para el selector
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </CFormSelect>
      </div>
    </div>
  );
};

export default CategoriaPagination;