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
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CContainer,
  CButtonGroup,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

// Componente para la paginación y el selector de items por página
const PaginationComponent = ({ currentPage, totalPages, itemsPerPage, paginate, setItemsPerPage }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <CPagination aria-label="Page navigation example">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <CPaginationItem
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
      <CFormSelect
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(Number(e.target.value))}
        style={{ width: 'auto' }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </CFormSelect>
    </div>
  );
};

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

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteSelected = () => {
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items
    .filter(item => filter === 'all' || (filter === 'category' && !item.subcategoria) || (filter === 'subcategory' && item.subcategoria))
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Texto dinámico para el botón de crear
  const createButtonText = filter === 'category' ? 'Crear Categoría' : filter === 'subcategory' ? 'Crear Subcategoría' : 'Crear Categoría/Subcategoría';

  return (
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <CNavbar colorScheme="light" expand="lg" className="mb-4">
            <CContainer>
              <CNavbarBrand href="#" className="text-dark">Categorías</CNavbarBrand>
              <CNavbarNav className="me-auto">
                <CNavItem>
                  <CNavLink active={filter === 'all'} onClick={() => setFilter('all')} className="text-dark">
                    Todas
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
              </CNavbarNav>
            </CContainer>
          </CNavbar>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={6}>
                  <CFormInput
                    type="text"
                    placeholder="Buscar categoría/subcategoría..."
                  />
                </CCol>
                <CCol xs={6} className="text-end">
                  <CButton color="primary" className="me-2">
                    {createButtonText}
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>
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
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Descripción</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentItems.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>
                        <CFormCheck
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{item.nombre}</CTableDataCell>
                      <CTableDataCell>{item.descripcion}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.estado === 'Activo' ? 'success' : 'danger'}>
                          {item.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
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
              <CRow className="justify-content-center mt-4">
                <CCol xs={12} className="text-center">
                  {selectedItems.length > 0 && (
                    <CButton color="danger" onClick={handleDeleteSelected} className="mb-3">
                      Eliminar seleccionados
                    </CButton>
                  )}
                </CCol>
                <CCol xs={12} className="text-center">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    paginate={paginate}
                    setItemsPerPage={setItemsPerPage}
                  />
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