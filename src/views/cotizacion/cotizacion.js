import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import apiClient from '../../services/apiClient'
import CotizacionAcciones from '../../components/cotizacionComp/CotizacionAcciones'

const Cotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    obtenerCotizaciones()
  }, [])

  const obtenerCotizaciones = async () => {
    try {
      const response = await apiClient.get('/cotizaciones/resumen')
      console.log('Respuesta de la API:', response.data)
      setCotizaciones(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error)
      setCotizaciones([])
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cotización?')) {
      try {
        await apiClient.delete(`/cotizaciones/${id}`)
        obtenerCotizaciones()
      } catch (error) {
        console.error('Error al eliminar cotización:', error)
      }
    }
  }

  const handleVer = (cotizacion) => {
    // Implementar lógica para ver detalle
    console.log('Ver cotización:', cotizacion)
  }

  const handleEditar = (cotizacion) => {
    // Implementar lógica para editar
    console.log('Editar cotización:', cotizacion)
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Gestión de Cotizaciones</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Cliente</CTableHeaderCell>
                  <CTableHeaderCell>Empresa</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Array.isArray(cotizaciones) && cotizaciones.map((cotizacion) => (
                  <CTableRow key={cotizacion.idCotizacion}>
                    <CTableHeaderCell>{cotizacion.codigoCotizacion}</CTableHeaderCell>
                    <CTableHeaderCell>
                      {cotizacion.clienteNombres} {cotizacion.clienteApellidos}
                    </CTableHeaderCell>
                    <CTableHeaderCell>{cotizacion.empresaRazonSocial}</CTableHeaderCell>
                    <CTableHeaderCell>{formatearFecha(cotizacion.fechaCotizacion)}</CTableHeaderCell>
                    <CTableHeaderCell>S/. {cotizacion.totalCotizacion.toFixed(2)}</CTableHeaderCell>
                    <CTableHeaderCell>
                      <CotizacionAcciones
                        cotizacion={cotizacion}
                        onVer={handleVer}
                        onEditar={handleEditar}
                        onEliminar={handleEliminar}
                      />
                    </CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Cotizacion
