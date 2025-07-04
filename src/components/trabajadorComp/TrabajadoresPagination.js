import React from 'react';
import {
  CPagination,
  CPaginationItem,
} from '@coreui/react';

const TrabajadoresPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
          style={{ cursor: 'pointer' }}
        >
          {i}
        </CPaginationItem>
      );
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="text-muted">
        Mostrando {startItem} a {endItem} de {totalItems} trabajadores
      </div>
      
      <CPagination aria-label="Paginación de trabajadores">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </CPaginationItem>
        
        {currentPage > 3 && (
          <>
            <CPaginationItem
              onClick={() => handlePageChange(1)}
              style={{ cursor: 'pointer' }}
            >
              1
            </CPaginationItem>
            {currentPage > 4 && (
              <CPaginationItem disabled>...</CPaginationItem>
            )}
          </>
        )}
        
        {renderPageNumbers()}
        
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <CPaginationItem disabled>...</CPaginationItem>
            )}
            <CPaginationItem
              onClick={() => handlePageChange(totalPages)}
              style={{ cursor: 'pointer' }}
            >
              {totalPages}
            </CPaginationItem>
          </>
        )}
        
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default TrabajadoresPagination; 