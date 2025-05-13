import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CSpinner,
  CAlert,
  CButton,
  CToaster, // Importar el contenedor de toasts
  CToast,   // Importar el componente de toast
  CToastHeader, // Importar el encabezado del toast
  CToastBody,   // Importar el cuerpo del toast
} from '@coreui/react';
import ProveedorTable from '../../components/proveedorComp/ProveedorTable';
import ProveedorModal from '../../components/proveedorComp/ProveedorModal';
import ProveedorFilters from '../../components/proveedorComp/ProveedorFilters';
import ProveedorPagination from '../../components/proveedorComp/ProveedorPagination';
import ProveedorCreateModal from '../../components/proveedorComp/ProveedorCreateModal';
import ProveedorEditModal from '../../components/proveedorComp/ProveedorEditModal';
import apiClient from '../../services/apiClient'; // Ajusta la ruta según tu estructura

const Proveedor = () => {
  // Estados para manejar los proveedores y la lógica de la vista
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [selectedProveedores, setSelectedProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('ACTIVO');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal de creación
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición
  const [proveedorToEdit, setProveedorToEdit] = useState(null); // Proveedor a editar

  // Nuevo estado para los toasts
  const [toasts, setToasts] = useState([]);

  // Función para agregar un nuevo toast
  const addToast = (message, type = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      type,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]); // Usar el estado anterior
  };

  // Función para eliminar un toast después de mostrarlo
  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  // Obtener proveedores desde el backend
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await apiClient.get('/proveedores');
        console.log('Datos recibidos del backend:', response.data);
        setProveedores(response.data);
      } catch (error) {
        setError('Error al cargar los proveedores. Por favor, inténtalo de nuevo.');
        console.error('Error fetching proveedores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  // Crear un nuevo proveedor
  const handleCreateProveedor = async (newProveedor) => {
    try {
      const response = await apiClient.post('/proveedores', newProveedor);
      setProveedores([...proveedores, response.data]);
      setShowCreateModal(false);

      // Mostrar toast de éxito
      addToast('Proveedor creado exitosamente.');
    } catch (error) {
      console.error('Error creating proveedor:', error);
      addToast('Error al crear el proveedor.', 'error'); // Mostrar toast de error
    }
  };

  // Editar un proveedor existente
  const handleSaveEdit = async (updatedProveedor) => {
    try {
      await apiClient.put(`/proveedores/${updatedProveedor.idProveedor}`, updatedProveedor);
      setProveedores(
        proveedores.map((p) =>
          p.idProveedor === updatedProveedor.idProveedor ? updatedProveedor : p
        )
      );
      setShowEditModal(false);

      // Mostrar toast de éxito
      addToast('Proveedor actualizado exitosamente.');
    } catch (error) {
      console.error('Error updating proveedor:', error);
      addToast('Error al actualizar el proveedor.', 'error'); // Mostrar toast de error
    }
  };

  // Eliminar un proveedor
  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/proveedores/${proveedorToDelete}`);
      setProveedores(proveedores.filter((p) => p.idProveedor !== proveedorToDelete));
      setProveedorToDelete(null);
      setShowDeleteModal(false);

      // Mostrar toast de éxito
      addToast('Proveedor eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting proveedor:', error);
      addToast('Error al eliminar el proveedor.', 'error'); // Mostrar toast de error
    }
  };

  // Eliminar múltiples proveedores
  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(selectedProveedores.map((id) => apiClient.delete(`/proveedores/${id}`)));
      setProveedores(proveedores.filter((p) => !selectedProveedores.includes(p.idProveedor)));
      setSelectedProveedores([]);
      setShowDeleteModal(false);

      // Mostrar toast de éxito
      addToast('Proveedores seleccionados eliminados exitosamente.');
    } catch (error) {
      setError('Error al eliminar los proveedores seleccionados. Por favor, inténtalo de nuevo.');
      console.error('Error deleting selected proveedores:', error);
      addToast('Error al eliminar los proveedores seleccionados.', 'error'); // Mostrar toast de error
    }
  };

  // Manejar la selección de proveedores
  const handleSelectProveedor = (idOrAll) => {
    if (Array.isArray(idOrAll)) {
      // Si se pasa un array, seleccionar/deseleccionar todos los registros
      setSelectedProveedores(idOrAll);
    } else {
      // Si se pasa un ID, manejar la selección/deselección individual
      if (selectedProveedores.includes(idOrAll)) {
        setSelectedProveedores(selectedProveedores.filter((item) => item !== idOrAll));
      } else {
        setSelectedProveedores([...selectedProveedores, idOrAll]);
      }
    }
  };

  // Ordenar proveedores
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrar y ordenar proveedores
  const sortedProveedores = [...proveedores].sort((a, b) => {
    if (sortField) {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtrar y ordenar proveedores
  const filteredProveedores = sortedProveedores.filter((proveedor) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'ACTIVO' && proveedor.estado === 'ACTIVO') || // Coincidir con el backend
      (statusFilter === 'INACTIVO' && proveedor.estado === 'INACTIVO'); // Coincidir con el backend

    const matchesSearch = Object.values(proveedor).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesStatus && matchesSearch;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);

  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Mostrar un spinner mientras se cargan los datos
  if (isLoading) {
    return (
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="auto">
            <CSpinner color="primary" />
          </CCol>
        </CRow>
      </CContainer>
    );
  }

  // Mostrar un mensaje de error si ocurre un problema
  if (error) {
    return (
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CAlert color="danger">{error}</CAlert>
          </CCol>
        </CRow>
      </CContainer>
    );
  }

  return (
    <CContainer>
      {/* Contenedor de toasts */}
      <CToaster placement="bottom-end">
        {console.log('Toaster renderizado')}
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            visible={true} // Asegura que el toast sea visible
            autohide={true}
            delay={3000}
            onClose={() => removeToast(toast.id)}
            color={toast.type === 'success' ? 'success' : 'danger'} // Opcional: define el color
          >
            <CToastHeader closeButton>
              <strong className="me-auto">
                {toast.type === 'success' ? 'Éxito' : 'Error'}
              </strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* Modal de Confirmación para Eliminar */}
      <ProveedorModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        proveedorToDelete={proveedorToDelete}
        confirmDelete={confirmDelete}
        confirmDeleteSelected={confirmDeleteSelected}
      />

      {/* Modal de Creación de Proveedor */}
      <ProveedorCreateModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        handleCreateProveedor={handleCreateProveedor}
      />

      {/* Modal de Edición de Proveedor */}
      <ProveedorEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        proveedorToEdit={proveedorToEdit}
        handleSaveEdit={handleSaveEdit}
      />

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <CRow className="mb-3"> {/* Margen inferior para separar los filtros */}
                <CCol xs={12} md={8}>
                  <ProveedorFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    clearSearch={clearSearch}
                  />
                </CCol>
                <CCol xs={12} md={4} className="text-end">
                  {/* Botones "Crear Proveedor" y "Exportar Data" */}
                  <div className="d-flex flex-column flex-md-row justify-content-end gap-2">
                    <CButton color="success" onClick={() => setShowCreateModal(true)}>
                      Crear Proveedor
                    </CButton>
                    <CButton color="primary" disabled>
                      Exportar Data
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {/* Botón "Eliminar Seleccionados" en la parte izquierda */}
              <div className="d-flex justify-content-start mb-3">
                {selectedProveedores.length > 0 && (
                  <CButton
                    color="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Eliminar Seleccionados ({selectedProveedores.length})
                  </CButton>
                )}
              </div>

              {/* Tabla de proveedores */}
              <ProveedorTable
                proveedores={currentProveedores}
                selectedProveedores={selectedProveedores}
                handleSelectProveedor={handleSelectProveedor}
                handleSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                const handleDelete={(id) => {
                  setProveedorToDelete(id); // Establecer el ID del proveedor a eliminar
                  setShowDeleteModal(true); // Mostrar el modal de confirmación
                }}
                handleEdit={(proveedor) => {
                  setProveedorToEdit(proveedor);
                  setShowEditModal(true);
                }}
              />

              {/* Paginación y selector de cantidad de elementos */}
              <div className="d-flex justify-content-center mt-3">
                <ProveedorPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  handleItemsPerPageChange={(e) => setItemsPerPage(Number(e.target.value))}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Proveedor;