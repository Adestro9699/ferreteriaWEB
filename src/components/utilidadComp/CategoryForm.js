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
    porcentajeUtilidad: utilidad?.porcentaje || '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiClient.get('/fs/categorias');
        setCategorias(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar categorías');
      }
    };
    fetchCategorias();
  }, []);

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
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        categoria: { idCategoria: parseInt(formData.categoriaId) },
        porcentajeUtilidad: formData.porcentajeUtilidad ? parseFloat(formData.porcentajeUtilidad) : null
      };

      if (utilidad) {
        // Modo edición - incluir el ID
        await apiClient.put(`/fs/utilidades/${utilidad.idUtilidad}`, {
          ...payload,
          idUtilidad: utilidad.idUtilidad
        });
        setSuccess('Configuración actualizada exitosamente');
      } else {
        // Modo creación
        await apiClient.post('/fs/utilidades', payload);
        setSuccess('Configuración creada exitosamente');
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
    <CForm onSubmit={handleSubmit} className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}

      <CRow className="g-3 align-items-center">
        <CCol md={6}>
          <CFormSelect
            name="categoriaId"
            label="Seleccionar categoría"
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nombre}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="number"
            name="porcentajeUtilidad"
            label="Porcentaje de Utilidad (%)"
            value={formData.porcentajeUtilidad || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setFormData({ ...formData, porcentajeUtilidad: value });
              }
            }}
            placeholder="Ej: 25"
            min="0"
            max="100"
            step="0.01"
            disabled={loading}
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