import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormCheck,
  CNavbar,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CContainer,
  CButtonGroup,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilX } from '@coreui/icons';

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: 'Proveedor 1',
      direccion: 'Calle 123, Ciudad',
      telefono: '123456789',
      correo: 'proveedor1@example.com',
      pais: 'México',
      fechaRegistro: '2023-10-01',
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Proveedor 2',
      direccion: 'Avenida 456, Ciudad',
      telefono: '987654321',
      correo: 'proveedor2@example.com',
      pais: 'España',
      fechaRegistro: '2023-09-15',
      estado: 'Inactivo',
    },
  ]);

  const [selectedProveedores, setSelectedProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [sortField, setSortField] = useState('nombre'); // Ordenar por 'nombre' por defecto
  const [sortDirection, setSortDirection] = useState('asc'); // Orden ascendente por defecto
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ordenar los proveedores al cargar el componente
  useEffect(() => {
    const sorted = [...proveedores].sort((a, b) => {
      if (a.nombre < b.nombre) return sortDirection === 'asc' ? -1 : 1;
      if (a.nombre > b.nombre) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setProveedores(sorted);
  }, []); // Solo se ejecuta una vez al cargar el componente

  const handleSelectProveedor = (id) => {
    if (selectedProveedores.includes(id)) {
      setSelectedProveedores(selectedProveedores.filter(item => item !== id));
    } else {
      setSelectedProveedores([...selectedProveedores, id]);
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = () => {
    setProveedores(proveedores.filter(proveedor => !selectedProveedores.includes(proveedor.id)));
    setSelectedProveedores([]);
    setShowDeleteModal(false);
  };

  const handleDelete = (id) => {
    setProveedorToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProveedores(proveedores.filter(proveedor => proveedor.id !== proveedorToDelete));
    setProveedorToDelete(null);
    setShowDeleteModal(false);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProveedores = [...proveedores].sort((a, b) => {
    if (sortField) {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredProveedores = sortedProveedores.filter(proveedor => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && proveedor.estado === 'Activo') || (statusFilter === 'inactive' && proveedor.estado === 'Inactivo');
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <CContainer>
      {/* Modal de Confirmación para Eliminar */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar {proveedorToDelete ? 'este proveedor' : 'los proveedores seleccionados'}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={proveedorToDelete ? confirmDelete : confirmDeleteSelected}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CNavbar colorScheme="light" expand="lg" className="mb-4 shadow-sm rounded">
            <CContainer>
              <CNavbarNav className="w-100 d-flex justify-content-between align-items-center">
                {/* Filtro de estado */}
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ms-3"
                  style={{
                    width: '200px',
                    backgroundColor: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#343a40' : '#ffffff',
                    color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#ffffff' : '#000000',
                  }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </CFormSelect>
              </CNavbarNav>
            </CContainer>
          </CNavbar>
          <CCard className="mb-4 shadow-sm rounded">
            <CCardHeader>
              <CRow>
                <CCol xs={6}>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      placeholder="Buscar proveedor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CInputGroupText>
                      <CButton color="transparent" size="sm" onClick={clearSearch}>
                        <CIcon icon={cilX} />
                      </CButton>
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol xs={6} className="text-end">
                  <CButton color="primary" className="me-2">
                    Crear Proveedor
                  </CButton>
                  <CButton color="success" onClick={() => alert('Exportar a CSV')}>
                    Exportar a CSV
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '50px' }}>
                      <CFormCheck
                        checked={selectedProveedores.length === proveedores.length}
                        onChange={() => {
                          if (selectedProveedores.length === proveedores.length) {
                            setSelectedProveedores([]);
                          } else {
                            setSelectedProveedores(proveedores.map(proveedor => proveedor.id));
                          }
                        }}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('nombre')}>
                      Nombre {sortField === 'nombre' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('direccion')}>
                      Dirección {sortField === 'direccion' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('telefono')}>
                      Teléfono {sortField === 'telefono' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('correo')}>
                      Correo {sortField === 'correo' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('pais')}>
                      País {sortField === 'pais' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }} onClick={() => handleSort('fechaRegistro')}>
                      Fecha de Registro {sortField === 'fechaRegistro' && (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '100px' }}>Estado</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }}>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentProveedores.map((proveedor) => (
                    <CTableRow key={proveedor.id}>
                      <CTableDataCell style={{ width: '50px' }}>
                        <CFormCheck
                          checked={selectedProveedores.includes(proveedor.id)}
                          onChange={() => handleSelectProveedor(proveedor.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '200px' }}>{proveedor.nombre}</CTableDataCell>
                      <CTableDataCell style={{ width: '200px' }}>{proveedor.direccion}</CTableDataCell>
                      <CTableDataCell style={{ width: '150px' }}>{proveedor.telefono}</CTableDataCell>
                      <CTableDataCell style={{ width: '200px' }}>{proveedor.correo}</CTableDataCell>
                      <CTableDataCell style={{ width: '150px' }}>{proveedor.pais}</CTableDataCell>
                      <CTableDataCell style={{ width: '150px' }}>{proveedor.fechaRegistro}</CTableDataCell>
                      <CTableDataCell style={{ width: '100px' }}>
                        <CBadge color={proveedor.estado === 'Activo' ? 'success' : 'danger'}>
                          {proveedor.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '150px' }}>
                        <CButton color="warning" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(proveedor.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Paginación y Selector de items por página */}
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
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Proveedor;