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
import PropTypes from 'prop-types';

const TipoDocumentoForm = ({ tipoDocumento, onCancel, onSaved, onToast }) => {
  const [formData, setFormData] = useState({
    nombre: tipoDocumento?.nombre || '',
    codigoNubeFact: tipoDocumento?.codigoNubeFact || '',
    abreviatura: tipoDocumento?.abreviatura || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tipoDocumento) {
        // Modo edición
        await apiClient.put(`/tipos-documento/${tipoDocumento.idTipoDocumento}`, formData);
        onToast('Tipo de documento actualizado exitosamente', 'success');
      } else {
        // Modo creación
        await apiClient.post('/tipos-documento', formData);
        onToast('Tipo de documento creado exitosamente', 'success');
      }

      setFormData({ nombre: '', codigoNubeFact: '', abreviatura: '' });
      onSaved(); // Refresca la tabla
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al guardar el tipo de documento';
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
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Documento Nacional de Identidad"
            required
            maxLength={50}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="number"
            label="Código NubeFact"
            value={formData.codigoNubeFact}
            onChange={(e) => setFormData({ ...formData, codigoNubeFact: e.target.value })}
            placeholder="Ej: 1"
            required
            min="1"
            max="9"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label="Abreviatura"
            value={formData.abreviatura}
            onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })}
            placeholder="Ej: DNI"
            maxLength={10}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol className="d-flex justify-content-end">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : tipoDocumento ? 'Actualizar' : 'Guardar'}
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

TipoDocumentoForm.propTypes = {
  tipoDocumento: PropTypes.object,
  onCancel: PropTypes.func,
  onSaved: PropTypes.func.isRequired,
  onToast: PropTypes.func.isRequired
};

export default TipoDocumentoForm; 