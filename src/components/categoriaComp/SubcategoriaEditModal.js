import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
} from '@coreui/react';

const SubcategoriaEditModal = ({ showEditModal, setShowEditModal, subcategoriaToEdit, handleSaveEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO',
  });

  useEffect(() => {
    if (subcategoriaToEdit) {
      setFormData({
        nombre: subcategoriaToEdit.nombre,
        descripcion: subcategoriaToEdit.descripcion,
        estado: subcategoriaToEdit.estado,
      });
    }
  }, [subcategoriaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleSaveEdit({ ...subcategoriaToEdit, ...formData });
    setShowEditModal(false);
  };

  return (
    <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
      <CModalHeader>
        <CModalTitle>Editar Subcategoría</CModalTitle>
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
        <CFormSelect
          label="Estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Guardar Cambios
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SubcategoriaEditModal;