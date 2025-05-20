import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import CategoryForm from './CategoryForm';

const CategoryTable = ({ currentPage, itemsPerPage, onDelete, onSuccess, onError }) => {
  const [utilidades, setUtilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchUtilidades();
  }, []);

  const fetchUtilidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/utilidades/categoria');
      const formattedData = response.data.map(item => ({
        idUtilidad: item.idUtilidad,
        categoria: item.categoria,
        porcentajeUtilidad: item.porcentajeUtilidad
      }));
      setUtilidades(formattedData);
    } catch (err) {
      console.error('Error al cargar utilidades:', err);
      setError(err.response?.data?.message || 'Error al cargar utilidades');
      onError(err.response?.data?.message || 'Error al cargar utilidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteItem(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/utilidades/${deleteItem}`);
      onSuccess('Configuración eliminada correctamente');
      fetchUtilidades();
    } catch (err) {
      console.error('Error al eliminar:', err);
      onError(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const currentItems = utilidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

      <div className="mb-4">
        <h4>{editingId ? 'Editar Utilidad' : 'Crear Nueva Utilidad'}</h4>
        <CategoryForm
          utilidad={editingId ? utilidades.find(u => u.idUtilidad === editingId) : null}
          onCancel={handleCancelEdit}
          onSaved={() => {
            fetchUtilidades();
            setEditingId(null);
            setError(null);
            onSuccess('Configuración guardada correctamente');
          }}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Utilidad (%)</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="3" className="text-center">
                    No hay utilidades por categoría configuradas
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentItems.map((utilidad) => (
                  <CTableRow key={utilidad.idUtilidad}>
                    <CTableDataCell>{utilidad.categoria?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">
                        {utilidad.porcentajeUtilidad}%
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(utilidad.idUtilidad)}
                      >
                        Editar
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(utilidad.idUtilidad)}
                      >
                        Eliminar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>

          {/* Modal de confirmación de eliminación */}
          <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
            <CModalHeader>
              <CModalTitle>Confirmar Eliminación</CModalTitle>
            </CModalHeader>
            <CModalBody>
              ¿Está seguro que desea eliminar esta configuración?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </CButton>
              <CButton color="danger" onClick={confirmDelete}>
                Eliminar
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </>
  );
};

export default CategoryTable;