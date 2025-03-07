import React from 'react';
import { CPagination, CPaginationItem, CFormSelect } from '@coreui/react';

const ProveedorPagination = ({ currentPage, setCurrentPage, totalPages, itemsPerPage, handleItemsPerPageChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <CPagination>
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
      <CFormSelect
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="ms-3"
        style={{ width: 'auto' }}
      >
        <option value={10}>10 por página</option>
        <option value={20}>20 por página</option>
        <option value={30}>30 por página</option>
      </CFormSelect>
    </div>
  );
};

export default ProveedorPagination;