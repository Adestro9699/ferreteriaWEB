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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

const ProveedorTable = ({
  proveedores,
  selectedProveedores,
  handleSelectProveedor,
  handleSort,
  sortField,
  sortDirection,
  handleDelete,
  handleEdit, // Asegúrate de recibir esta prop
}) => {
  return (
    <div className="table-responsive">
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ width: '50px' }}>
              <CFormCheck
                checked={selectedProveedores.length === proveedores.length}
                onChange={() => {
                  if (selectedProveedores.length === proveedores.length) {
                    handleSelectProveedor([]); // Deseleccionar todos
                  } else {
                    handleSelectProveedor(proveedores.map((p) => p.idProveedor)); // Seleccionar todos
                  }
                }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('nombre')}>
              Nombre{' '}
              {sortField === 'nombre' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('direccion')}>
              Dirección{' '}
              {sortField === 'direccion' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('telefono')}>
              Teléfono{' '}
              {sortField === 'telefono' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('correoProveedor')}>
              Correo{' '}
              {sortField === 'correo' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('pais')}>
              País{' '}
              {sortField === 'pais' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('fechaRegistro')}>
              Fecha de Registro{' '}
              {sortField === 'fechaRegistro' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell style={{ width: '100px' }}>Estado</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '150px' }}>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {proveedores.map((proveedor) => (
            <CTableRow key={proveedor.idProveedor}>
              <>
                <CTableDataCell style={{ width: '50px' }}>
                  <CFormCheck
                    checked={selectedProveedores.includes(proveedor.idProveedor)}
                    onChange={() => handleSelectProveedor(proveedor.idProveedor)}
                  />
                </CTableDataCell>
                <CTableDataCell style={{ width: '200px' }}>{proveedor.nombre}</CTableDataCell>
                <CTableDataCell style={{ width: '200px' }}>{proveedor.direccion}</CTableDataCell>
                <CTableDataCell style={{ width: '150px' }}>{proveedor.telefono}</CTableDataCell>
                <CTableDataCell style={{ width: '200px' }}>{proveedor.correoProveedor}</CTableDataCell>
                <CTableDataCell style={{ width: '150px' }}>{proveedor.pais}</CTableDataCell>
                <CTableDataCell style={{ width: '150px' }}>{proveedor.fechaRegistro}</CTableDataCell>
                <CTableDataCell style={{ width: '100px' }}>
                  <CBadge color={proveedor.estado === 'ACTIVO' ? 'success' : 'danger'}>
                    {proveedor.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell style={{ width: '150px' }}>
                  <CButton
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(proveedor)} // Usar la función de edición
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(proveedor.idProveedor)} // Usar la función de eliminación
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ProveedorTable;