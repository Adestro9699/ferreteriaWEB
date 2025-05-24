import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
  CContainer,
  CAlert,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint, cilArrowLeft } from '@coreui/icons'
import apiClient from '../../services/apiClient'

const DetalleCotizacionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cotizacion, setCotizacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerDetalleCotizacion()
  }, [id])

  const obtenerDetalleCotizacion = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/cotizaciones/${id}/detalle`)
      setCotizacion(response.data)
    } catch (error) {
      console.error('Error al obtener detalle de cotización:', error)
      if (error.response?.status === 404) {
        setError('No se encontró la cotización solicitada')
      } else if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente')
      } else if (error.response?.status === 403) {
        setError('No tiene permisos para ver esta cotización')
      } else {
        setError('Error al cargar los detalles de la cotización')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto)
  }

  const handlePrint = () => {
    window.print()
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CSpinner color="primary" />
        </div>
      )
    }

    if (error) {
      return (
        <CAlert color="danger" className="m-3">
          {error}
        </CAlert>
      )
    }

    if (!cotizacion) {
      return (
        <CAlert color="warning" className="m-3">
          No se encontró la cotización solicitada
        </CAlert>
      )
    }

    return (
      <CCardBody>
        <CRow>
          {/* Información General */}
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <h5>Información General</h5>
              </CCardHeader>
              <CCardBody>
                <CTable borderless>
                  <tbody>
                    <tr>
                      <td><strong>Fecha:</strong></td>
                      <td>{formatearFecha(cotizacion.fechaCotizacion)}</td>
                    </tr>
                    <tr>
                      <td><strong>Empresa:</strong></td>
                      <td>{cotizacion.razonSocialEmpresa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo de Pago:</strong></td>
                      <td>{cotizacion.tipoPago || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Vendedor:</strong></td>
                      <td>{`${cotizacion.nombreTrabajador} ${cotizacion.apellidoTrabajador}`}</td>
                    </tr>
                  </tbody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Información del Cliente */}
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <h5>Información del Cliente</h5>
              </CCardHeader>
              <CCardBody>
                <CTable borderless>
                  <tbody>
                    <tr>
                      <td><strong>Nombres:</strong></td>
                      <td>{`${cotizacion.nombresCliente} ${cotizacion.apellidosCliente}`}</td>
                    </tr>
                    <tr>
                      <td><strong>Razón Social:</strong></td>
                      <td>{cotizacion.razonSocialCliente || 'No especificada'}</td>
                    </tr>
                  </tbody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Productos */}
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Productos</h5>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Ítem</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cantidad</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Unidad</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Precio Unit.</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Dscto</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {cotizacion.detalles.map((detalle, index) => (
                  <CTableRow key={detalle.idDetalleCotizacion}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{detalle.nombreProducto}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.cantidad.toFixed(2)}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.unidadMedida}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatearMoneda(detalle.precioUnitario)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatearMoneda(detalle.descuento)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatearMoneda(detalle.subtotalSinIGV)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <tfoot>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'right' }}><strong>Subtotal sin IGV:</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{formatearMoneda(cotizacion.detalles.reduce((acc, detalle) => acc + (detalle.subtotalSinIGV || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'right' }}><strong>IGV (18%):</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{formatearMoneda(cotizacion.detalles.reduce((acc, detalle) => acc + (detalle.igvAplicado || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{formatearMoneda(cotizacion.totalCotizacion)}</strong></td>
                </tr>
              </tfoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCardBody>
    )
  }

  return (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Detalles de la Cotización</h4>
            <small className="text-muted">Código: {cotizacion?.idCotizacion || '-'}</small>
          </div>
          <div>
            <CButton color="secondary" onClick={() => navigate('/cotizacion')} className="me-2">
              <CIcon icon={cilArrowLeft} className="me-2" />
              Volver
            </CButton>
            <CButton color="info" onClick={handlePrint} className="me-2">
              <CIcon icon={cilPrint} className="me-2" />
              Imprimir
            </CButton>
          </div>
        </CCardHeader>
        {renderContent()}
      </CCard>
    </CContainer>
  )
}

export default DetalleCotizacionPage 