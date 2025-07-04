import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CFormInput,
  CFormSelect,
  CAlert,
  CPagination,
  CPaginationItem,
  CTooltip,
  CContainer
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilSearch, cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import apiClient from '../../services/apiClient'
import CotizacionAcciones from '../../components/cotizacionComp/CotizacionAcciones'

const Cotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    obtenerCotizaciones()
  }, [])

  const obtenerCotizaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/cotizaciones/resumen')
      setCotizaciones(response.data)
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error)
      setError('Error al cargar las cotizaciones')
      setCotizaciones([])
    } finally {
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
        alert('No se pudo eliminar la cotización')
      }
    }
  }

  const handleVer = (cotizacion) => {
    navigate(`/cotizaciones/${cotizacion.idCotizacion}/detalle`)
  }

  const handleEditar = async (cotizacion) => {
    try {
      const response = await apiClient.get(`/ventas/precargar-venta/por-id/${cotizacion.idCotizacion}`);
      navigate('/venta', {
        state: {
          cotizacionParaEditar: response.data,
          modoCotizacion: true,
          idCotizacion: cotizacion.idCotizacion
        }
      });
    } catch (error) {
      console.error('Error al obtener datos de la cotización:', error);
      alert('No se pudo cargar la información de la cotización');
    }
  }

  const handleNuevaCotizacion = () => {
    navigate('/venta', {
      state: {
        modoCotizacion: true
      }
    })
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

  const obtenerNombreCliente = (cotizacion) => {
    if (cotizacion.clienteRazonSocial) {
      return cotizacion.clienteRazonSocial;
    }
    if (cotizacion.clienteNombres || cotizacion.clienteApellidos) {
      return `${cotizacion.clienteNombres || ''} ${cotizacion.clienteApellidos || ''}`.trim();
    }
    return 'Cliente no especificado';
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Error</strong>
            </CCardHeader>
            <CCardBody>
              <div className="alert alert-danger">{error}</div>
              <button className="btn btn-primary" onClick={obtenerCotizaciones}>
                Reintentar
              </button>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CContainer fluid className="py-4 px-5">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Gestión de Cotizaciones</h4>
          </div>
          <CButton 
            color="primary"
            onClick={handleNuevaCotizacion}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Cotización
          </CButton>
        </CCardHeader>
        <CCardBody className="px-4">
          {cotizaciones.length === 0 ? (
            <CAlert color="info">No hay cotizaciones registradas</CAlert>
          ) : (
            <CTable hover responsive>
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
                {cotizaciones.map((cotizacion) => (
                  <CTableRow key={cotizacion.idCotizacion}>
                    <CTableDataCell>{cotizacion.codigoCotizacion}</CTableDataCell>
                    <CTableDataCell>
                      {obtenerNombreCliente(cotizacion)}
                    </CTableDataCell>
                    <CTableDataCell>{cotizacion.empresaRazonSocial}</CTableDataCell>
                    <CTableDataCell>{formatearFecha(cotizacion.fechaCotizacion)}</CTableDataCell>
                    <CTableDataCell>{formatearMoneda(cotizacion.totalCotizacion)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CTooltip content="Ver detalles">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleVer(cotizacion)}
                          >
                            <CIcon icon={cilSearch} />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Editar cotización">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEditar(cotizacion)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Eliminar cotización">
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleEliminar(cotizacion.idCotizacion)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTooltip>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Cotizacion