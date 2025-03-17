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
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilX, cilSortAlphaDown, cilSortAlphaUp, cilCloudDownload } from '@coreui/icons';
import apiClient from '../../services/apiClient';
import CrearProducto from '../../components/productoComp/CrearProducto';
import ProductoTable from '../../components/productoComp/ProductoTable';
import ProductoFilters from '../../components/productoComp/ProductoFilters';
import ProductoPagination from '../../components/productoComp/ProductoPagination';
import ProductoModal from '../../components/productoComp/ProductoModal';
import ProductoToasts from '../../components/productoComp/ProductoToasts';
import ProductoExport from '../../components/productoComp/ProductoExport';

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

  // Estados para categorías, proveedores y subcategorías y unidades de medida
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);


  // Obtener datos del backend (productos, categorías, proveedores, subcategorías y unidades de medida)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const productosResponse = await apiClient.get('/fs/productos');
        setItems(productosResponse.data);

        // Obtener categorías
        const categoriasResponse = await apiClient.get('/fs/categorias');
        setCategorias(categoriasResponse.data);

        // Obtener proveedores
        const proveedoresResponse = await apiClient.get('/fs/proveedores');
        setProveedores(proveedoresResponse.data);

        // Obtener subcategorías
        const subcategoriasResponse = await apiClient.get('/fs/subcategorias');
        setSubcategorias(subcategoriasResponse.data);

        // Obtener unidades de medida
        const unidadesMedidaResponse = await apiClient.get('/fs/unidades-medida');
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
  const handleSaveChanges = async () => {
    if (!currentProduct) return;

    try {
      const response = await apiClient.put(`/fs/productos/${currentProduct.idProducto}`, currentProduct);
      const updatedItems = items.map((item) =>
        item.idProducto === currentProduct.idProducto ? currentProduct : item
      );
      setItems(updatedItems);
      addToast('Producto actualizado correctamente', 'success');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
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
      await apiClient.delete(`/fs/productos/${productToDelete}`);
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
      await apiClient.delete('/fs/productos/eliminar-multiples', {
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
      (item.categoria?.nombre && item.categoria.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
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

  return (
    <CContainer>
      {/* Barra de búsqueda, ordenamiento y botón "Crear Producto" */}
      <CRow className="mb-3 align-items-center">
        <CCol>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Buscar por nombre, marca, categoría, material, etc..."
              value={filterText}
              onChange={handleSearchChange}
            />
            <CInputGroupText>
              <CButton color="light" onClick={clearSearch}>
                <CIcon icon={cilX} />
              </CButton>
            </CInputGroupText>
          </CInputGroup>
        </CCol>
        <CCol xs="auto">
          <CFormSelect
            value={sortColumn}
            onChange={(e) => handleAdvancedSort(e.target.value)}
          >
            <option value="nombreProducto">Ordenar por Nombre</option>
            <option value="precio">Ordenar por Precio</option>
            <option value="stock">Ordenar por Stock</option>
            <option value="fechaModificacion">Ordenar por Fecha</option>
          </CFormSelect>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" onClick={() => setShowCreateModal(true)}>
            Crear Producto
          </CButton>
        </CCol>
      </CRow>

      {/* Modal de creación de producto */}
      <CrearProducto
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateProduct}
        categorias={categorias} // Pasa las categorías
        proveedores={proveedores} // Pasa los proveedores
        subcategorias={subcategorias} // Pasa las subcategorías
        unidadesMedida={unidadesMedida} // Pasar las unidades de medida
      />

      {/* Filtros avanzados y botón de exportación */}
      <CRow>
        <CCol md={3}>
          <ProductoFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
          <div className="mt-3">
            <ProductoExport exportData={() => { }} />
          </div>
        </CCol>

        {/* Tabla */}
        <CCol md={9}>
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

          {/* Paginación y Selector de items por página */}
          <CRow className="mt-3 align-items-center p-3 bg-body rounded mb-3">
            <CCol xs="auto" className="d-flex align-items-center">
              {selectedItems.length > 0 && (
                <CButton color="danger" onClick={handleDeleteSelected}>
                  Eliminar Seleccionados ({selectedItems.length})
                </CButton>
              )}
            </CCol>
            <CCol className="d-flex align-items-center justify-content-center">
              <ProductoPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                handleItemsPerPageChange={handleItemsPerPageChange}
                totalItems={sortedItems.length}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      {/* Modal de Edición */}
      <ProductoModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        handleSaveChanges={handleSaveChanges}
        categorias={categorias} // Pasa las categorías
        proveedores={proveedores} // Pasa los proveedores
        subcategorias={subcategorias} // Pasa las subcategorías
        unidadesMedida={unidadesMedida} // Pasa las unidades de medida
      />

      {/* Modal de Confirmación para Eliminar */}
      <CModal visible={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar este producto?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmación para Eliminación Múltiple */}
      <CModal visible={showDeleteMultipleConfirmation} onClose={() => setShowDeleteMultipleConfirmation(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación Múltiple</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar los {selectedItems.length} productos seleccionados?
        </CModalBody>
        <CModalFooter>
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