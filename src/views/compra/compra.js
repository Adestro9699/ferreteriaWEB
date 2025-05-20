import React, { useState, useEffect, Suspense, lazy } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import ErrorBoundary from '../../components/ErrorBoundary'
import apiClient from '../../services/apiClient'

const CompraList = lazy(() => import('../../components/compraComp/CompraList'))
const NuevaCompraModal = lazy(() => import('../../components/compraComp/NuevaCompraModal'))
const DetalleCompraModal = lazy(() => import('../../components/compraComp/DetalleCompraModal'))
const CompraToasts = lazy(() => import('../../components/compraComp/CompraToasts'))

const Compra = () => {
  const [compras, setCompras] = useState([])
  const [showNuevaCompraModal, setShowNuevaCompraModal] = useState(false)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState(null)
  const [compraEdicion, setCompraEdicion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [compraToDelete, setCompraToDelete] = useState(null)
  const [toasts, setToasts] = useState([])
  const [showConfirmDeleteMultiple, setShowConfirmDeleteMultiple] = useState(false)
  const [comprasToDelete, setComprasToDelete] = useState([])

  useEffect(() => {
    fetchCompras()
  }, [])

  const fetchCompras = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/compras')
      setCompras(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cargar las compras')
      console.error('Error fetching compras:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNuevaCompra = () => {
    setCompraEdicion(null)
    setShowNuevaCompraModal(true)
  }

  const handleEditarCompra = (compra) => {
    setCompraEdicion(compra)
    setShowNuevaCompraModal(true)
  }

  const handleVerDetalle = (compra) => {
    setSelectedCompra(compra)
    setShowDetalleModal(true)
  }

  const handleCompraGuardada = () => {
    setShowNuevaCompraModal(false)
    fetchCompras()
    addToast('Compra guardada exitosamente', 'success')
  }

  const handleCloseDetalle = () => {
    setShowDetalleModal(false)
    setSelectedCompra(null)
  }

  const handleEliminarCompra = (compra) => {
    setCompraToDelete(compra)
    setShowConfirmDelete(true)
  }

  const handleEliminarMultiples = (compraIds) => {
    setComprasToDelete(compraIds)
    setShowConfirmDeleteMultiple(true)
  }

  const confirmarEliminacion = async () => {
    try {
      setLoading(true)
      
      // Si la compra está COMPLETADA, eliminar primero los detalles
      if (compraToDelete.estadoCompra === 'COMPLETADA') {
        // Obtener los detalles de la compra
        const detallesResponse = await apiClient.get(`/detalles-compras/compra/${compraToDelete.idCompra}`)
        const detalles = detallesResponse.data

        // Eliminar cada detalle
        for (const detalle of detalles) {
          await apiClient.delete(`/detalles-compras/${detalle.idDetalleCompra}`)
        }
      }

      // Eliminar la compra
      await apiClient.delete(`/compras/${compraToDelete.idCompra}`)
      setShowConfirmDelete(false)
      setCompraToDelete(null)
      fetchCompras()
      addToast('Compra eliminada exitosamente', 'success')
    } catch (error) {
      setError(error.response?.data?.message || 'Error al eliminar la compra')
      addToast('Error al eliminar la compra', 'danger')
      console.error('Error eliminando compra:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmarEliminacionMultiple = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todas las compras seleccionadas
      const comprasSeleccionadas = compras.filter(compra => 
        comprasToDelete.includes(compra.idCompra)
      )

      // Primero eliminar los detalles de las compras COMPLETADAS
      for (const compra of comprasSeleccionadas) {
        if (compra.estadoCompra === 'COMPLETADA') {
          const detallesResponse = await apiClient.get(`/detalles-compras/compra/${compra.idCompra}`)
          const detalles = detallesResponse.data
          
          if (detalles.length > 0) {
            const detalleIds = detalles.map(detalle => detalle.idDetalleCompra)
            await apiClient.delete('/detalles-compras/eliminar-multiples', {
              data: detalleIds
            })
          }
        }
      }

      // Luego eliminar las compras
      await apiClient.delete('/compras/eliminar-multiples', {
        data: comprasToDelete
      })

      setShowConfirmDeleteMultiple(false)
      setComprasToDelete([])
      fetchCompras()
      addToast(`${comprasToDelete.length} compras eliminadas exitosamente`, 'success')
    } catch (error) {
      setError(error.response?.data?.message || 'Error al eliminar las compras')
      addToast('Error al eliminar las compras', 'danger')
      console.error('Error eliminando compras:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToast = (message, color = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      color,
    }
    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id))
    }, 3000)
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="text-center">
          <CSpinner />
          <p>Cargando componentes...</p>
        </div>
      }>
        <CRow>
          <CCol xs={12} className="d-flex justify-content-center">
            <CCard className="mb-4" style={{ margin: '20px', width: '80%' }}>
              <CCardHeader>
                <strong>Gestión de Compras</strong>
              </CCardHeader>
              <CCardBody>
                {error && (
                  <CAlert color="danger" dismissible onClose={() => setError(null)}>
                    {error}
                  </CAlert>
                )}
                
                {loading ? (
                  <div className="text-center">
                    <CSpinner />
                    <p>Cargando compras...</p>
                  </div>
                ) : (
                  <CompraList
                    compras={compras}
                    onNuevaCompra={handleNuevaCompra}
                    onVerDetalle={handleVerDetalle}
                    onEditarCompra={handleEditarCompra}
                    onEliminarCompra={handleEliminarCompra}
                    onEliminarMultiples={handleEliminarMultiples}
                    loading={loading}
                  />
                )}
              </CCardBody>
            </CCard>
          </CCol>

          <NuevaCompraModal
            show={showNuevaCompraModal}
            onClose={() => setShowNuevaCompraModal(false)}
            onCompraGuardada={handleCompraGuardada}
            compraEdicion={compraEdicion}
          />

          <DetalleCompraModal
            show={showDetalleModal}
            onClose={handleCloseDetalle}
            compra={selectedCompra}
          />

          <CModal visible={showConfirmDelete} onClose={() => setShowConfirmDelete(false)} backdrop="static">
            <CModalHeader>
              <CModalTitle>Confirmar Eliminación</CModalTitle>
            </CModalHeader>
            <CModalBody>
              ¿Está seguro que desea eliminar la compra {compraToDelete?.numeroFactura}?
              Esta acción no se puede deshacer.
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancelar
              </CButton>
              <CButton color="danger" onClick={confirmarEliminacion}>
                Eliminar
              </CButton>
            </CModalFooter>
          </CModal>

          <CModal visible={showConfirmDeleteMultiple} onClose={() => setShowConfirmDeleteMultiple(false)} backdrop="static">
            <CModalHeader>
              <CModalTitle>Confirmar Eliminación Múltiple</CModalTitle>
            </CModalHeader>
            <CModalBody>
              ¿Está seguro que desea eliminar {comprasToDelete.length} compras seleccionadas?
              Esta acción no se puede deshacer.
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowConfirmDeleteMultiple(false)}>
                Cancelar
              </CButton>
              <CButton color="danger" onClick={confirmarEliminacionMultiple}>
                Eliminar
              </CButton>
            </CModalFooter>
          </CModal>

          <CompraToasts toasts={toasts} />
        </CRow>
      </Suspense>
    </ErrorBoundary>
  )
}

export default Compra