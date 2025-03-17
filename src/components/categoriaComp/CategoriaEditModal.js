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

const CategoriaEditModal = ({ showEditModal, setShowEditModal, categoriaToEdit, handleSaveEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO',
  });

  useEffect(() => {
    if (categoriaToEdit) {
      setFormData({
        nombre: categoriaToEdit.nombre,
        descripcion: categoriaToEdit.descripcion,
        estado: categoriaToEdit.estado,
      });
    }
  }, [categoriaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleSaveEdit({ ...categoriaToEdit, ...formData });
    setShowEditModal(false);
  };

  return (
    <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
      <CModalHeader>
        <CModalTitle>Editar Categoría</CModalTitle>
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

export default CategoriaEditModal;