import React, { useState } from 'react';
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

const ProveedorCreateModal = ({ show, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoProveedor: '',
    pais: '',
    estado: 'Activo',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoProveedor: '',
    pais: '',
  });

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir la primera letra en mayúscula para campos específicos
    let formattedValue = value;
    if (['nombre', 'direccion', 'pais'].includes(name) && value.length > 0) {
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe comenzar con mayúscula.';
    }
  
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.direccion)) {
      newErrors.direccion = 'La dirección debe comenzar con mayúscula.';
    }
  
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^[\d\s\-]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números, espacios o guiones.';
    }
  
    if (!formData.correoProveedor.trim()) {
      newErrors.correoProveedor = 'El correo es obligatorio.';
    } else if (!emailRegex.test(formData.correoProveedor.trim())) {
      newErrors.correoProveedor = 'El correo debe tener un formato válido.';
    }
  
    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es obligatorio.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.pais)) {
      newErrors.pais = 'El país debe comenzar con mayúscula.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      ...formData,
      fechaRegistro: new Date().toISOString().split('T')[0],
      estado: formData.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO',
    };
    onCreate(dataToSend);

    // Reiniciar el formulario
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      correoProveedor: '',
      pais: '',
      estado: 'Activo',
    });
  };

  return (
    <CModal
      visible={show}
      onClose={onClose}
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader>
        <CModalTitle>Agregar nuevo Proveedor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            className="mb-3"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            invalid={!!errors.nombre}
            feedback={errors.nombre}
          />

          <CFormInput
            className="mb-3"
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            invalid={!!errors.direccion}
            feedback={errors.direccion}
          />

          <CFormInput
            className="mb-3"
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            invalid={!!errors.telefono}
            feedback={errors.telefono}
          />

          <CFormInput
            className="mb-3"
            label="Correo"
            name="correoProveedor"
            value={formData.correoProveedor}
            onChange={handleChange}
            invalid={!!errors.correoProveedor}
            feedback={errors.correoProveedor}
          />

          <CFormInput
            className="mb-3"
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            invalid={!!errors.pais}
            feedback={errors.pais}
          />

          <CFormSelect
            className="mb-3"
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
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Crear
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProveedorCreateModal;