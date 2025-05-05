import React from 'react';
import { CPagination, CSelect } from '@coreui/react';

const PaginacionVentas = ({ pagination, onPageChange, onItemsPerPageChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <CSelect
        value={pagination.itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        style={{ width: '80px' }}
      >
        {[5, 10, 20, 50, 100].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </CSelect>
      <CPagination
        activePage={pagination.currentPage}
        pages={Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
        onActivePageChange={onPageChange}
        doubleArrows={false}
        align="end"
      />
    </div>
  );
};

export default PaginacionVentas;