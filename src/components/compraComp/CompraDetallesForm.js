import React from 'react'
import {
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react'

const CompraDetallesForm = ({ formData, setFormData, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'idProveedor') {
      setFormData({
        ...formData,
        proveedor: { idProveedor: value }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  return (
    <CForm>
      <CRow>
        <CCol md={6}>
          <CFormInput
            label="Número de Factura"
            name="numeroFactura"
            value={formData.numeroFactura}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="date"
            label="Fecha de Compra"
            name="fechaCompra"
            value={formData.fechaCompra}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="FACTURA">Factura</option>
            <option value="BOLETA">Boleta</option>
            {/* Add other document types */}
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormSelect
            label="Proveedor"
            name="idProveedor"
            value={formData.proveedor.idProveedor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Proveedor</option>
            {/* Map through providers */}
          </CFormSelect>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default CompraDetallesForm