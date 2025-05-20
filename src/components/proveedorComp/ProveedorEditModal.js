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

const ProveedorEditModal = ({ show, onClose, proveedor, onSave }) => {
  const [formData, setFormData] = useState({
    idProveedor: '',
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

  useEffect(() => {
    if (proveedor) {
      setFormData({
        ...proveedor,
        estado: proveedor.estado === 'ACTIVO' ? 'Activo' : 'Inactivo',
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (['nombre', 'direccion', 'pais'].includes(name) && value.length > 0) {
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updatedFormData = {
      ...formData,
      estado: formData.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO',
    };
    onSave(updatedFormData);
  };

  return (
    <CModal
      visible={show}
      onClose={onClose}
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader>
        <CModalTitle>Editar Proveedor</CModalTitle>
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
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProveedorEditModal;