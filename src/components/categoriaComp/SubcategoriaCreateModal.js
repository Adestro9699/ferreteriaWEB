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

const SubcategoriaCreateModal = ({ 
  showCreateModal, 
  setShowCreateModal, 
  handleCreate, 
  categorias, 
  selectedCategoriaId // Recibe el ID de la categoría seleccionada como prop
}) => {

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO',
    idCategoria: selectedCategoriaId || '', // Inicializa con el ID de la categoría seleccionada
  });

  // Actualizar el estado formData cuando cambie selectedCategoriaId
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      idCategoria: selectedCategoriaId || '', // Actualiza el idCategoria en el estado
    }));
  }, [selectedCategoriaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.idCategoria) {
      alert('Debes seleccionar una categoría.');
      return;
    }

    // Ajustar el formato de los datos para coincidir con el backend
    const subcategoriaData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estado: formData.estado,
      categoria: { idCategoria: formData.idCategoria }, // Envolver el idCategoria dentro de un objeto categoria
    };

    handleCreate(subcategoriaData); // Enviar los datos al backend
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'ACTIVO',
      idCategoria: selectedCategoriaId || '', // Reinicia el ID de la categoría seleccionada
    });
    setShowCreateModal(false);
  };

  return (
    <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
      <CModalHeader>
        <CModalTitle>Nueva Subcategoría</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect
          label="Categoría"
          name="idCategoria"
          value={formData.idCategoria} // Usa el ID de la categoría seleccionada
          onChange={handleChange}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.idCategoria} value={categoria.idCategoria}>
              {categoria.nombre}
            </option>
          ))}
        </CFormSelect>
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

export default SubcategoriaCreateModal;