import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const DeleteConfirmationModal = ({
  showDeleteModal,
  setShowDeleteModal,
  entityToDelete,
  confirmDelete,
  confirmDeleteSelected,
  entityType = 'elemento', // Por defecto, "elemento"
}) => {
  return (
    <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
      <CModalHeader>
        <CModalTitle>Confirmar Eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>
        ¿Estás seguro de que deseas eliminar{' '}
        {entityToDelete ? `esta ${entityType}` : `los ${entityType}s seleccionados`}?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </CButton>
        <CButton
          color="danger"
          onClick={entityToDelete ? confirmDelete : confirmDeleteSelected}
        >
          Eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteConfirmationModal;