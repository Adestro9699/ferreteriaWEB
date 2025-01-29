import React, { useState } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader, // Puedes eliminar esta línea si no la usas en otro lugar
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormCheck,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react';

const Proveedor = () => {
  // Datos de ejemplo (simulando una respuesta de la base de datos)
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: 'Proveedor Ejemplo S.A.',
      direccion: 'Calle Falsa 123',
      telefono: '+123 456 789',
      correoProveedor: 'proveedor@ejemplo.com',
      pais: 'Argentina',
      fechaRegistro: '2023-10-01',
      estado: 'ACTIVO',
    },
    {
      id: 2,
      nombre: 'Otro Proveedor S.R.L.',
      direccion: 'Avenida Siempre Viva 456',
      telefono: '+987 654 321',
      correoProveedor: 'contacto@otroproveedor.com',
      pais: 'Chile',
      fechaRegistro: '2023-09-15',
      estado: 'INACTIVO',
    },
    // Agrega más proveedores aquí para probar la paginación
  ]);

  // Estado para manejar los proveedores seleccionados
  const [selectedProveedores, setSelectedProveedores] = useState([]);

  // Estado para manejar la página actual
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para manejar la cantidad de elementos por página
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Función para manejar la selección/deselección de un proveedor
  const handleSelectProveedor = (id) => {
    if (selectedProveedores.includes(id)) {
      setSelectedProveedores(selectedProveedores.filter((proveedorId) => proveedorId !== id));
    } else {
      setSelectedProveedores([...selectedProveedores, id]);
    }
  };

  // Función para seleccionar/deseleccionar todos los proveedores
  const handleSelectAll = () => {
    if (selectedProveedores.length === proveedores.length) {
      setSelectedProveedores([]);
    } else {
      setSelectedProveedores(proveedores.map((proveedor) => proveedor.id));
    }
  };

  // Función para eliminar los proveedores seleccionados
  const handleDeleteSelected = () => {
    const updatedProveedores = proveedores.filter(
      (proveedor) => !selectedProveedores.includes(proveedor.id)
    );
    setProveedores(updatedProveedores);
    setSelectedProveedores([]); // Limpiar la selección después de eliminar
  };

  // Función para manejar el cambio en la cantidad de elementos por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar la cantidad de elementos por página
  };

  // Calcular los proveedores que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = proveedores.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <CContainer>
  <CCard>
    <CCardBody>
      {/* Tabla de proveedores */}
      <CTable striped bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <CFormCheck
                checked={selectedProveedores.length === proveedores.length}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Dirección</CTableHeaderCell>
            <CTableHeaderCell>Teléfono</CTableHeaderCell>
            <CTableHeaderCell>Correo</CTableHeaderCell>
            <CTableHeaderCell>País</CTableHeaderCell>
            <CTableHeaderCell>Fecha de Registro</CTableHeaderCell>
            <CTableHeaderCell>Estado</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentProveedores.map((proveedor) => (
            <CTableRow key={proveedor.id}>
              <CTableDataCell>
                <CFormCheck
                  checked={selectedProveedores.includes(proveedor.id)}
                  onChange={() => handleSelectProveedor(proveedor.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{proveedor.nombre}</CTableDataCell>
              <CTableDataCell>{proveedor.direccion}</CTableDataCell>
              <CTableDataCell>{proveedor.telefono}</CTableDataCell>
              <CTableDataCell>{proveedor.correoProveedor}</CTableDataCell>
              <CTableDataCell>{proveedor.pais}</CTableDataCell>
              <CTableDataCell>{proveedor.fechaRegistro}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={proveedor.estado === 'ACTIVO' ? 'success' : 'danger'}>
                  {proveedor.estado}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="primary" size="sm">
                  Editar
                </CButton>{' '}
                <CButton color="danger" size="sm">
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Sección de eliminación múltiple, paginación y selección de items por página */}
      <CRow className="mt-3 align-items-center p-3 bg-body rounded mb-3">
        <CCol xs="auto" className="d-flex align-items-center">
          {selectedProveedores.length > 0 && (
            <CButton color="danger" onClick={handleDeleteSelected}>
              Eliminar Seleccionados ({selectedProveedores.length})
            </CButton>
          )}
        </CCol>
        <CCol className="d-flex align-items-center justify-content-center">
          <CPagination className="mb-0">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </CPaginationItem>
            {Array.from({ length: Math.ceil(proveedores.length / itemsPerPage) }, (_, i) => (
              <CPaginationItem
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(proveedores.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
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
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</CContainer>
  );
};

export default Proveedor;