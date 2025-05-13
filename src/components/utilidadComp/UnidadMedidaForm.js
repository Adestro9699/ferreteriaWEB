import React, { useState } from 'react';
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const UnidadMedidaForm = ({ unidadMedida, onCancel, onSaved, onToast }) => {
  const [formData, setFormData] = useState({
    nombreUnidad: unidadMedida?.nombreUnidad || '',
    abreviatura: unidadMedida?.abreviatura || '',
    descripcion: unidadMedida?.descripcion || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (unidadMedida) {
        // Modo edición
        await apiClient.put(`/unidades-medida/${unidadMedida.idUnidadMedida}`, formData);
        onToast('Unidad de medida actualizada exitosamente', 'success');
      } else {
        // Modo creación
        await apiClient.post('/unidades-medida', formData);
        onToast('Unidad de medida creada exitosamente', 'success');
      }

      setFormData({ nombreUnidad: '', abreviatura: '', descripcion: '' });
      onSaved(); // Refresca la tabla
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al guardar la unidad de medida';
      setError(errorMessage);
      onToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit} className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <CRow className="mb-3">
        <CCol md={4}>
          <CFormInput
            label="Nombre de la Unidad"
            value={formData.nombreUnidad}
            onChange={(e) => setFormData({ ...formData, nombreUnidad: e.target.value })}
            placeholder="Ej: Kilogramo"
            required
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label="Abreviatura"
            value={formData.abreviatura}
            onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })}
            placeholder="Ej: kg"
            required
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción opcional"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol className="d-flex justify-content-end">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : unidadMedida ? 'Actualizar' : 'Guardar'}
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

export default UnidadMedidaForm; 