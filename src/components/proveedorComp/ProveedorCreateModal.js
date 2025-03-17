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

const ProveedorCreateModal = ({ showCreateModal, setShowCreateModal, handleCreateProveedor }) => {
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
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1); // Solo convertir la primera letra
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
  
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe comenzar con mayúscula.';
    }
  
    // Validar dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.direccion)) {
      newErrors.direccion = 'La dirección debe comenzar con mayúscula.';
    }
  
    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^[\d\s\-]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números, espacios o guiones.';
    }
  
    // Validar correo
    if (!formData.correoProveedor.trim()) {
      newErrors.correoProveedor = 'El correo es obligatorio.';
    } else if (!emailRegex.test(formData.correoProveedor.trim())) {
      newErrors.correoProveedor = 'El correo debe tener un formato válido.';
    }
  
    // Validar país
    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es obligatorio.';
    } else if (!/^[A-ZÁÉÍÓÚÑ].*$/.test(formData.pais)) {
      newErrors.pais = 'El país debe comenzar con mayúscula.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna `true` si no hay errores
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Detener el envío si hay errores
    }

    const dataToSend = {
      ...formData,
      fechaRegistro: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      estado: formData.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO', // Asegurar formato correcto del estado
    };
    handleCreateProveedor(dataToSend);

    // Reiniciar el formulario
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      correoProveedor: '',
      pais: '',
      estado: 'Activo',
    });

    setShowCreateModal(false); // Cerrar el modal
  };

  return (
    <CModal
      visible={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      backdrop="static" // Evitar que se cierre al hacer clic fuera
      keyboard={false} // Evitar que se cierre con la tecla Esc
    >
      <CModalHeader>
        <CModalTitle>Agregar nuevo Proveedor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Campo Nombre */}
          <CFormInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            invalid={!!errors.nombre} // Marcar como inválido si hay un error
          />
          <div style={{ minHeight: '20px' }}> {/* Espacio reservado para el mensaje de error */}
            {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
          </div>

          <CFormInput
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            invalid={!!errors.direccion}
          />
          <div style={{ minHeight: '20px' }}> {/* Espacio reservado para el mensaje de error */}
            {errors.direccion && <small className="text-danger">{errors.direccion}</small>}
          </div>

          <CFormInput
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            invalid={!!errors.telefono}
          />
          <div style={{ minHeight: '20px' }}> {/* Espacio reservado para el mensaje de error */}
            {errors.telefono && <small className="text-danger">{errors.telefono}</small>}
          </div>

          <CFormInput
            label="Correo"
            name="correoProveedor"
            value={formData.correoProveedor}
            onChange={handleChange}
            invalid={!!errors.correoProveedor}
          />
          <div style={{ minHeight: '20px' }}> {/* Espacio reservado para el mensaje de error */}
            {errors.correoProveedor && <small className="text-danger">{errors.correoProveedor}</small>}
          </div>

          <CFormInput
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            invalid={!!errors.pais}
          />
          <div style={{ minHeight: '20px' }}> {/* Espacio reservado para el mensaje de error */}
            {errors.pais && <small className="text-danger">{errors.pais}</small>}
          </div>

          {/* Campo Estado */}
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

export default ProveedorCreateModal;