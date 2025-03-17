import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
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
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const ModalProductos = ({ modalVisible, setModalVisible, handleProductosSeleccionados, registrarReinicio }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    color: 'danger',
  });

  const reiniciarEstado = () => {
    setSelectedProducts([]); // Reiniciar la lista de productos seleccionados
    setCantidades({}); // Reiniciar las cantidades
    setSearchTerm(''); // Reiniciar el término de búsqueda
    setProductos([]); // Reiniciar la lista de productos
    setPagination({ // Reiniciar la paginación
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
    });
  };

  // Añade este useEffect después de la declaración de reiniciarEstado o junto a los otros useEffects
  useEffect(() => {
    if (registrarReinicio) {
      registrarReinicio(reiniciarEstado);
    }
  }, []); // Dependencia para que se ejecute cuando cambie registrarReinicio

  // Estado de paginación
  const [pagination, setPagination] = useState({
    page: 1,          // Página actual
    pageSize: 10,     // Tamaño de la página
    total: 0,         // Total de productos
    totalPages: 1,    // Total de páginas
  });

  // Cargar datos iniciales cuando el modal se abre
  useEffect(() => {
    if (modalVisible) {
      fetchProductosPaginados(pagination.page, pagination.pageSize);
    }
  }, [modalVisible, pagination.page, pagination.pageSize]);

  // Función para cargar productos paginados
  const fetchProductosPaginados = async (page, pageSize) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/fs/productos/paginados?page=${page}&pageSize=${pageSize}`);
      setProductos(response.data.data); // Datos de la página actual
      setPagination({
        page: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      setError('Error al cargar los productos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setProductos(data);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      setError('Error al buscar los productos. Inténtalo de nuevo.');
      setProductos([]);
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

  // Función para mostrar el toast
  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  // Función para manejar el clic en "Agregar"
  const handleAgregar = () => {
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
      showToast('Por favor, ingresar cantidad válida para el/los productos seleccionados.');
      return;
    }

    const productosConCantidad = selectedProducts.map((producto) => ({
      idProducto: producto.idProducto,
      nombre: producto.nombreProducto,
      precio: producto.precio,
      unidadMedida: producto.unidadMedida?.abreviatura || '',
      cantidad: parseFloat(cantidades[producto.idProducto]) || 1,
      stock: producto.stock,
    }));

    handleProductosSeleccionados(productosConCantidad); // Pasar los productos seleccionados al padre
    setModalVisible(false); // Cerrar el modal
  };

  // Función para limpiar el término de búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    fetchProductosPaginados(pagination.page, pagination.pageSize); // Recargar productos paginados
  };

  return (
    <>
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} className="custom-lg-modal" backdrop="static">
        <CModalHeader closeButton={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Título y campo de búsqueda */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CModalTitle>Lista de Productos</CModalTitle>
              <div style={{ marginLeft: '20px' }}>
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
            </div>

            {/* Botones "Agregar" y "Cerrar" */}
            <div>
              <CButton
                color="primary"
                onClick={handleAgregar}
                disabled={
                  selectedProducts.length === 0 ||
                  !selectedProducts.every((p) => cantidades[p.idProducto] && !isNaN(cantidades[p.idProducto]) && parseFloat(cantidades[p.idProducto]) > 0)
                }
                style={{ marginRight: '10px' }}
              >
                Agregar
              </CButton>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cerrar
              </CButton>
            </div>
          </div>
        </CModalHeader>

        <CModalBody>
          {loading ? (
            <div>Cargando productos...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* Tabla de productos */}
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
                  {Array.isArray(productos) && productos.length > 0 ? (
                    productos.map((producto, index) => (
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
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  handleCantidadChange(producto.idProducto, value);
                                }
                              }}
                              size="sm"
                              style={{ width: '60px' }}
                              min={1}
                              max={producto.stock}
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
                        <CTableDataCell>{producto.subcategoria?.nombre}</CTableDataCell>
                        <CTableDataCell>{producto.subcategoria?.categoria?.nombre}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={12} className="text-center">
                        No se encontraron productos.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Paginación y selector de registros por página */}
              <CRow className="mt-3 align-items-center p-3 bg-body rounded mb-3">
                <CCol className="d-flex align-items-center justify-content-center">
                  <CPagination className="mb-0">
                    <CPaginationItem
                      disabled={pagination.page === 1}
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Anterior
                    </CPaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <CPaginationItem
                        key={i + 1}
                        active={i + 1 === pagination.page}
                        onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Siguiente
                    </CPaginationItem>
                  </CPagination>
                  <CFormSelect
                    value={pagination.pageSize}
                    onChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))}
                    className="ms-3"
                    style={{ width: 'auto' }}
                  >
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={30}>30 por página</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Toast en la esquina superior derecha */}
      <CToaster placement="top-center">
        {toast.visible && (
          <CToast autohide={true} visible={toast.visible} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">Aviso</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </>
  );
};

export default ModalProductos;