import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput } from '@coreui/react';

const CategoriaCreateModal = ({ showCreateModal, setShowCreateModal, handleCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleCreate(formData);
    setFormData({ nombre: '', descripcion: '', estado: 'ACTIVO' });
    setShowCreateModal(false);
  };

  return (
    <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
      <CModalHeader>
        <CModalTitle>Nueva Categoría</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <CFormInput
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Crear
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CategoriaCreateModal;