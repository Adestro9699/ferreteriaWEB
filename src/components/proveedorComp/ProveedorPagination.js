import React from 'react';
import {
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react';

const ProveedorPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between mt-3">
      {/* Paginación */}
      <CPagination className="m-0">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <CPaginationItem
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>

      {/* Selector de elementos por página */}
      <CFormSelect
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="ms-3"
        style={{ width: 'auto', height: 'fit-content' }}
      >
        <option value={10}>10 por página</option>
        <option value={20}>20 por página</option>
        <option value={30}>30 por página</option>
      </CFormSelect>
    </div>
  );
};

export default ProveedorPagination;