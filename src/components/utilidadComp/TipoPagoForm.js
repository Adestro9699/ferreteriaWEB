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

const TipoPagoForm = ({ tipoPago, onCancel, onSaved, onToast }) => {
  const [formData, setFormData] = useState({
    codigoTipoPago: '',
    nombre: '',
    descripcionTipoPago: '',
    estadoTipoPago: 'ACTIVO',
    comision: '0.00',
  });

  useEffect(() => {
    if (tipoPago) {
      setFormData({
        codigoTipoPago: tipoPago.codigoTipoPago || '',
        nombre: tipoPago.nombre || '',
        descripcionTipoPago: tipoPago.descripcionTipoPago || '',
        estadoTipoPago: tipoPago.estadoTipoPago || 'ACTIVO',
        comision: tipoPago.comision || '0.00',
      });
    }
  }, [tipoPago]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tipoPago) {
        await apiClient.put(`/tipos-pago/${tipoPago.idTipoPago}`, formData);
        onToast('Tipo de pago actualizado exitosamente');
      } else {
        await apiClient.post('/tipos-pago', formData);
        onToast('Tipo de pago creado exitosamente');
      }
      onSaved();
    } catch (error) {
      console.error('Error al guardar:', error);
      onToast(error.response?.data?.message || 'Error al guardar el tipo de pago', 'danger');
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
          <CFormLabel>Código</CFormLabel>
          <CFormInput
            type="text"
            name="codigoTipoPago"
            value={formData.codigoTipoPago}
            onChange={handleChange}
            required
            maxLength={20}
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            maxLength={200}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6} className="mb-3">
          <CFormLabel>Estado</CFormLabel>
          <CFormSelect
            name="estadoTipoPago"
            value={formData.estadoTipoPago}
            onChange={handleChange}
            required
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </CFormSelect>
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormLabel>Comisión (%)</CFormLabel>
          <CFormInput
            type="number"
            name="comision"
            value={formData.comision}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            required
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12} className="mb-3">
          <CFormLabel>Descripción</CFormLabel>
          <CFormTextarea
            name="descripcionTipoPago"
            value={formData.descripcionTipoPago}
            onChange={handleChange}
            rows="3"
            maxLength={300}
          />
        </CCol>
      </CRow>

      <div className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onCancel}>
          Cancelar
        </CButton>
        <CButton color="primary" type="submit">
          {tipoPago ? 'Actualizar' : 'Guardar'}
        </CButton>
      </div>
    </CForm>
  );
};

export default TipoPagoForm; 