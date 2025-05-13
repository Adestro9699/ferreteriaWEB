import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CFormTextarea,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { cilX, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import CompraForm from './CompraForm'
import apiClient from '../../services/apiClient'

const NuevaCompraModal = ({ show, onClose, onCompraGuardada, compraEdicion }) => {
  const [step, setStep] = useState(1) // Step 1: Purchase details, Step 2: Products
  const [showProductForm, setShowProductForm] = useState(false)
  const [formData, setFormData] = useState({
    numeroFactura: '',
    fechaCompra: '',
    tipoDocumento: '',
    totalCompra: 0,
    observaciones: '',
    estadoCompra: 'PENDIENTE',
    proveedor: { idProveedor: '' },
  })

  const [proveedores, setProveedores] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [compraId, setCompraId] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [productoEditando, setProductoEditando] = useState(null)

  useEffect(() => {
    // Resetear todo al abrir el modal
    if (show) {
      setShowProductForm(false)
      // Si hay compra en edición, cargar sus datos
      if (compraEdicion) {
        const fechaFormateada = compraEdicion.fechaCompra 
          ? new Date(compraEdicion.fechaCompra).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0]

        setFormData({
          ...compraEdicion,
          fechaCompra: fechaFormateada,
          proveedor: compraEdicion.proveedor || { idProveedor: '' },
          totalCompra: compraEdicion.totalCompra || 0,
          observaciones: compraEdicion.observaciones || '',
          tipoDocumento: compraEdicion.tipoDocumento || 'FACTURA',
          estadoCompra: compraEdicion.estadoCompra || 'PENDIENTE'
        })

        setCompraId(compraEdicion.idCompra)

        // Cargar detalles de la compra
        const cargarDetallesCompra = async () => {
          try {
            const response = await apiClient.get(`/fs/detalles-compras/compra/${compraEdicion.idCompra}`)
            const detallesData = Array.isArray(response.data) ? response.data : [response.data]
            // Filtrar solo los detalles que tienen productos válidos
            const detallesValidos = detallesData.filter(detalle => 
              detalle.producto && detalle.producto.idProducto && detalle.producto.nombreProducto
            )
            setDetalles(detallesValidos.map(detalle => ({
              producto: detalle.producto ? { 
                idProducto: detalle.producto.idProducto || '', 
                nombreProducto: detalle.producto.nombreProducto || 'Producto no disponible'
              } : { idProducto: '', nombreProducto: 'Producto no disponible' },
              cantidad: detalle.cantidad || 0,
              precioUnitario: detalle.precioUnitario || 0,
              porcentajeUtilidadManual: detalle.porcentajeUtilidadManual || null
            })))
          } catch (error) {
            console.error('Error al cargar detalles de compra:', error)
          }
        }

        cargarDetallesCompra()
      } else {
        // Si no hay compra en edición, resetear todo
        setFormData({
          numeroFactura: '',
          fechaCompra: new Date().toISOString().split('T')[0],
          tipoDocumento: 'FACTURA',
          totalCompra: 0,
          observaciones: '',
          estadoCompra: 'PENDIENTE',
          proveedor: { idProveedor: '' },
        })
        setCompraId(null)
        setDetalles([])
      }
    }
  }, [show, compraEdicion])

  useEffect(() => {
    fetchProveedores()
  }, [])

  const fetchProveedores = async () => {
    try {
      const response = await apiClient.get('/fs/proveedores')
      setProveedores(response.data)
    } catch (error) {
      console.error('Error fetching proveedores:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'idProveedor') {
      setFormData({
        ...formData,
        proveedor: { idProveedor: value },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Calcular total de compra basado en detalles
      const totalCompra = detalles.reduce((total, detalle) => 
        total + (parseFloat(detalle.cantidad) * parseFloat(detalle.precioUnitario)), 0)

      // Preparar datos de compra con total calculado
      const compraData = {
        ...formData,
        totalCompra: totalCompra.toFixed(2),
        estado: 'PENDIENTE' // Asegurar estado inicial
      }

      const response = await apiClient.post('/fs/compras', compraData)
      setCompraId(response.data.idCompra)
      setShowProductForm(true)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar la compra')
    } finally {
      setLoading(false)
    }
  }

  const handleProductoAgregado = (nuevoDetalle) => {
    if (productoEditando !== null) {
      // Si estamos editando, reemplazar el producto existente
      setDetalles(detalles.map((detalle, index) => 
        index === productoEditando ? nuevoDetalle : detalle
      ))
      setProductoEditando(null)
    } else {
      // Si no estamos editando, verificar si el producto ya existe
      const productoExistente = detalles.find(
        detalle => detalle.producto.idProducto === nuevoDetalle.producto.idProducto
      )

      if (!productoExistente) {
        setDetalles([...detalles, nuevoDetalle])
      } else {
        setError('Este producto ya ha sido agregado a la compra')
      }
    }
  }

  const handleEditarProducto = (index) => {
    const detalle = detalles[index]
    setProductoEditando(index)
    // Aquí podrías pasar el detalle al formulario de productos
    // Esto dependerá de cómo esté estructurado tu CompraForm
  }

  const handleEliminarProducto = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const handleFinalizar = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validar que hay detalles de compra
      if (detalles.length === 0) {
        throw new Error('Debe agregar al menos un producto a la compra')
      }

      // Calcular el total de la compra
      const totalCompra = detalles.reduce((total, detalle) => 
        total + (parseFloat(detalle.cantidad) * parseFloat(detalle.precioUnitario)), 0)

      try {
        // Primero guardar todos los detalles
        const detallesPromises = detalles.map(detalle => {
          const detalleCompra = {
            cantidad: Number(detalle.cantidad),
            precioUnitario: Number(detalle.precioUnitario),
            porcentajeUtilidadManual: detalle.porcentajeUtilidadManual ? Number(detalle.porcentajeUtilidadManual) : null,
            producto: { idProducto: detalle.producto.idProducto },
            compra: { idCompra: compraId }
          }
          return apiClient.post('/fs/detalles-compras', detalleCompra)
        })

        try {
          await Promise.all(detallesPromises)
        } catch (detalleError) {
          if (detalleError.response?.status === 401) {
            throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
          }
          throw new Error('Error al guardar los detalles de la compra')
        }

        // Si los detalles se guardaron correctamente, actualizar el estado de la compra
        await apiClient.put(`/fs/compras/${compraId}`, {
          ...formData,
          totalCompra: totalCompra.toFixed(2),
          estadoCompra: 'COMPLETADA'
        })

        // Limpiar el formulario y estados
        setFormData({
          numeroFactura: '',
          fechaCompra: new Date().toISOString().split('T')[0],
          tipoDocumento: 'FACTURA',
          totalCompra: 0,
          observaciones: '',
          estadoCompra: 'PENDIENTE',
          proveedor: { idProveedor: '' },
        })
        setDetalles([])
        setCompraId(null)
        setShowProductForm(false)
        
        // Cerrar modal y refrescar lista
        onClose()
        
        if (typeof onCompraGuardada === 'function') {
          onCompraGuardada()
        }
      } catch (error) {
        if (error.response?.status === 403) {
          throw new Error('No tienes permisos para realizar esta operación. Por favor, contacta al administrador.')
        }
        throw error
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al finalizar la compra'
      setError(errorMessage)
      console.error('Error al finalizar compra:', error)
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
    <CModal visible={show} onClose={onClose} size="xl" backdrop="static">
      <CModalHeader>
        <CModalTitle>Nueva Compra</CModalTitle>
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

        {!showProductForm ? (
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormInput
                label="Número de Factura"
                name="numeroFactura"
                value={formData.numeroFactura}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="date"
                label="Fecha de Compra"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormSelect
                label="Tipo de Documento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
              >
                <option value="FACTURA">Factura</option>
                <option value="NOTA_CREDITO">Nota de Crédito</option>
                <option value="NOTA_DEBITO">Nota de Débito</option>
                <option value="RECIBO">Recibo</option>
                <option value="OTRO">Otro</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormSelect
                label="Proveedor"
                name="idProveedor"
                value={formData.proveedor.idProveedor}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormTextarea
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="d-flex justify-content-end">
              <CButton color="primary" type="submit" disabled={loading} className="me-2">
                {loading ? 'Guardando...' : 'Guardar'}
              </CButton>
              <CButton color="secondary" onClick={onClose}>
                Cancelar
              </CButton>
            </div>
          </CForm>
        ) : compraId ? (
          <>
            <CompraForm 
              compraId={compraId} 
              onProductoAgregado={handleProductoAgregado}
              productoEditando={productoEditando !== null ? detalles[productoEditando] : null}
            />
            
            <div className="mt-4">
              <h5>Productos Agregados</h5>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Producto</CTableHeaderCell>
                    <CTableHeaderCell>Cantidad</CTableHeaderCell>
                    <CTableHeaderCell>Precio Unitario</CTableHeaderCell>
                    <CTableHeaderCell>Subtotal</CTableHeaderCell>
                    <CTableHeaderCell>Utilidad Manual</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {detalles.map((detalle, index) => {
                    const subtotal = parseFloat(detalle.cantidad) * parseFloat(detalle.precioUnitario);
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {detalle.producto?.nombreProducto || 'Sin nombre'}
                        </CTableDataCell>
                        <CTableDataCell>{detalle.cantidad}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(detalle.precioUnitario)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(subtotal)}</CTableDataCell>
                        <CTableDataCell>
                          {detalle.porcentajeUtilidadManual
                            ? `${detalle.porcentajeUtilidadManual}%`
                            : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color="primary" 
                              size="sm"
                              onClick={() => handleEditarProducto(index)}
                              disabled={productoEditando !== null}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton 
                              color="danger" 
                              size="sm"
                              onClick={() => handleEliminarProducto(index)}
                              disabled={productoEditando !== null}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                  <CTableRow>
                    <CTableDataCell colSpan="3" className="text-end">
                      <strong>Total:</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(detalles.reduce((total, detalle) => 
                        total + (parseFloat(detalle.cantidad) * parseFloat(detalle.precioUnitario)), 0))}
                    </CTableDataCell>
                    <CTableDataCell colSpan="2"></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </>
        ) : null}

      </CModalBody>
      <CModalFooter>
        {!showProductForm ? null : compraId ? (
          <CButton color="success" onClick={handleFinalizar}>
            Finalizar Compra
          </CButton>
        ) : null}
      </CModalFooter>
    </CModal>
  )
}

export default NuevaCompraModal