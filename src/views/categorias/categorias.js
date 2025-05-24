import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CSpinner,
  CAlert,
  CToaster, // Importar el contenedor de toasts
  CToast,   // Importar el componente de toast
  CToastHeader, // Importar el encabezado del toast
  CToastBody,   // Importar el cuerpo del toast 
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilX, cilList, cilPlus, cilFilter, cilSearch } from '@coreui/icons';
import apiClient from '../../services/apiClient';
import CategoriaList from '../../components/categoriaComp/CategoriaList';
import SubcategoriaTable from '../../components/categoriaComp/SubcategoriaTable';
import CategoriaCreateModal from '../../components/categoriaComp/CategoriaCreateModal';
import SubcategoriaCreateModal from '../../components/categoriaComp/SubcategoriaCreateModal';
import CategoriaEditModal from '../../components/categoriaComp/CategoriaEditModal';
import SubcategoriaEditModal from '../../components/categoriaComp/SubcategoriaEditModal';
import CategoriaPagination from '../../components/categoriaComp/CategoriaPagination';
import DeleteConfirmationModal from '../../components/categoriaComp/DeleteConfirmationModal';

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [showCreateCategoriaModal, setShowCreateCategoriaModal] = useState(false);
  const [showCreateSubcategoriaModal, setShowCreateSubcategoriaModal] = useState(false);
  const [showEditCategoriaModal, setShowEditCategoriaModal] = useState(false);
  const [showEditSubcategoriaModal, setShowEditSubcategoriaModal] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [subcategoriaToEdit, setSubcategoriaToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategoriaSearchTerm, setSubcategoriaSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSubcategorias, setSelectedSubcategorias] = useState([]);

  const [categoriaToDelete, setCategoriaToDelete] = useState(null); // ID de la categoría a eliminar
  const [subcategoriaToDelete, setSubcategoriaToDelete] = useState(null); // ID de la subcategoría a eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controla la visibilidad del modal

  const [estadoFilter, setEstadoFilter] = useState('activo'); // Cambia 'all' a 'activo'  

  const handleDeleteCategoria = (id) => {
    setCategoriaToDelete(id); // Establecer la categoría a eliminar
    setShowDeleteModal(true); // Mostrar el modal de confirmación
  };
  const handleDeleteSubcategoria = (id) => {
    setSubcategoriaToDelete(id); // Establecer la subcategoría a eliminar
    setShowDeleteModal(true); // Mostrar el modal de confirmación
  };
  const handleDeleteSelected = () => {
    setShowDeleteModal(true); // Mostrar el modal de confirmación
  };

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

  // Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiClient.get('/categorias');
        setCategorias(response.data);
      } catch (error) {
        setError('Error al cargar las categorías.');
        console.error('Error fetching categorías:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategoria) {
      const fetchSubcategorias = async () => {
        try {
          const response = await apiClient.get(`/subcategorias?categoria=${selectedCategoria.idCategoria}`);
          setSubcategorias(response.data);
        } catch (error) {
          console.error('Error fetching subcategorías:', error);
        }
      };
      fetchSubcategorias();
    } else {
      setSubcategorias([]);
    }
  }, [selectedCategoria]);

  // Crear una nueva categoría
  const handleCreateCategoria = async (newCategoria) => {
    try {
      const response = await apiClient.post('/categorias', newCategoria);
      setCategorias([...categorias, response.data]);
      setShowCreateCategoriaModal(false);
      addToast('Categoría creada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error creating categoría:', error);
      addToast('Error al crear la categoría.', 'error'); // Mensaje de error
    }
  };

  // Editar una categoría existente
  const handleSaveEditCategoria = async (updatedCategoria) => {
    try {
      await apiClient.put(`/categorias/${updatedCategoria.idCategoria}`, updatedCategoria);
      setCategorias(
        categorias.map((cat) =>
          cat.idCategoria === updatedCategoria.idCategoria ? updatedCategoria : cat
        )
      );
      setShowEditCategoriaModal(false);
      addToast('Categoría actualizada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error updating categoría:', error);
      addToast('Error al actualizar la categoría.', 'error'); // Mensaje de error
    }
  };

  // Crear una nueva subcategoría
  const handleCreateSubcategoria = async (newSubcategoria) => {
    try {
      const response = await apiClient.post('/subcategorias', newSubcategoria);
      setSubcategorias([...subcategorias, response.data]);
      setShowCreateSubcategoriaModal(false);
      addToast('Subcategoría creada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error creating subcategoría:', error);
      addToast('Error al crear la subcategoría.', 'error'); // Mensaje de error
    }
  };

  // Editar una subcategoría existente
  const handleSaveEditSubcategoria = async (updatedSubcategoria) => {
    try {
      await apiClient.put(`/subcategorias/${updatedSubcategoria.idSubcategoria}`, updatedSubcategoria);
      setSubcategorias(
        subcategorias.map((sub) =>
          sub.idSubcategoria === updatedSubcategoria.idSubcategoria ? updatedSubcategoria : sub
        )
      );
      setShowEditSubcategoriaModal(false);
      addToast('Subcategoría actualizada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error updating subcategoría:', error);
      addToast('Error al actualizar la subcategoría.', 'error'); // Mensaje de error
    }
  };

  // Eliminar una categoría
  const confirmDeleteCategoria = async () => {
    try {
      await apiClient.delete(`/categorias/${categoriaToDelete}`);
      setCategorias(categorias.filter((cat) => cat.idCategoria !== categoriaToDelete));
      addToast('Categoría eliminada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error deleting categoría:', error);
      addToast('Error al eliminar la categoría.', 'error'); // Mensaje de error
    } finally {
      setCategoriaToDelete(null); // Limpiar el estado
      setShowDeleteModal(false); // Cerrar el modal
    }
  };

  // Eliminar una subcategoría
  const confirmDeleteSubcategoria = async () => {
    try {
      await apiClient.delete(`/subcategorias/${subcategoriaToDelete}`);
      setSubcategorias(subcategorias.filter((sub) => sub.idSubcategoria !== subcategoriaToDelete));
      addToast('Subcategoría eliminada exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error deleting subcategoría:', error);
      addToast('Error al eliminar la subcategoría.', 'error'); // Mensaje de error
    } finally {
      setSubcategoriaToDelete(null); // Limpiar el estado
      setShowDeleteModal(false); // Cerrar el modal
    }
  };

  // Filtrar subcategorías por nombre, descripción o estado
  const filteredSubcategorias = subcategorias.filter((sub) => {
    const matchesSearch =
      sub.nombre.toLowerCase().includes(subcategoriaSearchTerm.toLowerCase()) ||
      sub.descripcion.toLowerCase().includes(subcategoriaSearchTerm.toLowerCase()) ||
      sub.estado.toLowerCase().includes(subcategoriaSearchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filtrar categorías según el estado
  const filteredCategorias = categorias.filter((cat) => {
    const matchesSearch =
      cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || // Buscar por nombre
      cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase()); // Buscar por descripción
    const matchesEstado =
      estadoFilter === 'all' || // Si el filtro es 'all', mostrar todas
      (estadoFilter === 'activo' && cat.estado === 'ACTIVO') || // Mostrar solo activas
      (estadoFilter === 'inactivo' && cat.estado === 'INACTIVO'); // Mostrar solo inactivas
    return matchesSearch && matchesEstado;
  });

  //Eliminar en grupo subcategorías
  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(selectedSubcategorias.map((id) => apiClient.delete(`/subcategorias/${id}`)));
      setSubcategorias((prevSubcategorias) =>
        prevSubcategorias.filter((sub) => !selectedSubcategorias.includes(sub.idSubcategoria))
      );
      setSelectedSubcategorias([]); // Limpiar la selección
      addToast('Subcategorías seleccionadas eliminadas exitosamente.', 'success'); // Mensaje de éxito
    } catch (error) {
      console.error('Error al eliminar subcategorías seleccionadas:', error);
      addToast('Error al eliminar las subcategorías seleccionadas.', 'error'); // Mensaje de error
    } finally {
      setShowDeleteModal(false); // Cerrar el modal
    }
  };

  // Paginación con subcategorías filtradas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubcategorias = filteredSubcategorias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubcategorias.length / itemsPerPage);

  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <CContainer fluid>
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            visible={true}
            autohide={true}
            delay={3000}
            onClose={() => removeToast(toast.id)}
            color={toast.type === 'success' ? 'success' : 'danger'}
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
      <CCard className="mb-4">
        <CCardHeader className="bg-body-secondary">
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">Gestión de Categorías</h4>
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
            <CRow>
              <CCol md={4} className="mb-3 mb-md-0">
                <CCard className="h-100 border-0 shadow-sm">
                  <CCardHeader className="bg-body-tertiary">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Categorías</h5>
                      <CButton 
                        color="primary"
                        size="sm"
                        onClick={() => setShowCreateCategoriaModal(true)}
                      >
                        <CIcon icon={cilPlus} className="me-2" />
                        Nueva Categoría
                      </CButton>
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    <CInputGroup className="mb-3">
                      <CFormInput
                        placeholder="Buscar categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <CButton color="secondary" variant="outline" onClick={clearSearch}>
                          <CIcon icon={cilX} />
                        </CButton>
                      )}
                    </CInputGroup>
                    <CFormSelect
                      className="mb-3"
                      value={estadoFilter}
                      onChange={(e) => setEstadoFilter(e.target.value)}
                    >
                      <option value="all">Todos los estados</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </CFormSelect>
                    <CategoriaList
                      categorias={filteredCategorias}
                      selectedCategoria={selectedCategoria}
                      setSelectedCategoria={setSelectedCategoria}
                      handleEdit={(categoria) => {
                        setCategoriaToEdit(categoria);
                        setShowEditCategoriaModal(true);
                      }}
                      handleDelete={handleDeleteCategoria}
                    />
                    <div className="mt-3">
                      <CategoriaPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        handleItemsPerPageChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={8}>
                <CCard className="h-100 border-0 shadow-sm">
                  <CCardHeader className="bg-body-tertiary">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        {selectedCategoria 
                          ? `Subcategorías de ${selectedCategoria.nombre}`
                          : 'Subcategorías'
                        }
                      </h5>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => setShowCreateSubcategoriaModal(true)}
                        disabled={!selectedCategoria}
                      >
                        <CIcon icon={cilPlus} className="me-2" />
                        Nueva Subcategoría
                      </CButton>
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    <CInputGroup className="mb-3">
                      <CFormInput
                        placeholder="Buscar subcategoría..."
                        value={subcategoriaSearchTerm}
                        onChange={(e) => setSubcategoriaSearchTerm(e.target.value)}
                      />
                      {subcategoriaSearchTerm && (
                        <CButton color="secondary" variant="outline" onClick={() => setSubcategoriaSearchTerm('')}>
                          <CIcon icon={cilX} />
                        </CButton>
                      )}
                    </CInputGroup>
                    {selectedSubcategorias.length > 0 && (
                      <div className="mb-3">
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={handleDeleteSelected}
                        >
                          Eliminar Seleccionados ({selectedSubcategorias.length})
                        </CButton>
                      </div>
                    )}
                    <SubcategoriaTable
                      subcategorias={currentSubcategorias || []}
                      selectedSubcategorias={selectedSubcategorias}
                      setSelectedSubcategorias={setSelectedSubcategorias}
                      handleEdit={(subcategoria) => {
                        setSubcategoriaToEdit(subcategoria);
                        setShowEditSubcategoriaModal(true);
                      }}
                      handleDelete={handleDeleteSubcategoria}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      {/* Modales */}
      <CategoriaCreateModal
        showCreateModal={showCreateCategoriaModal}
        setShowCreateModal={setShowCreateCategoriaModal}
        handleCreate={handleCreateCategoria}
      />
      <SubcategoriaCreateModal
        showCreateModal={showCreateSubcategoriaModal}
        setShowCreateModal={setShowCreateSubcategoriaModal}
        handleCreate={handleCreateSubcategoria}
        categorias={categorias}
        selectedCategoriaId={selectedCategoria?.idCategoria}
      />
      <CategoriaEditModal
        showEditModal={showEditCategoriaModal}
        setShowEditModal={setShowEditCategoriaModal}
        categoriaToEdit={categoriaToEdit}
        handleSaveEdit={handleSaveEditCategoria}
      />
      <SubcategoriaEditModal
        showEditModal={showEditSubcategoriaModal}
        setShowEditModal={setShowEditSubcategoriaModal}
        subcategoriaToEdit={subcategoriaToEdit}
        handleSaveEdit={handleSaveEditSubcategoria}
      />
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        entityToDelete={categoriaToDelete || subcategoriaToDelete}
        confirmDelete={categoriaToDelete ? confirmDeleteCategoria : confirmDeleteSubcategoria}
        confirmDeleteSelected={confirmDeleteSelected}
        entityType={categoriaToDelete ? 'categoría' : 'subcategoría'}
      />
    </CContainer>
  );
};

export default Categoria;