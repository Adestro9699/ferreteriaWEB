import React, { useState } from 'react';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormLabel,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilCheck, cilX } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const TrabajadoresActions = ({ selectedTrabajadores, onActionComplete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('ACTIVO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteSelected = async () => {
    if (!selectedTrabajadores.length) return;

    setLoading(true);
    setError(null);

    try {
      const deletePromises = selectedTrabajadores.map(id => 
        apiClient.delete(`/trabajadores/${id}`)
      );
      
      await Promise.all(deletePromises);
      setShowDeleteModal(false);
      onActionComplete();
    } catch (error) {
      console.error('Error al eliminar trabajadores:', error);
      setError('Error al eliminar algunos trabajadores. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedTrabajadores.length) return;

    setLoading(true);
    setError(null);

    try {
      const updatePromises = selectedTrabajadores.map(id => 
        apiClient.put(`/trabajadores/${id}`, { estadoTrabajador: newStatus })
      );
      
      await Promise.all(updatePromises);
      setShowStatusModal(false);
      onActionComplete();
    } catch (error) {
      console.error('Error al cambiar estado de trabajadores:', error);
      setError('Error al cambiar el estado de algunos trabajadores. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedTrabajadores.length === 0) {
    return null;
  }

  return (
    <>
      <div className="d-flex gap-2 mb-3">
        <CButton
          color="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          <CIcon icon={cilTrash} className="me-2" />
          Eliminar Seleccionados ({selectedTrabajadores.length})
        </CButton>
        
        <CButton
          color="warning"
          size="sm"
          onClick={() => setShowStatusModal(true)}
        >
          <CIcon icon={cilCheck} className="me-2" />
          Cambiar Estado ({selectedTrabajadores.length})
        </CButton>
      </div>

      {/* Modal de Eliminación */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            ¿Está seguro de que desea eliminar {selectedTrabajadores.length} trabajador(es) seleccionado(s)?
          </p>
          <p className="text-danger">
            <strong>Esta acción no se puede deshacer.</strong>
          </p>
          {error && (
            <CAlert color="danger">
              {error}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancelar
          </CButton>
          <CButton
            color="danger"
            onClick={handleDeleteSelected}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Cambio de Estado */}
      <CModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Cambiar Estado de Trabajadores</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Cambiar el estado de {selectedTrabajadores.length} trabajador(es) seleccionado(s):
          </p>
          
          <div className="mb-3">
            <CFormLabel htmlFor="newStatus">Nuevo Estado</CFormLabel>
            <CFormSelect
              id="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </CFormSelect>
          </div>

          {error && (
            <CAlert color="danger">
              {error}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowStatusModal(false)}
            disabled={loading}
          >
            Cancelar
          </CButton>
          <CButton
            color="primary"
            onClick={handleChangeStatus}
            disabled={loading}
          >
            {loading ? 'Cambiando...' : 'Cambiar Estado'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default TrabajadoresActions; 