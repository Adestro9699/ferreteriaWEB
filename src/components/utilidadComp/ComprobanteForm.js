import React, { useState, useEffect } from 'react';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CButton,
  CCol,
  CRow,
  CFormSelect,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const ComprobanteForm = ({ comprobante, onCancel, onSaved, onToast }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO',
    codigoNubefact: '',
  });

  useEffect(() => {
    if (comprobante) {
      setFormData({
        nombre: comprobante.nombre || '',
        descripcion: comprobante.descripcion || '',
        estado: comprobante.estado || 'ACTIVO',
        codigoNubefact: comprobante.codigoNubefact || '',
      });
    }
  }, [comprobante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comprobante) {
        await apiClient.put(`/tipo-comprobantes-pago/${comprobante.idTipoComprobantePago}`, formData);
        onToast('Comprobante actualizado exitosamente');
      } else {
        await apiClient.post('/tipo-comprobantes-pago', formData);
        onToast('Comprobante creado exitosamente');
      }
      onSaved();
    } catch (error) {
      console.error('Error al guardar:', error);
      onToast(error.response?.data?.message || 'Error al guardar el comprobante', 'danger');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CRow>
        <CCol md={6} className="mb-3">
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormLabel>Código Nubefact</CFormLabel>
          <CFormInput
            type="number"
            name="codigoNubefact"
            value={formData.codigoNubefact}
            onChange={handleChange}
            required
            disabled={!!comprobante} // No se puede modificar después de creado
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6} className="mb-3">
          <CFormLabel>Estado</CFormLabel>
          <CFormSelect
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12} className="mb-3">
          <CFormLabel>Descripción</CFormLabel>
          <CFormTextarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            required
          />
        </CCol>
      </CRow>

      <div className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onCancel}>
          Cancelar
        </CButton>
        <CButton color="primary" type="submit">
          {comprobante ? 'Actualizar' : 'Guardar'}
        </CButton>
      </div>
    </CForm>
  );
};

export default ComprobanteForm; 