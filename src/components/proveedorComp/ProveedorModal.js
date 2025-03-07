import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const ProveedorModal = ({ showDeleteModal, setShowDeleteModal, proveedorToDelete, confirmDelete, confirmDeleteSelected }) => {
  return (
    <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
      <CModalHeader>
        <CModalTitle>Confirmar Eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>
        ¿Estás seguro de que deseas eliminar {proveedorToDelete ? 'este proveedor' : 'los proveedores seleccionados'}?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
        <CButton color="danger" onClick={proveedorToDelete ? confirmDelete : confirmDeleteSelected}>
          Eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProveedorModal;