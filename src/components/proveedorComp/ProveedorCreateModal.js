import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormInput, CFormSelect } from '@coreui/react';

const ProveedorCreateModal = ({ showCreateModal, setShowCreateModal, handleCreateProveedor }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoProveedor: '',
    pais: '',
    estado: 'Activo',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleCreateProveedor(formData);
    setShowCreateModal(false);
  };

  return (
    <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
      <CModalHeader>
        <CModalTitle>Crear Proveedor</CModalTitle>
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
        <CButton color="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</CButton>
        <CButton color="primary" onClick={handleSubmit}>Crear</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProveedorCreateModal;