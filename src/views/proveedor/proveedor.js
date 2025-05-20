import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CButton,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CSpinner,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { 
  cilX, 
  cilSearch,
  cilFilter,
  cilSortAlphaDown, 
  cilSortAlphaUp, 
  cilCloudDownload, 
  cilPlus,
  cilOptions,
  cilPencil,
  cilTrash
} from '@coreui/icons';
import apiClient from '../../services/apiClient';
import ProveedorTable from '../../components/proveedorComp/ProveedorTable';
import ProveedorModal from '../../components/proveedorComp/ProveedorModal';
import ProveedorFilters from '../../components/proveedorComp/ProveedorFilters';
import ProveedorPagination from '../../components/proveedorComp/ProveedorPagination';
import ProveedorCreateModal from '../../components/proveedorComp/ProveedorCreateModal';
import ProveedorEditModal from '../../components/proveedorComp/ProveedorEditModal';

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    status: 'ACTIVO',
    searchTerm: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteMultipleConfirmation, setShowDeleteMultipleConfirmation] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Función para agregar un toast
  const addToast = (message, color = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        message,
        color,
      },
    ]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Obtener proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await apiClient.get('/proveedores');
        setProveedores(response.data);
        setIsLoading(false);
      } catch (error) {
        setError('Error al cargar los proveedores');
        setIsLoading(false);
        addToast('Error al cargar los proveedores', 'danger');
      }
    };

    fetchProveedores();
  }, []);

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    setFilterText(e.target.value);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setFilterText('');
  };

  // Función para manejar el ordenamiento
  const handleAdvancedSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Función para reiniciar los filtros
  const resetFilters = () => {
    setFilters({
      status: 'ACTIVO',
      searchTerm: '',
    });
  };

  // Función para manejar la creación de un proveedor
  const handleCreateProveedor = async (newProveedor) => {
    try {
      const response = await apiClient.post('/proveedores', newProveedor);
      setProveedores([...proveedores, response.data]);
      setShowCreateModal(false);
      addToast('Proveedor creado correctamente', 'success');
    } catch (error) {
      addToast('Error al crear el proveedor', 'danger');
    }
  };

  // Función para manejar la edición
  const handleEdit = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowEditModal(true);
  };

  // Función para guardar cambios en la edición
  const handleSaveChanges = async (updatedProveedor) => {
    if (!updatedProveedor) return;

    try {
      const response = await apiClient.put(`/proveedores/${updatedProveedor.idProveedor}`, updatedProveedor);
      const updatedItems = proveedores.map((item) =>
        item.idProveedor === updatedProveedor.idProveedor ? response.data : item
      );
      setProveedores(updatedItems);
      addToast('Proveedor actualizado correctamente', 'success');
      setShowEditModal(false);
    } catch (error) {
      addToast('Error al actualizar el proveedor', 'danger');
    }
  };

  // Función para confirmar la eliminación
  const confirmDelete = (id) => {
    setProveedorToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Función para eliminar
  const handleDelete = async () => {
    if (!proveedorToDelete) return;

    try {
      await apiClient.delete(`/proveedores/${proveedorToDelete}`);
      const updatedItems = proveedores.filter((item) => item.idProveedor !== proveedorToDelete);
      setProveedores(updatedItems);
      addToast('Proveedor eliminado correctamente', 'success');
    } catch (error) {
      addToast('Error al eliminar el proveedor', 'danger');
    } finally {
      setShowDeleteConfirmation(false);
      setProveedorToDelete(null);
    }
  };

  // Función para manejar la selección de items
  const handleSelectItem = (id) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para seleccionar todos los items
  const handleSelectAll = () => {
    if (selectedItems.length === currentProveedores.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentProveedores.map((item) => item.idProveedor));
    }
  };

  // Función para eliminar los items seleccionados
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map((id) => apiClient.delete(`/proveedores/${id}`)));
      const updatedItems = proveedores.filter((item) => !selectedItems.includes(item.idProveedor));
      setProveedores(updatedItems);
      setSelectedItems([]);
      addToast('Proveedores eliminados correctamente', 'success');
    } catch (error) {
      addToast('Error al eliminar los proveedores', 'danger');
    } finally {
      setShowDeleteMultipleConfirmation(false);
    }
  };

  // Filtrar y ordenar proveedores
  const filteredProveedores = proveedores.filter((proveedor) => {
    const matchesStatus = filters.status === 'all' || proveedor.estado === filters.status;
    const matchesSearch = Object.values(proveedor).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  // Ordenar proveedores
  const sortedProveedores = [...filteredProveedores].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = sortedProveedores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProveedores.length / itemsPerPage);

  if (isLoading) {
    return (
      <CContainer fluid>
        <CCard className="mb-4">
          <CCardBody>
            <div className="text-center my-3">
              <CSpinner color="primary" />
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer fluid>
        <CCard className="mb-4">
          <CCardBody>
            <CAlert color="danger">{error}</CAlert>
          </CCardBody>
        </CCard>
      </CContainer>
    );
  }

  return (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="bg-body-secondary">
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">Gestión de Proveedores</h4>
            </CCol>
            <CCol xs="auto" className="d-flex gap-2">
              <CButton 
                color="primary"
                onClick={() => setShowCreateModal(true)}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Nuevo Proveedor
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {isLoading ? (
            <div className="text-center my-3">
              <CSpinner color="primary" />
            </div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : (
            <>
              <CRow className="mb-3">
                <CCol xs={12} md={6} className="mb-3 mb-md-0">
                  <CInputGroup>
                    <CFormInput
                      placeholder="Buscar proveedor..."
                      value={filterText}
                      onChange={handleSearchChange}
                    />
                    {filterText && (
                      <CInputGroupText 
                        role="button" 
                        className="bg-transparent cursor-pointer" 
                        onClick={clearSearch}
                      >
                        <CIcon icon={cilX} />
                      </CInputGroupText>
                    )}
                    <CButton 
                      color="primary" 
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <CIcon icon={cilFilter} />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CCol xs={12} md={6} className="d-flex justify-content-md-end">
                  {selectedItems.length > 0 && (
                    <CButton 
                      color="danger" 
                      variant="outline" 
                      className="w-100 w-md-auto"
                      onClick={() => setShowDeleteMultipleConfirmation(true)}
                    >
                      <CIcon icon={cilTrash} className="me-2" />
                      Eliminar Seleccionados ({selectedItems.length})
                    </CButton>
                  )}
                </CCol>
              </CRow>

              {showFilters && (
                <ProveedorFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  className="mb-3"
                />
              )}

              <div className="table-responsive">
                <ProveedorTable
                  proveedores={currentProveedores}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleAdvancedSort}
                />
              </div>

              <ProveedorPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(e) => setItemsPerPage(Number(e.target.value))}
              />
            </>
          )}
        </CCardBody>
      </CCard>

      <ProveedorCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProveedor}
      />

      <ProveedorEditModal
        show={showEditModal}
        proveedor={currentProveedor}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveChanges}
      />

      <CModal 
        visible={showDeleteConfirmation} 
        onClose={() => setShowDeleteConfirmation(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar este proveedor?
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancelar
          </CButton>
          <CButton 
            color="danger" 
            onClick={handleDelete}
          >
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={showDeleteMultipleConfirmation}
        onClose={() => setShowDeleteMultipleConfirmation(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación Múltiple</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar los {selectedItems.length} proveedores seleccionados?
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowDeleteMultipleConfirmation(false)}
          >
            Cancelar
          </CButton>
          <CButton 
            color="danger" 
            onClick={handleDeleteSelected}
          >
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast notifications */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show bg-${toast.color} text-white`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-transparent text-white">
              <strong className="me-auto">
                {toast.color === 'success' ? 'Éxito' : 'Error'}
              </strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              />
            </div>
            <div className="toast-body">{toast.message}</div>
          </div>
        ))}
      </div>
    </CContainer>
  );
};

export default Proveedor;