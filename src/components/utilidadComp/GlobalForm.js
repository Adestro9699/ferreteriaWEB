import React, { useState, useEffect } from 'react';
import { CForm, CFormSelect, CFormInput, CButton, CRow, CCol, CSpinner } from '@coreui/react';

const GlobalForm = ({ onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    clave: 'IGV',
    valor: '',
    descripcion: '',
    observaciones: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        clave: initialData.clave,
        valor: initialData.valor.toString(),
        descripcion: initialData.descripcion || '',
        observaciones: initialData.observaciones || ''
      });
    } else {
      setFormData({
        clave: 'IGV',
        valor: '',
        descripcion: '',
        observaciones: ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clave || !formData.valor) {
      console.error('Clave y valor son requeridos');
      return;
    }

    const fechaActual = new Date().toISOString();

    const payload = {
      ...formData,
      fechaCreacion: initialData ? initialData.fechaCreacion : fechaActual
    };

    onSubmit(payload);
  };

  return (
    <CForm onSubmit={handleSubmit} className="mb-4">
      <CRow className="g-3 align-items-end">
        <CCol md={3}>
          <CFormSelect
            name="clave"
            label="Tipo de Parámetro"
            value={formData.clave}
            onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
            required
            disabled={!!initialData || loading}
          >
            <option value="IGV">IGV</option>
            <option value="UTILIDAD">UTILIDAD</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="text"
            name="valor"
            label="Valor"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            required
            disabled={loading}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="descripcion"
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            disabled={loading}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            name="observaciones"
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            disabled={loading}
          />
        </CCol>
        <CCol md={3} className="d-flex align-items-end">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : initialData ? 'Actualizar' : 'Guardar'}
          </CButton>
          {initialData && (
            <CButton 
              color="secondary" 
              className="ms-2"
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              Cancelar
            </CButton>
          )}
        </CCol>
      </CRow>
    </CForm>
  );
};

export default GlobalForm;
