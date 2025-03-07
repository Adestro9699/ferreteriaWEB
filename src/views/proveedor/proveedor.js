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
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal de creación
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición
  const [proveedorToEdit, setProveedorToEdit] = useState(null); // Proveedor a editar

  // Obtener proveedores desde el backend
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await apiClient.get('/fs/proveedores');
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
      const response = await apiClient.post('/fs/proveedores', newProveedor);
      setProveedores([...proveedores, response.data]); // Agregar el nuevo proveedor a la lista
      setShowCreateModal(false); // Cerrar el modal
    } catch (error) {
      setError('Error al crear el proveedor. Por favor, inténtalo de nuevo.');
      console.error('Error creating proveedor:', error);
    }
  };

  // Editar un proveedor existente
  const handleSaveEdit = async (updatedProveedor) => {
    try {
      await apiClient.put(`/fs/proveedores/${updatedProveedor.idProveedor}`, updatedProveedor);
      setProveedores(
        proveedores.map((p) =>
          p.idProveedor === updatedProveedor.idProveedor ? updatedProveedor : p
        )
      ); // Actualizar el proveedor en la lista
      setShowEditModal(false); // Cerrar el modal
    } catch (error) {
      setError('Error al actualizar el proveedor. Por favor, inténtalo de nuevo.');
      console.error('Error updating proveedor:', error);
    }
  };

  // Eliminar un proveedor
  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/fs/proveedores/${proveedorToDelete}`);
      setProveedores(proveedores.filter((p) => p.idProveedor !== proveedorToDelete));
      setProveedorToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      setError('Error al eliminar el proveedor. Por favor, inténtalo de nuevo.');
      console.error('Error deleting proveedor:', error);
    }
  };

  // Eliminar múltiples proveedores
  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(selectedProveedores.map((id) => apiClient.delete(`/fs/proveedores/${id}`)));
      setProveedores(proveedores.filter((p) => !selectedProveedores.includes(p.idProveedor)));
      setSelectedProveedores([]);
      setShowDeleteModal(false);
    } catch (error) {
      setError('Error al eliminar los proveedores seleccionados. Por favor, inténtalo de nuevo.');
      console.error('Error deleting selected proveedores:', error);
    }
  };

  // Manejar la selección de proveedores
  const handleSelectProveedor = (id) => {
    if (selectedProveedores.includes(id)) {
      setSelectedProveedores(selectedProveedores.filter((item) => item !== id));
    } else {
      setSelectedProveedores([...selectedProveedores, id]);
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

  const filteredProveedores = sortedProveedores.filter((proveedor) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && proveedor.estado === 'Activo') ||
      (statusFilter === 'inactive' && proveedor.estado === 'Inactivo');
    const matchesSearch =
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.correoProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase());
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
              <CRow>
                <CCol xs={8}>
                  <ProveedorFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    clearSearch={clearSearch}
                  />
                </CCol>
                <CCol xs={4} className="text-end">
                  <CButton color="success" onClick={() => setShowCreateModal(true)}>
                    Crear Proveedor
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <ProveedorTable
                proveedores={currentProveedores}
                selectedProveedores={selectedProveedores}
                handleSelectProveedor={handleSelectProveedor}
                handleSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                handleDelete={(id) => setProveedorToDelete(id)}
                handleEdit={(proveedor) => {
                  setProveedorToEdit(proveedor);
                  setShowEditModal(true);
                }}
              />
              <ProveedorPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                handleItemsPerPageChange={(e) => setItemsPerPage(Number(e.target.value))}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Proveedor;