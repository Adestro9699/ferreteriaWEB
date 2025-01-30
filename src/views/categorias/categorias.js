import React, { useState } from 'react';
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

const Categoria = () => {
  const [items, setItems] = useState([
    { id: 1, nombre: 'Categoría 1', descripcion: 'Descripción 1', estado: 'Activo', subcategoria: false },
    { id: 2, nombre: 'Subcategoría 1.1', descripcion: 'Descripción 1.1', estado: 'Activo', subcategoria: true },
    { id: 3, nombre: 'Categoría 2', descripcion: 'Descripción 2', estado: 'Inactivo', subcategoria: false },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState('all'); // 'all', 'category', 'subcategory'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = () => {
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setShowDeleteModal(false);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setItems(items.filter(item => item.id !== itemToDelete));
    setItemToDelete(null);
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

  const sortedItems = [...items].sort((a, b) => {
    if (sortField) {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredItems = sortedItems.filter(item => {
    const matchesFilter = filter === 'all' || (filter === 'category' && !item.subcategoria) || (filter === 'subcategory' && item.subcategoria);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && item.estado === 'Activo') || (statusFilter === 'inactive' && item.estado === 'Inactivo');
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesStatus && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const createButtonText = filter === 'category' ? 'Crear Categoría' : filter === 'subcategory' ? 'Crear Subcategoría' : 'Crear Categoría/Subcategoría';

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
          ¿Estás seguro de que deseas eliminar {itemToDelete ? 'este ítem' : 'los ítems seleccionados'}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={itemToDelete ? confirmDelete : confirmDeleteSelected}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
        <CNavbar colorScheme="light" expand="lg" className="mb-4 shadow-sm rounded">
  <CContainer>
    <CNavbarNav className="w-100 d-flex justify-content-between align-items-center">
      {/* Elementos a la izquierda */}
      <div className="d-flex align-items-center">
        <CNavItem>
          <CNavLink
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            className={`${filter === 'all' ? 'fw-bold' : ''}`}
            style={{
              backgroundColor: filter === 'all'
                ? (document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#ffffff' : '#f8f9fa')
                : (document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#343a40' : 'transparent'),
              color: filter === 'all'
                ? (document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#000000' : '#000000')
                : (document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#ffffff' : '#000000'),
              border: filter === 'all' ? '1px solid #ddd' : 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              transition: 'all 0.3s ease',
            }}
          >
            TODAS
          </CNavLink>
        </CNavItem>
        <CButtonGroup className="ms-3">
          <CButton
            color={filter === 'category' ? 'primary' : 'secondary'}
            onClick={() => setFilter('category')}
          >
            Categorías
          </CButton>
          <CButton
            color={filter === 'subcategory' ? 'primary' : 'secondary'}
            onClick={() => setFilter('subcategory')}
          >
            Subcategorías
          </CButton>
        </CButtonGroup>
      </div>

      {/* CFormSelect alineado a la derecha */}
      <CFormSelect
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="ms-3" // Agrega un margen izquierdo para separarlo de los botones
        style={{
          width: '200px', // Define un ancho fijo o máximo
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
                      placeholder="Buscar categoría/subcategoría..."
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
                    {createButtonText}
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
                        checked={selectedItems.length === items.length}
                        onChange={() => {
                          if (selectedItems.length === items.length) {
                            setSelectedItems([]);
                          } else {
                            setSelectedItems(items.map(item => item.id));
                          }
                        }}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '200px' }} onClick={() => handleSort('nombre')}>
                      Nombre {sortField === 'nombre' ? (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      ) : ''}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '300px' }} onClick={() => handleSort('descripcion')}>
                      Descripción {sortField === 'descripcion' ? (
                        <span style={{ color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? '#fff' : '#000' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      ) : ''}
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '100px' }}>Estado</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }}>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentItems.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell style={{ width: '50px' }}>
                        <CFormCheck
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '200px' }}>{item.nombre}</CTableDataCell>
                      <CTableDataCell style={{ width: '300px' }}>{item.descripcion}</CTableDataCell>
                      <CTableDataCell style={{ width: '100px' }}>
                        <CBadge color={item.estado === 'Activo' ? 'success' : 'danger'}>
                          {item.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '150px' }}>
                        <CButton color="warning" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(item.id)}>
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
                  {selectedItems.length > 0 && (
                    <CButton color="danger" onClick={handleDeleteSelected}>
                      Eliminar Seleccionados ({selectedItems.length})
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

export default Categoria;