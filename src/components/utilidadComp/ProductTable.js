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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import ProductForm from './ProductForm'; // Importa el formulario

const ProductTable = ({ currentPage, itemsPerPage, onDelete, onSuccess, onError }) => {
  const [utilidades, setUtilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // Estado para edición
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchUtilidades();
  }, []);

  const fetchUtilidades = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/fs/utilidades/producto');
      setUtilidades(response.data);
    } catch (err) {
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
      await apiClient.delete(`/fs/utilidades/${deleteItem}`);
      onSuccess('Configuración eliminada correctamente');
      fetchUtilidades();
    } catch (err) {
      onError(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id); // Establece el ID de la utilidad que se está editando
  };

  const handleCancelEdit = () => {
    setEditingId(null); // Cancela la edición
  };

  const currentItems = utilidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(utilidades.length / itemsPerPage);

  if (loading) return <CSpinner color="primary" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      {/* Formulario: Crear o Editar */}
      <div>
        <h4>{editingId ? 'Editar Utilidad' : 'Crear Nueva Utilidad'}</h4>
        <ProductForm
          key={editingId || 'create'} // Clave dinámica para evitar duplicados
          utilidad={editingId ? utilidades.find((u) => u.idUtilidad === editingId) : null}
          onCancel={handleCancelEdit}
          onSaved={() => {
            fetchUtilidades(); // Refresca la tabla
            setEditingId(null); // Regresa al modo "crear"
            onSuccess('Configuración guardada correctamente');
          }}
        />
      </div>

      {/* Tabla de utilidades */}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Producto</CTableHeaderCell>
            <CTableHeaderCell>Marca</CTableHeaderCell>
            <CTableHeaderCell>Utilidad (%)</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No hay utilidades específicas configuradas
              </CTableDataCell>
            </CTableRow>
          ) : (
            currentItems.map((utilidad) => (
              <CTableRow key={utilidad.idUtilidad}>
                <CTableDataCell>{utilidad.producto.nombreProducto}</CTableDataCell>
                <CTableDataCell>{utilidad.producto.marca}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="success">{utilidad.porcentajeUtilidad}%</CBadge>
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

      {/* Paginación */}
      {totalPages > 1 && (
        <CPagination className="mt-3" align="center">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            Primera
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            &laquo;
          </CPaginationItem>
          {[...Array(totalPages)].map((_, i) => (
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
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &raquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Última
          </CPaginationItem>
        </CPagination>
      )}

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
  );
};

export default ProductTable;