import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const ModalProductos = ({ modalVisible, setModalVisible, handleProductosSeleccionados }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales cuando el modal se abre
  useEffect(() => {
    if (modalVisible) {
      setLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          // Obtener productos
          const productosResponse = await apiClient.get('/fs/productos');
          setProductos(productosResponse.data);
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar los productos:', error);
          setError('Error al cargar los productos. Inténtalo de nuevo.');
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [modalVisible]);

  // Búsqueda avanzada
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    try {
      let url = '/fs/productos';

      if (value.length > 0) {
        if (/^\d+$/.test(value)) {
          url = `/fs/productos/buscarPorCodigoBarra?codigoBarra=${value}`;
        } else if (value.toLowerCase() === 'activo' || value.toLowerCase() === 'inactivo') {
          url = `/fs/productos/buscarPorEstado?estado=${value.toUpperCase()}`;
        } else {
          const endpoints = [
            `/fs/productos/buscarPorNombre?nombre=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorMarca?marca=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorCategoria?categoria=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorMaterial?material=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorNombreProveedor?nombreProveedor=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorNombreSubcategoria?nombreSubcategoria=${encodeURIComponent(value)}`,
            `/fs/productos/buscarPorCodigoSKU?codigoSKU=${encodeURIComponent(value)}`,
          ];

          const responses = await Promise.all(
            endpoints.map((endpoint) => apiClient.get(endpoint).catch(() => null))
          );

          const combinedResults = responses
            .filter((response) => response && response.data.length > 0)
            .flatMap((response) => response.data);

          const uniqueResults = Array.from(new Set(combinedResults.map((p) => p.idProducto))).map(
            (id) => combinedResults.find((p) => p.idProducto === id)
          );

          setProductos(uniqueResults);
          return;
        }
      }

      const response = await apiClient.get(url);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      setError('Error al buscar los productos. Inténtalo de nuevo.');
    }
  };

  // Función para manejar la selección/deselección de productos
  const handleCheckboxChange = (producto) => {
    if (selectedProducts.some((p) => p.idProducto === producto.idProducto)) {
      setSelectedProducts(selectedProducts.filter((p) => p.idProducto !== producto.idProducto));
      const nuevasCantidades = { ...cantidades };
      delete nuevasCantidades[producto.idProducto];
      setCantidades(nuevasCantidades);
    } else {
      setSelectedProducts([...selectedProducts, producto]);
      setCantidades({ ...cantidades, [producto.idProducto]: '' });
    }
  };

  // Función para manejar el cambio en la cantidad de un producto
  const handleCantidadChange = (idProducto, value) => {
    if (value === '' || !isNaN(value)) {
      setCantidades({ ...cantidades, [idProducto]: value });
    }
  };

  // Función para manejar el clic en "Agregar"
  const handleAgregar = () => {
    // Validar que todos los productos seleccionados tengan una cantidad válida
    const isValid = selectedProducts.every((producto) => {
      const cantidad = parseFloat(cantidades[producto.idProducto]);
      return (
        cantidad !== '' &&
        !isNaN(cantidad) &&
        cantidad > 0 &&
        cantidad <= producto.stock
      );
    });

    if (!isValid) {
      alert('Por favor, ingresar cantidad válida para el/los productos seleccionados.');
      return;
    }

    // Continuar con el proceso normal
    const productosConCantidad = selectedProducts.map((producto) => ({
      idProducto: producto.idProducto,
      nombre: producto.nombreProducto,
      precio: producto.precio,
      unidadMedida: producto.unidadMedida?.abreviatura || '',
      cantidad: parseFloat(cantidades[producto.idProducto]) || 1,
      stock: producto.stock,
    }));

    handleProductosSeleccionados(productosConCantidad);
    setModalVisible(false);
  };

  // Función para limpiar el término de búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <CModal visible={modalVisible} onClose={() => setModalVisible(false)} className="custom-lg-modal">
      <CModalHeader>
        <CModalTitle>Lista de Productos</CModalTitle>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <CInputGroup style={{ width: '250px', marginRight: '10px' }}>
            <CFormInput
              type="text"
              placeholder="Buscar productos ..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="sm"
              style={{ fontSize: '16px' }}
            />
            <CInputGroupText>
              <CButton color="light" onClick={clearSearch}>
                <CIcon icon={cilX} />
              </CButton>
            </CInputGroupText>
          </CInputGroup>
        </div>
      </CModalHeader>

      <CModalBody>
        {loading ? (
          <div>Cargando productos...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Check</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Precio</CTableHeaderCell>
                <CTableHeaderCell>Und. Medida</CTableHeaderCell>
                <CTableHeaderCell>Stock</CTableHeaderCell>
                <CTableHeaderCell>SKU</CTableHeaderCell>
                <CTableHeaderCell>Marca</CTableHeaderCell>
                <CTableHeaderCell>Material</CTableHeaderCell>
                <CTableHeaderCell>Código de Barra</CTableHeaderCell>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Subcategoría</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {productos.map((producto, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <CFormCheck
                      id={`checkbox-${producto.idProducto}`}
                      onChange={() => handleCheckboxChange(producto)}
                      checked={selectedProducts.some((p) => p.idProducto === producto.idProducto)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    {selectedProducts.some((p) => p.idProducto === producto.idProducto) && (
                      <CFormInput
                        type="text"
                        value={cantidades[producto.idProducto] || ''}
                        onChange={(e) => handleCantidadChange(producto.idProducto, e.target.value)}
                        size="sm"
                        style={{ width: '60px' }}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>{producto.nombreProducto}</CTableDataCell>
                  <CTableDataCell>{producto.precio}</CTableDataCell>
                  <CTableDataCell>{producto.unidadMedida?.abreviatura}</CTableDataCell>
                  <CTableDataCell>{producto.stock}</CTableDataCell>
                  <CTableDataCell>{producto.codigoSKU}</CTableDataCell>
                  <CTableDataCell>{producto.marca}</CTableDataCell>
                  <CTableDataCell>{producto.material}</CTableDataCell>
                  <CTableDataCell>{producto.codigoBarra}</CTableDataCell>
                  <CTableDataCell>{producto.categoria?.nombre}</CTableDataCell>
                  <CTableDataCell>{producto.subcategoria?.nombre}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="info" disabled>
          Productos seleccionados ({selectedProducts.length})
        </CButton>
        <div style={{ flex: 1 }}></div>
        <CButton
          color="primary"
          onClick={handleAgregar}
          disabled={
            selectedProducts.length === 0 ||
            !selectedProducts.every((p) => cantidades[p.idProducto] && !isNaN(cantidades[p.idProducto]) && parseFloat(cantidades[p.idProducto]) > 0)
          }
        >
          Agregar
        </CButton>
        <CButton color="secondary" onClick={() => setModalVisible(false)}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalProductos;