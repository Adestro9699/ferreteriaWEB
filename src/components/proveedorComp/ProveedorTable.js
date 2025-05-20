import React from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CButton,
  CBadge,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilSortAlphaDown, cilSortAlphaUp } from '@coreui/icons';

const ProveedorTable = ({
  proveedores,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEdit,
  onDelete,
  sortColumn,
  sortDirection,
  onSort,
}) => {
  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? cilSortAlphaDown : cilSortAlphaUp;
    }
    return null;
  };

  return (
    <div className="table-responsive">
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="bg-body-secondary">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={{ width: '50px' }}>
              <CFormCheck
                checked={selectedItems.length === proveedores.length && proveedores.length > 0}
                indeterminate={selectedItems.length > 0 && selectedItems.length < proveedores.length}
                onChange={onSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('nombre')}
              style={{ width: '200px' }}
            >
              Nombre
              {getSortIcon('nombre') && <CIcon icon={getSortIcon('nombre')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('direccion')}
              style={{ width: '200px' }}
            >
              Dirección
              {getSortIcon('direccion') && <CIcon icon={getSortIcon('direccion')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('telefono')}
              style={{ width: '150px' }}
            >
              Teléfono
              {getSortIcon('telefono') && <CIcon icon={getSortIcon('telefono')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('correoProveedor')}
              style={{ width: '200px' }}
            >
              Correo
              {getSortIcon('correoProveedor') && <CIcon icon={getSortIcon('correoProveedor')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('pais')}
              style={{ width: '150px' }}
            >
              País
              {getSortIcon('pais') && <CIcon icon={getSortIcon('pais')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('fechaRegistro')}
              style={{ width: '150px' }}
            >
              Fecha de Registro
              {getSortIcon('fechaRegistro') && <CIcon icon={getSortIcon('fechaRegistro')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell 
              className="cursor-pointer" 
              onClick={() => onSort('estado')}
              style={{ width: '100px' }}
            >
              Estado
              {getSortIcon('estado') && <CIcon icon={getSortIcon('estado')} className="ms-2" />}
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={{ width: '150px' }}>
              Acciones
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {proveedores.map((proveedor) => (
            <CTableRow 
              key={proveedor.idProveedor}
              className={selectedItems.includes(proveedor.idProveedor) ? 'selected-row' : ''}
            >
              <CTableDataCell className="text-center">
                <CFormCheck
                  checked={selectedItems.includes(proveedor.idProveedor)}
                  onChange={() => onSelectItem(proveedor.idProveedor)}
                />
              </CTableDataCell>
              <CTableDataCell>{proveedor.nombre}</CTableDataCell>
              <CTableDataCell>{proveedor.direccion}</CTableDataCell>
              <CTableDataCell>{proveedor.telefono}</CTableDataCell>
              <CTableDataCell>{proveedor.correoProveedor}</CTableDataCell>
              <CTableDataCell>{proveedor.pais}</CTableDataCell>
              <CTableDataCell>{proveedor.fechaRegistro}</CTableDataCell>
              <CTableDataCell>
                <CBadge 
                  color={proveedor.estado === 'ACTIVO' ? 'success' : 'danger'}
                  className="ms-2"
                >
                  {proveedor.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <div className="d-flex gap-2 justify-content-center">
                  <CTooltip content="Editar proveedor">
                    <CButton
                      color="warning"
                      size="sm"
                      onClick={() => onEdit(proveedor)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content="Eliminar proveedor">
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => onDelete(proveedor.idProveedor)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTooltip>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
          {proveedores.length === 0 && (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center py-4">
                No hay proveedores disponibles
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ProveedorTable;