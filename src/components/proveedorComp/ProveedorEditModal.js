import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react';

const ProveedorEditModal = ({ showEditModal, setShowEditModal, proveedorToEdit, handleSaveEdit }) => {
  // Inicializar formData con valores predeterminados si proveedorToEdit es null
  const [formData, setFormData] = useState(
    proveedorToEdit || {
      idProveedor: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correoProveedor: '',
      pais: '',
      estado: 'Activo',
    }
  );

  // Actualizar formData cuando proveedorToEdit cambie
  useEffect(() => {
    if (proveedorToEdit) {
      setFormData(proveedorToEdit);
    }
  }, [proveedorToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleSaveEdit(formData);
    setShowEditModal(false);
  };

  return (
    <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
      <CModalHeader>
        <CModalTitle>Editar Proveedor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <CFormInput
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
          <CFormInput
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          <CFormInput
            label="Correo"
            name="correoProveedor"
            value={formData.correoProveedor}
            onChange={handleChange}
          />
          <CFormInput
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
          />
          <CFormSelect
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProveedorEditModal;