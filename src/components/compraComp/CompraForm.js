import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react'
import { cilPlus, cilMinus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiClient from '../../services/apiClient'

const CompraForm = ({ compraId, onProductoAgregado }) => {
  const [formData, setFormData] = useState({
    compra: { idCompra: compraId },
    producto: { idProducto: '' },
    cantidad: '',
    precioUnitario: '',
    porcentajeUtilidadManual: null,
    porcentajeUtilidadManualPersonalizado: '',
  })

  const [productos, setProductos] = useState([])
  const [utilidades, setUtilidades] = useState([])
  const [parametros, setParametros] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [utilidadGeneralParametro, setUtilidadGeneralParametro] = useState(null)

  useEffect(() => {
    fetchProductos()
    fetchUtilidades()
    fetchParametros()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await apiClient.get('/fs/productos')
      setProductos(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cargar los productos')
    }
  }

  const fetchUtilidades = async () => {
    try {
      console.log('Iniciando fetchUtilidades...')
      const utilidadesResponse = await apiClient.get('/fs/utilidades')
      
      console.log('Respuesta completa:', utilidadesResponse)
      console.log('Datos de la respuesta:', utilidadesResponse.data)

      // Verificar estructura de los datos
      if (!Array.isArray(utilidadesResponse.data)) {
        console.error('Los datos recibidos no son un array:', utilidadesResponse.data)
        return
      }
      
      // Filtrar utilidades que tengan porcentaje definido
      const utilidadesValidas = utilidadesResponse.data.filter(u => {
        console.log('Utilidad individual:', u)
        // Determinar el tipo de utilidad basado en la presencia de categoria o producto
        const tipoUtilidad = u.categoria ? 'CATEGORIA' : (u.producto ? 'PRODUCTO' : null)
        
        return u.porcentajeUtilidad !== undefined && 
               u.porcentajeUtilidad !== null && 
               tipoUtilidad !== null
      }).map(u => ({
        idUtilidad: u.idUtilidad,
        nombre: u.categoria ? u.categoria.nombre : (u.producto ? u.producto.nombreProducto : 'Sin nombre'),
        porcentaje: u.porcentajeUtilidad,
        tipoUtilidad: u.categoria ? 'CATEGORIA' : 'PRODUCTO'
      }))

      console.log('Utilidades válidas:', utilidadesValidas)
      setUtilidades(utilidadesValidas)
    } catch (error) {
      console.error('Error al cargar utilidades:', error)
      // Si hay un error en la solicitud, intentar con endpoints separados
      try {
        const [productosResponse, categoriasResponse] = await Promise.all([
          apiClient.get('/fs/utilidades/producto'),
          apiClient.get('/fs/utilidades/categoria')
        ])
        
        console.log('Utilidades de Productos:', productosResponse.data)
        console.log('Utilidades de Categorías:', categoriasResponse.data)

        const utilidadesValidas = [
          ...productosResponse.data.filter(u => u.porcentaje !== undefined && u.porcentaje !== null),
          ...categoriasResponse.data.filter(u => u.porcentaje !== undefined && u.porcentaje !== null)
        ]

        console.log('Utilidades combinadas:', utilidadesValidas)
        setUtilidades(utilidadesValidas)
      } catch (fallbackError) {
        console.error('Error en fallback de carga de utilidades:', fallbackError)
      }
    }
  }

  const fetchParametros = async () => {
    try {
      const response = await apiClient.get('/fs/parametros')
      setParametros(response.data)
      
      // Buscar parámetro de utilidad general
      const utilidadGeneral = response.data.find(p => p.clave === 'UTILIDAD')
      if (utilidadGeneral) {
        setUtilidadGeneralParametro(utilidadGeneral.valor)
      }
    } catch (error) {
      console.error('Error al cargar parámetros:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'idProducto') {
      const producto = productos.find(p => p.idProducto === parseInt(value))
      setFormData({
        ...formData,
        producto: { idProducto: value },
        precioUnitario: producto ? producto.precio : ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleAgregarProducto = () => {
    // Validar que todos los campos estén llenos
    if (!formData.producto.idProducto || !formData.cantidad || !formData.precioUnitario) {
      setError('Por favor complete todos los campos')
      return
    }

    // Encontrar el producto seleccionado
    const productoSeleccionado = productos.find(p => p.idProducto === parseInt(formData.producto.idProducto))

    // Determinar el porcentaje de utilidad
    const porcentajeUtilidad = formData.porcentajeUtilidadManual === 'manual'
      ? formData.porcentajeUtilidadManualPersonalizado
      : formData.porcentajeUtilidadManual

    // Crear un objeto de detalle de compra temporal
    const nuevoDetalle = {
      producto: {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombreProducto || productoSeleccionado.nombre,
        nombre: productoSeleccionado.nombre,
      },
      cantidad: formData.cantidad,
      precioUnitario: formData.precioUnitario,
      porcentajeUtilidadManual: porcentajeUtilidad
    }

    console.log('Nuevo detalle a agregar:', nuevoDetalle)

    // Llamar a la función del padre para agregar el detalle
    onProductoAgregado(nuevoDetalle)

    // Limpiar el formulario
    setFormData({
      compra: { idCompra: compraId },
      producto: { idProducto: '' },
      cantidad: '',
      precioUnitario: '',
      porcentajeUtilidadManual: null,
      porcentajeUtilidadManualPersonalizado: '',
    })
    setError(null)
  }

  return (
    <CForm onSubmit={(e) => e.preventDefault()}>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormSelect
            label="Producto"
            name="idProducto"
            value={formData.producto.idProducto}
            onChange={handleChange}
          >
            <option value="">Seleccionar Producto</option>
            {productos.length === 0 ? (
              <option>No hay productos</option>
            ) : (
              productos.map(producto => (
                <option
                  key={producto.idProducto}
                  value={producto.idProducto}
                >
                  {producto.nombreProducto || producto.nombre || 'Sin nombre'}
                </option>
              ))
            )}
          </CFormSelect>
        </CCol>

        <CCol md={2}>
          <CFormInput
            type="number"
            label="Cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            step="1"
          />
        </CCol>

        <CCol md={2}>
          <CFormInput
            type="number"
            label="Precio Unitario"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </CCol>

        <CCol md={2}>
          <CFormSelect
            label="Utilidad (%)"
            name="porcentajeUtilidadManual"
            value={formData.porcentajeUtilidadManual || ''}
            onChange={(e) => {
              const value = e.target.value
              setFormData({
                ...formData,
                porcentajeUtilidadManual: value,
                // Resetear el campo personalizado si no es manual
                porcentajeUtilidadManualPersonalizado: value === 'manual' 
                  ? formData.porcentajeUtilidadManualPersonalizado 
                  : ''
              })
            }}
          >
            <option value="">Seleccionar</option>
            {utilidades.length > 0 && (
              <>
                <optgroup label="Utilidades por Producto">
                  {utilidades
                    .filter(u => u.tipoUtilidad === 'PRODUCTO')
                    .map((utilidad) => (
                      <option 
                        key={`producto-${utilidad.idUtilidad}`} 
                        value={utilidad.porcentaje}
                      >
                        {`${utilidad.nombre} (${utilidad.porcentaje}%)`}
                      </option>
                    ))
                  }
                </optgroup>
                <optgroup label="Utilidades por Categoría">
                  {utilidades
                    .filter(u => u.tipoUtilidad === 'CATEGORIA')
                    .map((utilidad) => (
                      <option 
                        key={`categoria-${utilidad.idUtilidad}`} 
                        value={utilidad.porcentaje}
                      >
                        {`${utilidad.nombre} (${utilidad.porcentaje}%)`}
                      </option>
                    ))
                  }
                </optgroup>
              </>
            )}
            {utilidadGeneralParametro && (
              <option value={utilidadGeneralParametro}>
                {`Utilidad General (${utilidadGeneralParametro}%)`}
              </option>
            )}
            <option value="manual">Utilidad Manual</option>
          </CFormSelect>
        </CCol>
        {formData.porcentajeUtilidadManual === 'manual' && (
          <CCol md={2}>
            <CFormInput
              type="number"
              label="Ingrese Utilidad (%)"
              name="porcentajeUtilidadManualPersonalizado"
              value={formData.porcentajeUtilidadManualPersonalizado || ''}
              onChange={(e) => setFormData({
                ...formData,
                porcentajeUtilidadManualPersonalizado: e.target.value
              })}
              min="0"
              step="0.01"
              placeholder="Ej: 15.5"
            />
          </CCol>
        )}

        <CCol md={3} className="d-flex align-items-end">
          <CButton color="primary" onClick={handleAgregarProducto}>
            <CIcon icon={cilPlus} className="me-2" />
            Agregar Producto
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default CompraForm 