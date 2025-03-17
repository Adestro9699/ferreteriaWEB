import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CBadge,
  CCollapse,
  CButton,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilSortAlphaDown, cilSortAlphaUp } from '@coreui/icons';
import ProductoForm from './ProductoForm'; // Importar el nuevo componente

// Definir la función getBadge
const getBadge = (status) => {
  switch (status) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'secondary';
    case 'PENDIENTE':
      return 'warning';
    case 'BANEADO':
      return 'danger';
    default:
      return 'primary';
  }
};

const ProductoTable = ({
  items,
  details,
  selectedItems,
  handleSelectItem,
  handleSelectAll,
  toggleDetails,
  handleEdit,
  confirmDelete,
  sortColumn,
  sortDirection,
  handleAdvancedSort,
}) => {
  return (
    <CTable striped hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>
            <CFormCheck
              checked={selectedItems.length === items.length}
              onChange={handleSelectAll}
            />
          </CTableHeaderCell>
          <CTableHeaderCell onClick={() => handleAdvancedSort('nombreProducto')}>
            Nombre {sortColumn === 'nombreProducto' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
          </CTableHeaderCell>
          <CTableHeaderCell onClick={() => handleAdvancedSort('precio')}>
            Precio {sortColumn === 'precio' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
          </CTableHeaderCell>
          <CTableHeaderCell onClick={() => handleAdvancedSort('stock')}>
            Stock {sortColumn === 'stock' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
          </CTableHeaderCell>
          <CTableHeaderCell onClick={() => handleAdvancedSort('fechaModificacion')}>
            Fecha Modificación {sortColumn === 'fechaModificacion' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
          </CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {items.map((item) => (
          <React.Fragment key={item.idProducto}>
            <CTableRow>
              <CTableDataCell>
                <CFormCheck
                  checked={selectedItems.includes(item.idProducto)}
                  onChange={() => handleSelectItem(item.idProducto)}
                />
              </CTableDataCell>
              <CTableDataCell>{item.nombreProducto}</CTableDataCell>
              <CTableDataCell>S/. {item.precio}</CTableDataCell>
              <CTableDataCell>{item.stock}</CTableDataCell>
              <CTableDataCell>{item.fechaModificacion}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={getBadge(item.estadoProducto)}>{item.estadoProducto}</CBadge>
              </CTableDataCell>
              <CTableDataCell>
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
              </CTableDataCell>
            </CTableRow>
            {details.includes(item.idProducto) && (
              <CTableRow>
                <CTableDataCell colSpan={7}>
                  <CCollapse visible={details.includes(item.idProducto)}>
                    <ProductoForm producto={item} /> {/* Usar el nuevo componente aquí */}
                  </CCollapse>
                </CTableDataCell>
              </CTableRow>
            )}
          </React.Fragment>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default ProductoTable;