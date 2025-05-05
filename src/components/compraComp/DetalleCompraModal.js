import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiClient from '../../services/apiClient'

const DetalleCompraModal = ({ show, onClose, compra }) => {
  const [detalles, setDetalles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (compra) {
      fetchDetalles()
    }
  }, [compra])

  const fetchDetalles = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get(`/fs/detalles-compras/compra/${compra.idCompra}`)
      setDetalles(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cargar los detalles')
      console.error('Error al cargar detalles de compra:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <CModal visible={show} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Detalles de Compra</CModalTitle>
        <CButton color="close" variant="ghost" onClick={onClose}>
          <CIcon icon={cilX} />
        </CButton>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}

        <div className="mb-4">
          <h5>Información de la Compra</h5>
          <p><strong>N° Factura:</strong> {compra?.numeroFactura}</p>
          <p><strong>Fecha:</strong> {new Date(compra?.fechaCompra).toLocaleDateString('es-ES')}</p>
          <p><strong>Proveedor:</strong> {compra?.proveedor?.nombre}</p>
          <p><strong>Total:</strong> {formatCurrency(compra?.totalCompra)}</p>
        </div>

        <h5>Productos</h5>
        {loading ? (
          <div className="text-center">
            <CSpinner />
            <p>Cargando detalles...</p>
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Precio Unitario</CTableHeaderCell>
                <CTableHeaderCell>Subtotal</CTableHeaderCell>
                <CTableHeaderCell>Utilidad Manual</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {detalles.length > 0 ? (
                detalles.map((detalle) => (
                  <CTableRow key={detalle.idDetalleCompra}>
                    <CTableDataCell>{detalle.producto?.nombreProducto}</CTableDataCell>
                    <CTableDataCell>{detalle.cantidad}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(detalle.precioUnitario)}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(detalle.subtotal)}</CTableDataCell>
                    <CTableDataCell>
                      {detalle.porcentajeUtilidadManual
                        ? `${detalle.porcentajeUtilidadManual}%`
                        : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    <CAlert color="warning">
                      No hay productos agregados a esta compra
                    </CAlert>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DetalleCompraModal