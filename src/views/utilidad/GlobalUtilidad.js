import React, { useState, useEffect } from 'react';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CAlert, 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter, 
  CButton, 
  CPagination, 
  CPaginationItem, 
  CFormSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react';
import GlobalForm from '../../components/utilidadComp/GlobalForm';
import GlobalTable from '../../components/utilidadComp/GlobalTable';
import apiClient from '../../services/apiClient';

const GlobalUtilidad = () => {
  const [parametros, setParametros] = useState([]);
  const [editingParam, setEditingParam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteParam, setDeleteParam] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchParametros();
  }, [currentPage, itemsPerPage]);

  const addToast = (message, color = 'success') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      color,
      show: true
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const fetchParametros = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/parametros');
      setParametros(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar parámetros:', err);
      setError(err.response?.data?.message || 'Error al cargar parámetros');
      addToast(err.response?.data?.message || 'Error al cargar parámetros', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingParam) {
        const updatedData = {
          valor: formData.valor,
          descripcion: formData.descripcion || editingParam.descripcion,
          observaciones: formData.observaciones || editingParam.observaciones
        };

        await apiClient.put(`/parametros/${editingParam.clave}`, updatedData);
        addToast('Parámetro actualizado exitosamente');
      } else {
        await apiClient.post('/parametros', formData);
        addToast('Parámetro creado exitosamente');
      }
      
      setEditingParam(null);
      fetchParametros();
    } catch (err) {
      console.error('Error al guardar:', err);
      addToast(err.response?.data?.message || 'Error al guardar parámetro', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (clave) => {
    setDeleteParam(clave);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const url = `/parametros/${encodeURIComponent(deleteParam)}`;
      await apiClient.delete(url);
      addToast('Parámetro eliminado exitosamente');
      fetchParametros();
    } catch (err) {
      console.error('Error al eliminar parámetro:', err);
      addToast(err.response?.data?.message || 'Error al eliminar parámetro', 'danger');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteParam(null);
    }
  };

  // Cálculo de paginación
  const totalPages = Math.ceil(parametros.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = parametros.slice(startIndex, endIndex);

  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>Configuración Global</h5>
          <small className="text-medium-emphasis">IGV y Utilidad General</small>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          <GlobalForm 
            onSubmit={handleSubmit} 
            initialData={editingParam} 
            loading={loading} 
          />
          <GlobalTable 
            data={currentItems} 
            onEdit={setEditingParam} 
            onDelete={handleDelete} 
            loading={loading}
          />
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3">
              <CPagination className="me-3" aria-label="Page navigation">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  Primera
                </CPaginationItem>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
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
                  onClick={() => setCurrentPage(p => p + 1)}
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
              <CFormSelect
                style={{ width: '150px' }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10 registros</option>
                <option value="20">20 registros</option>
                <option value="30">30 registros</option>
              </CFormSelect>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de confirmación de eliminación */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar el parámetro {deleteParam}?
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

      {/* Toaster para notificaciones */}
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            delay={3000}
            color={toast.color}
            visible={toast.show}
          >
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Éxito' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </>
  );
};

export default GlobalUtilidad;