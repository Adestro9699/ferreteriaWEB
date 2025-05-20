import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CButton,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CSpinner,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { 
  cilX, 
  cilSearch,
  cilFilter,
  cilSortAlphaDown, 
  cilSortAlphaUp, 
  cilCloudDownload, 
  cilPlus,
  cilOptions,
  cilPencil,
  cilTrash
} from '@coreui/icons';
import apiClient from '../../services/apiClient';
import CrearProducto from '../../components/productoComp/CrearProducto';
import ProductoTable from '../../components/productoComp/ProductoTable';
import ProductoFilters from '../../components/productoComp/ProductoFilters';
import ProductoPagination from '../../components/productoComp/ProductoPagination';
import ProductoModal from '../../components/productoComp/ProductoModal';
import ProductoToasts from '../../components/productoComp/ProductoToasts';
import ProductoExport from '../../components/productoComp/ProductoExport';

//CLASE PADRE
const Producto = () => {
  const [details, setDetails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState('nombreProducto');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteMultipleConfirmation, setShowDeleteMultipleConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Estados para categorías, proveedores, subcategorías y unidades de medida
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  // Obtener datos del backend (productos, categorías, proveedores, subcategorías y unidades de medida)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const productosResponse = await apiClient.get('/productos');
        setItems(productosResponse.data);

        // Extraer marcas únicas de los productos
        const marcasUnicas = Array.from(
          new Set(productosResponse.data.map((producto) => producto.marca))
        ).filter((marca) => marca); // Filtrar valores no nulos
        setMarcas(marcasUnicas);

        // Obtener categorías
        const categoriasResponse = await apiClient.get('/categorias');
        setCategorias(categoriasResponse.data);

        // Obtener proveedores
        const proveedoresResponse = await apiClient.get('/proveedores');
        setProveedores(proveedoresResponse.data);

        // Obtener subcategorías
        const subcategoriasResponse = await apiClient.get('/subcategorias');
        setSubcategorias(subcategoriasResponse.data);

        // Obtener unidades de medida
        const unidadesMedidaResponse = await apiClient.get('/unidades-medida');
        setUnidadesMedida(unidadesMedidaResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilterText(value);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setFilterText('');
  };

  // Función para manejar el ordenamiento avanzado
  const handleAdvancedSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Función para reiniciar los filtros
  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  // Función para manejar la creación de un producto
  const handleCreateProduct = async (newProduct) => {
    try {
      console.log('Producto recibido desde CrearProducto:', newProduct); // Log para depuración
      setItems((prevItems) => [...prevItems, newProduct]); // Actualizar el estado con el nuevo producto
      setShowCreateModal(false); // Cerrar el modal
      addToast('Producto creado correctamente', 'success'); // Mostrar notificación
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      addToast('Error al crear el producto', 'danger'); // Mostrar notificación de error
    }
  };

  // Función para manejar la edición de un producto
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Función para guardar cambios en la edición
  const handleSaveChanges = async (updatedProduct) => {
    if (!updatedProduct) return;

    try {
      // Enviar el producto actualizado al backend
      const response = await apiClient.put(`/productos/${updatedProduct.idProducto}`, updatedProduct);

      // Actualizar el estado local con los datos actualizados
      const updatedItems = items.map((item) =>
        item.idProducto === updatedProduct.idProducto ? updatedProduct : item
      );
      setItems(updatedItems);

      // Mostrar notificación de éxito
      addToast('Producto actualizado correctamente', 'success');

      // Cerrar el modal
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);

      // Mostrar notificación de error
      addToast('Error al actualizar el producto', 'danger');
    }
  };

  // Función para confirmar la eliminación de un producto
  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Función para eliminar un producto
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await apiClient.delete(`/productos/${productToDelete}`);
      const updatedItems = items.filter((item) => item.idProducto !== productToDelete);
      setItems(updatedItems);
      addToast('Producto eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      addToast('Error al eliminar el producto', 'danger');
    } finally {
      setShowDeleteConfirmation(false);
      setProductToDelete(null);
    }
  };

  // Función para manejar la selección de items
  const handleSelectItem = (id) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para seleccionar todos los items de la página actual
  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.idProducto));
    }
  };

  // Función para eliminar los items seleccionados
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      addToast('No hay productos seleccionados para eliminar', 'warning');
      return;
    }

    // Mostrar el modal de confirmación antes de eliminar
    setShowDeleteMultipleConfirmation(true);
  };

  // Función para confirmar la eliminación múltiple
  const confirmDeleteMultiple = async () => {
    try {
      await apiClient.delete('/productos/eliminar-multiples', {
        data: selectedItems,
      });

      const updatedItems = items.filter((item) => !selectedItems.includes(item.idProducto));
      setItems(updatedItems);
      setSelectedItems([]);
      addToast('Productos eliminados correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar los productos:', error);
      addToast('Error al eliminar los productos', 'danger');
    } finally {
      setShowDeleteMultipleConfirmation(false);
    }
  };

  // Función para manejar cambios en la cantidad de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Función para agregar notificaciones (toasts)
  const addToast = (message, color = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      color,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 5000);
  };

  // Filtrar y ordenar los items
  const filteredItems = items.filter((item) => {
    if (!item || !item.nombreProducto) return false;

    const matchesSearchText =
      item.nombreProducto.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.marca && item.marca.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.subcategoria?.categoria?.nombre && item.subcategoria.categoria.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.material && item.material.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.proveedor?.nombre && item.proveedor.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.subcategoria?.nombre && item.subcategoria.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.codigoBarra && item.codigoBarra.toString().includes(filterText)) ||
      (item.estadoProducto && item.estadoProducto.toLowerCase().includes(filterText.toLowerCase()));

    const matchesCategory = filters.category ? item.marca === filters.category : true;
    const matchesStatus = filters.status ? item.estadoProducto === filters.status : true;
    const matchesMinPrice = filters.minPrice ? item.precio >= parseFloat(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? item.precio <= parseFloat(filters.maxPrice) : true;

    return matchesSearchText && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  const sortedItems = filteredItems.sort((a, b) => {
    if (!a || !b || !a[sortColumn] || !b[sortColumn]) return 0;

    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Manejar estado de loading y error
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger">
        Error al cargar los productos: {error}
      </CAlert>
    );
  }

  // Función para obtener la clase de color según el nivel de stock
  const getStockStatusClass = (stock, stockMinimo = 10) => {
    if (stock <= 0) return 'danger';
    if (stock < stockMinimo) return 'warning';
    return 'success';
  };

  return (
    <CContainer fluid className="producto-container">
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-transparent border-bottom-0">
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">Gestión de Productos</h4>
              <small className="text-medium-emphasis">
                {filteredItems.length} productos encontrados
              </small>
            </CCol>
            <CCol xs="auto">
              <CButton 
                color="primary" 
                onClick={() => setShowCreateModal(true)}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilPlus} className="me-2" />
                Nuevo Producto
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        
        <CCardBody>
          {/* Barra de búsqueda y filtros */}
          <CRow className="mb-4 g-3">
            <CCol md={6} lg={7}>
              <CInputGroup className="shadow-sm">
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Buscar producto por nombre, marca, categoría..."
                  value={filterText}
                  onChange={handleSearchChange}
                  className="border-start-0"
                />
                {filterText && (
                  <CInputGroupText className="bg-transparent border-start-0">
                    <CButton 
                      color="transparent" 
                      size="sm" 
                      onClick={clearSearch}
                      className="p-0"
                    >
                      <CIcon icon={cilX} />
                    </CButton>
                  </CInputGroupText>
                )}
              </CInputGroup>
            </CCol>
            
            <CCol md={3} lg={3}>
              <CInputGroup className="shadow-sm">
                <CInputGroupText>
                  <CIcon icon={cilSortAlphaDown} />
                </CInputGroupText>
                <CFormSelect
                  value={sortColumn}
                  onChange={(e) => handleAdvancedSort(e.target.value)}
                  className="border-start-0"
                >
                  <option value="nombreProducto">Ordenar por Nombre</option>
                  <option value="precio">Ordenar por Precio</option>
                  <option value="stock">Ordenar por Stock</option>
                  <option value="fechaModificacion">Ordenar por Fecha</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
            
            <CCol md={3} lg={2}>
              <CRow className="g-2">
                <CCol>
                  <CButton 
                    color={showFilters ? "primary" : "light"} 
                    className="w-100 shadow-sm d-flex align-items-center justify-content-center"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <CIcon icon={cilFilter} className="me-2" />
                    Filtros
                  </CButton>
                </CCol>
                <CCol>
                  <ProductoExport 
                    data={items} 
                    className="w-100 shadow-sm d-flex align-items-center justify-content-center"
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          
          {/* Contenedor para filtros y tabla */}
          <CRow>
            {/* Filtros (panel colapsable) */}
            {showFilters && (
              <CCol md={3} lg={3} className="mb-4">
                <CCard className="h-100 border-0 shadow-sm">
                  <CCardHeader className="bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fs-6">Filtros Avanzados</h5>
                    <CButton 
                      color="transparent" 
                      size="sm" 
                      onClick={() => setShowFilters(false)}
                      className="p-0 text-dark"
                    >
                      <CIcon icon={cilX} />
                    </CButton>
                  </CCardHeader>
                  <CCardBody>
                    <ProductoFilters
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      resetFilters={resetFilters}
                      marcas={marcas}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            )}
            
            {/* Tabla de productos */}
            <CCol md={showFilters ? 9 : 12} lg={showFilters ? 9 : 12}>
              <CCard className="border-0 shadow-sm">
                <CCardBody className="p-0">
                  <div className="table-responsive">
                    <ProductoTable
                      items={currentItems}
                      details={details}
                      selectedItems={selectedItems}
                      handleSelectItem={handleSelectItem}
                      handleSelectAll={handleSelectAll}
                      toggleDetails={(id) => setDetails((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id])}
                      handleEdit={handleEdit}
                      confirmDelete={confirmDelete}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      handleAdvancedSort={handleAdvancedSort}
                    />
                  </div>
                </CCardBody>
              </CCard>
              
              {/* Controles de paginación y acciones masivas */}
              <CCard className="mt-3 border-0 shadow-sm">
                <CCardBody className="py-2">
                  <CRow className="align-items-center">
                    <CCol xs={12} md="auto" className="mb-2 mb-md-0">
                      {selectedItems.length > 0 && (
                        <CButton 
                          color="danger" 
                          size="sm"
                          onClick={handleDeleteSelected}
                          className="d-flex align-items-center"
                        >
                          <CIcon icon={cilTrash} className="me-2" />
                          Eliminar Seleccionados ({selectedItems.length})
                        </CButton>
                      )}
                    </CCol>
                    <CCol className="d-flex justify-content-md-end justify-content-center">
                      <ProductoPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={sortedItems.length}
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Modal de creación de producto */}
      <CrearProducto
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateProduct}
        categorias={categorias}
        proveedores={proveedores}
        subcategorias={subcategorias}
        unidadesMedida={unidadesMedida}
      />

      {/* Modal de Edición */}
      <ProductoModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        handleSaveChanges={handleSaveChanges}
        categorias={categorias}
        proveedores={proveedores}
        subcategorias={subcategorias}
        unidadesMedida={unidadesMedida}
      />

      {/* Modal de Confirmación para Eliminar */}
      <CModal visible={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)} alignment="center">
        <CModalHeader className="border-bottom-0">
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilTrash} size="3xl" className="text-danger mb-3" />
          <p className="mb-0">¿Estás seguro de que deseas eliminar este producto?</p>
          <p className="text-muted small">Esta acción no se puede deshacer.</p>
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmación para Eliminación Múltiple */}
      <CModal visible={showDeleteMultipleConfirmation} onClose={() => setShowDeleteMultipleConfirmation(false)} alignment="center">
        <CModalHeader className="border-bottom-0">
          <CModalTitle>Confirmar Eliminación Múltiple</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilTrash} size="3xl" className="text-danger mb-3" />
          <p className="mb-0">¿Estás seguro de que deseas eliminar los {selectedItems.length} productos seleccionados?</p>
          <p className="text-muted small">Esta acción no se puede deshacer.</p>
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="secondary" onClick={() => setShowDeleteMultipleConfirmation(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmDeleteMultiple}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Notificaciones (Toasts) */}
      <ProductoToasts toasts={toasts} />
    </CContainer>
  );
};

export default Producto;