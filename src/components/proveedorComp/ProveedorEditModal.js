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

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correoProveedor: '',
    pais: '',
  });

  // Actualizar formData cuando proveedorToEdit cambie
  useEffect(() => {
    if (proveedorToEdit) {
      setFormData({
        ...proveedorToEdit,
        estado: proveedorToEdit.estado === 'ACTIVO' ? 'Activo' : 'Inactivo', // Transformar el estado
      });
    }
  }, [proveedorToEdit]);

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

    const updatedFormData = {
      ...formData,
      estado: formData.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO', // Transformar el estado
    };
    console.log('Datos enviados al backend:', updatedFormData); // Inspeccionar los datos
    handleSaveEdit(updatedFormData);
    setShowEditModal(false);
  };

  return (
    <CModal
      visible={showEditModal}
      onClose={() => setShowEditModal(false)}
      backdrop="static" // Evitar que se cierre al hacer clic fuera
      keyboard={false} // Evitar que se cierre con la tecla Esc
    >
      <CModalHeader>
        <CModalTitle>Editar Proveedor</CModalTitle>
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

          {/* Campo Dirección */}
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

          {/* Campo Teléfono */}
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

          {/* Campo Correo */}
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

          {/* Campo País */}
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