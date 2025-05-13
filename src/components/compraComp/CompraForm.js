import React, { useState, useEffect, useRef } from 'react'
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { cilPlus, cilMinus, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiClient from '../../services/apiClient'

const CompraForm = ({ compraId, onProductoAgregado, productoEditando }) => {
  const [formData, setFormData] = useState({
    compra: { idCompra: compraId },
    producto: { idProducto: '' },
    cantidad: '',
    precioUnitario: '',
    porcentajeUtilidadManual: '',
    porcentajeUtilidadManualPersonalizado: '',
  })

  const [productos, setProductos] = useState([])
  const [utilidades, setUtilidades] = useState([])
  const [parametros, setParametros] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [utilidadGeneralParametro, setUtilidadGeneralParametro] = useState(null)
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchProductos()
    fetchUtilidades()
    fetchParametros()

    // Si hay un producto en edición, cargar sus datos
    if (productoEditando) {
      setFormData({
        compra: { idCompra: compraId },
        producto: { idProducto: productoEditando.producto.idProducto },
        cantidad: productoEditando.cantidad,
        precioUnitario: productoEditando.precioUnitario,
        porcentajeUtilidadManual: productoEditando.porcentajeUtilidadManual || '',
        porcentajeUtilidadManualPersonalizado: productoEditando.porcentajeUtilidadManual || '',
      })
      setBusquedaProducto(productoEditando.producto.nombreProducto || productoEditando.producto.nombre)
    }

    // Agregar event listener para cerrar el dropdown cuando se hace click fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [productoEditando])

  // Filtrar productos cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaProducto.trim() === '') {
      setProductosFiltrados([])
      return
    }

    const filtrados = productos.filter(producto => 
      (producto.nombreProducto || producto.nombre)
        .toLowerCase()
        .includes(busquedaProducto.toLowerCase())
    )
    setProductosFiltrados(filtrados)
    setShowDropdown(filtrados.length > 0)
  }, [busquedaProducto, productos])

  const fetchProductos = async () => {
    try {
      const response = await apiClient.get('/productos')
      setProductos(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cargar los productos')
    }
  }

  const fetchUtilidades = async () => {
    try {
      console.log('Iniciando fetchUtilidades...')
      const utilidadesResponse = await apiClient.get('/utilidades')
      
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
          apiClient.get('/utilidades/producto'),
          apiClient.get('/utilidades/categoria')
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
      const response = await apiClient.get('/parametros')
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

  const handleKeyDown = (e) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < productosFiltrados.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < productosFiltrados.length) {
          handleSeleccionarProducto(productosFiltrados[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'busquedaProducto') {
      setBusquedaProducto(value)
      setSelectedIndex(-1) // Reset selected index when typing
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSeleccionarProducto = (producto) => {
    setFormData({
      ...formData,
      producto: { idProducto: producto.idProducto },
      precioUnitario: producto.precio || ''
    })
    setBusquedaProducto(producto.nombreProducto || producto.nombre)
    setShowDropdown(false)
  }

  const handleAgregarProducto = () => {
    // Validar que todos los campos estén llenos
    if (!formData.producto.idProducto || !formData.cantidad || !formData.precioUnitario) {
      setError('Por favor complete todos los campos')
      return
    }

    // Validar que se haya seleccionado una utilidad
    if (!formData.porcentajeUtilidadManual) {
      setError('Debe seleccionar una utilidad para el producto')
      return
    }

    // Si se seleccionó utilidad manual, validar que se haya ingresado un valor
    if (formData.porcentajeUtilidadManual === 'manual' && !formData.porcentajeUtilidadManualPersonalizado) {
      setError('Debe ingresar un porcentaje de utilidad manual')
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
      porcentajeUtilidadManual: '',
      porcentajeUtilidadManualPersonalizado: '',
    })
    setBusquedaProducto('')
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
          <div ref={dropdownRef} className="position-relative">
            <CFormInput
              label="Buscar Producto"
              name="busquedaProducto"
              value={busquedaProducto}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Escriba para buscar..."
              required
            />
            {showDropdown && (
              <div className="position-absolute w-100 border rounded-bottom shadow-sm" 
                style={{ 
                  zIndex: 1000, 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  backgroundColor: 'var(--cui-body-bg)',
                  color: 'var(--cui-body-color)'
                }}
              >
                {productosFiltrados.map((producto, index) => (
                  <div
                    key={producto.idProducto}
                    className="p-2 cursor-pointer"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: index === selectedIndex ? 'var(--cui-component-hover-bg)' : 'transparent',
                      ':hover': {
                        backgroundColor: 'var(--cui-component-hover-bg)'
                      }
                    }}
                    onClick={() => handleSeleccionarProducto(producto)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {producto.nombreProducto || producto.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CCol>
        <CCol md={3}>
          <CFormInput
            label="Cantidad"
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            label="Precio Unitario"
            type="number"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            required
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            label="Utilidad"
            name="porcentajeUtilidadManual"
            value={formData.porcentajeUtilidadManual}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Utilidad</option>
            {utilidadGeneralParametro && (
              <option value={utilidadGeneralParametro}>
                Utilidad General ({utilidadGeneralParametro}%)
              </option>
            )}
            {utilidades.map((utilidad) => (
              <option key={utilidad.idUtilidad} value={utilidad.porcentaje}>
                {utilidad.tipoUtilidad === 'CATEGORIA' ? 'Categoría' : 'Producto'} {utilidad.nombre} ({utilidad.porcentaje}%)
              </option>
            ))}
            <option value="manual">Utilidad Manual</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {formData.porcentajeUtilidadManual === 'manual' && (
        <CRow className="mb-3">
          <CCol md={3}>
            <CFormInput
              label="Porcentaje de Utilidad Manual"
              type="number"
              name="porcentajeUtilidadManualPersonalizado"
              value={formData.porcentajeUtilidadManualPersonalizado}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>
      )}

      <CRow>
        <CCol>
          <CButton color="primary" onClick={handleAgregarProducto}>
            <CIcon icon={cilPlus} className="me-2" />
            {productoEditando ? 'Actualizar Producto' : 'Agregar Producto'}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default CompraForm 