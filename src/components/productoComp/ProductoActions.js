import React from 'react';
import { CButton, CIcon } from '@coreui/react';
import { cilPencil, cilTrash } from '@coreui/icons';

const ProductoActions = ({
  item,
  toggleDetails,
  details,
  handleEdit,
  confirmDelete,
}) => {
  return (
    <div>
      <CButton
        color="info"
        variant="outline"
        size="sm"
        onClick={() => toggleDetails(item.idProducto)}
        className="me-2"
      >
        {details.includes(item.idProducto) ? 'Ocultar' : 'Mostrar'}
      </CButton>
      <CButton
        color="warning"
        size="sm"
        className="me-2"
        onClick={() => handleEdit(item)}
      >
        <CIcon icon={cilPencil} />
      </CButton>
      <CButton
        color="danger"
        size="sm"
        onClick={() => confirmDelete(item.idProducto)}
      >
        <CIcon icon={cilTrash} />
      </CButton>
    </div>
  );
};

export default ProductoActions;