import React, { useState, useEffect } from 'react';
import {
  CForm,
  CFormSelect,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const CategoryForm = ({ utilidad, onCancel, onSaved }) => {
  const [formData, setFormData] = useState({
    categoriaId: utilidad?.categoria?.idCategoria || '',
    porcentajeUtilidad: utilidad?.porcentajeUtilidad || '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiClient.get('/categorias');
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar categorías');
      }
    };
    fetchCategorias();
  }, []);

  // Efecto para actualizar el formulario cuando cambia el registro a editar
  useEffect(() => {
    if (utilidad) {
      setFormData({
        categoriaId: utilidad.categoria?.idCategoria || '',
        porcentajeUtilidad: utilidad.porcentajeUtilidad || '',
      });
    }
  }, [utilidad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        categoria: { idCategoria: parseInt(formData.categoriaId) },
        porcentajeUtilidad: formData.porcentajeUtilidad ? parseFloat(formData.porcentajeUtilidad) : null
      };

      if (utilidad) {
        // Modo edición - incluir el ID
        await apiClient.put(`/utilidades/${utilidad.idUtilidad}`, {
          ...payload,
          idUtilidad: utilidad.idUtilidad
        });
      } else {
        // Modo creación
        await apiClient.post('/utilidades', payload);
      }

      setFormData({ categoriaId: '', porcentajeUtilidad: '' });
      onSaved();
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CRow className="mb-3">
        <CCol md={4}>
          <CFormSelect
            label="Categoría"
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombre}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormInput
            label="Porcentaje de Utilidad"
            type="number"
            step="0.01"
            value={formData.porcentajeUtilidad}
            onChange={(e) => setFormData({ ...formData, porcentajeUtilidad: e.target.value })}
            placeholder="Ej: 25.50"
            required
          />
        </CCol>
        <CCol md={2} className="d-flex align-items-end">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : utilidad ? 'Actualizar' : 'Guardar'}
          </CButton>
          {onCancel && (
            <CButton color="secondary" className="ms-2" onClick={onCancel} disabled={loading}>
              Cancelar
            </CButton>
          )}
        </CCol>
      </CRow>
    </CForm>
  );
};

export default CategoryForm;