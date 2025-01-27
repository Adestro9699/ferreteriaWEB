import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CCollapse,
  CFormInput,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormCheck,
  CForm,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import { cilPencil, cilTrash, cilX, cilSortAlphaDown, cilSortAlphaUp, cilCloudDownload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import CrearProducto from './crearProducto'; // Importar el componente CrearProducto


const getBadge = (status) => {
  switch (status) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'secondary';
    case 'PENDIENTE':
      return 'warning';
    case 'BANEADO':
      return 'danger';
    default:
      return 'primary';
  }
};

const ExportButton = ({ exportData }) => {
  return (
    <CDropdown>
      <CDropdownToggle color="secondary">
        <CIcon icon={cilCloudDownload} className="me-2" />
        Exportar
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={() => exportData('Excel')}>Excel</CDropdownItem>
        <CDropdownItem onClick={() => exportData('CSV')}>CSV</CDropdownItem>
        <CDropdownItem onClick={() => exportData('PDF')}>PDF</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

const AdvancedTableExample = () => {
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
  const [productToDelete, setProductToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para controlar el modal de creación

  // Estados para categorías, proveedores y subcategorías
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  // Obtener datos del backend (productos, categorías, proveedores, subcategorías)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const productosResponse = await axios.get('http://localhost:8080/fs/productos');
        setItems(productosResponse.data);

        // Obtener categorías
        const categoriasResponse = await axios.get('http://localhost:8080/fs/categorias');
        setCategorias(categoriasResponse.data);

        // Obtener proveedores
        const proveedoresResponse = await axios.get('http://localhost:8080/fs/proveedores');
        setProveedores(proveedoresResponse.data);

        // Obtener subcategorías
        const subcategoriasResponse = await axios.get('http://localhost:8080/fs/subcategorias');
        setSubcategorias(subcategoriasResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Resto de la lógica del componente (funciones, JSX, etc.)...
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

  // Obtener datos del endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fs/productos');
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateProduct = async (newProduct) => {
    try {
      // Agregar la fecha de modificación actual
      const productWithDate = {
        ...newProduct, // Ya incluye categoria, proveedor y subcategoria como objetos
        fechaModificacion: new Date().toISOString(), // Fecha actual en formato ISO
      };

      console.log("Datos a enviar al backend:", productWithDate); // Verificar los datos antes de enviar

      // Enviar el nuevo producto al backend
      const response = await axios.post('http://localhost:8080/fs/productos', productWithDate);

      console.log("Respuesta del backend:", response.data); // Verificar la respuesta del backend

      // Agregar el nuevo producto a la lista
      setItems([...items, response.data]);

      // Cerrar el modal
      setShowCreateModal(false);

      // Mostrar notificación de éxito
      addToast('Producto creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear el producto:', error);
      addToast('Error al crear el producto', 'danger');
    }
  };

  // Búsqueda avanzada
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setFilterText(value);

    try {
      let url = 'http://localhost:8080/fs/productos';

      if (value.length > 0) {
        if (/^\d+$/.test(value)) {
          // Si el filtro es solo números, buscar por código de barra
          url = `http://localhost:8080/fs/productos/buscarPorCodigoBarra?codigoBarra=${value}`;
        } else if (value.toLowerCase() === 'activo' || value.toLowerCase() === 'inactivo') {
          // Si el filtro es "activo" o "inactivo", buscar por estado
          url = `http://localhost:8080/fs/productos/buscarPorEstado?estado=${value.toUpperCase()}`;
        } else {
          // Búsqueda en paralelo en múltiples endpoints
          const endpoints = [
            `http://localhost:8080/fs/productos/buscarPorNombre?nombre=${encodeURIComponent(value)}`,
            `http://localhost:8080/fs/productos/buscarPorMarca?marca=${encodeURIComponent(value)}`,
            `http://localhost:8080/fs/productos/buscarPorCategoria?categoria=${encodeURIComponent(value)}`,
            `http://localhost:8080/fs/productos/buscarPorMaterial?material=${encodeURIComponent(value)}`,
            `http://localhost:8080/fs/productos/buscarPorNombreProveedor?nombreProveedor=${encodeURIComponent(value)}`,
            `http://localhost:8080/fs/productos/buscarPorNombreSubcategoria?nombreSubcategoria=${encodeURIComponent(value)}`,
          ];

          const responses = await Promise.all(
            endpoints.map((endpoint) => axios.get(endpoint).catch(() => null))
          );

          // Combinar y eliminar duplicados
          const combinedResults = responses
            .filter((response) => response && response.data.length > 0)
            .flatMap((response) => response.data);

          const uniqueResults = Array.from(new Set(combinedResults.map((p) => p.idProducto))).map(
            (id) => combinedResults.find((p) => p.idProducto === id)
          );

          setItems(uniqueResults);
          return;
        }
      }

      // Si no hay filtro o no se usó la búsqueda en paralelo, hacer la búsqueda por defecto
      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      // No mostrar el toast mientras se escribe el código de barras
      if (!/^\d+$/.test(value)) {
        addToast('Error al buscar los datos', 'danger');
      }
    }
  };

  // Limpiar la barra de búsqueda y restaurar la lista completa
  const clearSearch = async () => {
    setFilterText(''); // Limpiar la barra de búsqueda

    try {
      // Cargar la lista completa de productos
      const response = await axios.get('http://localhost:8080/fs/productos');
      setItems(response.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      addToast('Error al cargar los datos', 'danger');
    }
  };

  // Alternar detalles de una fila
  const toggleDetails = (id) => {
    const position = details.indexOf(id);
    let newDetails = [...details];
    if (position === -1) {
      newDetails = [...details, id];
    } else {
      newDetails.splice(position, 1);
    }
    setDetails(newDetails);
  };

  // Filtrado combinado (búsqueda y filtros avanzados)
  const filteredItems = items.filter((item) => {
    if (!item || !item.nombreProducto) return false;

    // Filtro de búsqueda general
    const matchesSearchText =
      item.nombreProducto.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.marca && item.marca.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.categoria?.nombre && item.categoria.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.material && item.material.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.proveedor?.nombre && item.proveedor.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.subcategoria?.nombre && item.subcategoria.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.codigoBarra && item.codigoBarra.toString().includes(filterText)) ||
      (item.estadoProducto && item.estadoProducto.toLowerCase().includes(filterText.toLowerCase()));

    // Filtros avanzados
    const matchesCategory = filters.category ? item.marca === filters.category : true;
    const matchesStatus = filters.status ? item.estadoProducto === filters.status : true;
    const matchesMinPrice = filters.minPrice ? item.precio >= parseFloat(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? item.precio <= parseFloat(filters.maxPrice) : true;

    // Combinar todos los filtros
    return matchesSearchText && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  // Ordenamiento
  const sortedItems = filteredItems.sort((a, b) => {
    if (!a || !b || !a[sortColumn] || !b[sortColumn]) return 0;

    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Selección de items
  const handleSelectItem = (id) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Seleccionar todos los items de la página actual
  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.idProducto));
    }
  };

  // Eliminar items seleccionados
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      addToast('No hay productos seleccionados para eliminar', 'warning');
      return;
    }

    try {
      // Enviar una solicitud DELETE al backend con los IDs seleccionados
      await axios.delete('http://localhost:8080/fs/productos/eliminar-multiples', {
        data: selectedItems,  // Enviar solo el array de IDs
      });

      // Actualizar la lista de productos en el frontend
      const updatedItems = items.filter((item) => !selectedItems.includes(item.idProducto));
      setItems(updatedItems);

      // Limpiar la lista de seleccionados
      setSelectedItems([]);

      // Mostrar notificación de éxito
      addToast('Productos eliminados correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar los productos:', error);
      addToast('Error al eliminar los productos', 'danger');
    }
  };

  // Cambiar la cantidad de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Reiniciar los filtros avanzados
  const resetFilters = () => {
    setFilterText('');
    setFilters({
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  // Manejar el ordenamiento avanzado
  const handleAdvancedSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Exportar datos
  const exportData = (format) => {
    console.log(`Exportando datos en formato ${format}`);
    // Aquí puedes implementar la lógica para exportar a Excel, CSV, PDF, etc.
  };

  // Abrir modal de edición
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null);
  };

  // Guardar cambios en la edición
  const handleSaveChanges = async () => {
    if (!currentProduct) return;

    try {
      // Actualizar la fecha de modificación
      const updatedProduct = {
        ...currentProduct,
        fechaModificacion: new Date().toISOString(), // Fecha actual en formato ISO
      };

      // Enviar el producto actualizado al backend
      const response = await axios.put(
        `http://localhost:8080/fs/productos/${currentProduct.idProducto}`,
        currentProduct
      );

      // Actualizar la lista de productos
      const updatedItems = items.map((item) =>
        item.idProducto === currentProduct.idProducto ? currentProduct : item
      );
      setItems(updatedItems);

      // Cerrar el modal y mostrar notificación
      addToast('Producto actualizado correctamente', 'success');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      addToast('Error al actualizar el producto', 'danger');
    }
  };

  // Confirmar eliminación de un producto
  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Eliminar un producto después de confirmar
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`http://localhost:8080/fs/productos/${productToDelete}`);

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

  // Mostrar mensaje de carga o error
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          {/* Botón para abrir el modal de creación */}
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
        categorias={categorias}
        proveedores={proveedores}
        subcategorias={subcategorias}
      />

      {/* Filtros avanzados y botón de exportación */}
      <CRow>
        <CCol md={3}>
          <CForm>
            <CFormLabel>Marca</CFormLabel>
            <CFormSelect
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              <option value="Truper">Truper</option>
              {/* Agrega más opciones según las marcas disponibles */}
            </CFormSelect>

            <CFormLabel className="mt-3">Estado</CFormLabel>
            <CFormSelect
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="BANEADO">Baneado</option>
            </CFormSelect>

            <CFormLabel className="mt-3">Precio Mínimo</CFormLabel>
            <CFormInput
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Mínimo"
            />

            <CFormLabel className="mt-3">Precio Máximo</CFormLabel>
            <CFormInput
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Máximo"
            />

            {/* Botón para reiniciar los filtros */}
            <CButton color="secondary" className="mt-3" onClick={resetFilters}>
              Reiniciar Filtros
            </CButton>

            {/* Componente de exportación */}
            <div className="mt-3">
              <ExportButton exportData={exportData} />
            </div>
          </CForm>
        </CCol>

        {/* Tabla */}
        <CCol md={9}>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>
                  <CFormCheck
                    checked={selectedItems.length === currentItems.length}
                    onChange={handleSelectAll}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleAdvancedSort('nombreProducto')}>
                  Nombre {sortColumn === 'nombreProducto' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleAdvancedSort('precio')}>
                  Precio {sortColumn === 'precio' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleAdvancedSort('stock')}>
                  Stock {sortColumn === 'stock' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleAdvancedSort('fechaModificacion')}>
                  Fecha Modificación {sortColumn === 'fechaModificacion' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
                </CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((item) => (
                <React.Fragment key={item.idProducto}>
                  <CTableRow>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedItems.includes(item.idProducto)}
                        onChange={() => handleSelectItem(item.idProducto)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{item.nombreProducto}</CTableDataCell>
                    <CTableDataCell>${item.precio}</CTableDataCell>
                    <CTableDataCell>{item.stock}</CTableDataCell>
                    <CTableDataCell>{item.fechaModificacion}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getBadge(item.estadoProducto)}>{item.estadoProducto}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetails(item.idProducto)}
                        className="me-2"
                      >
                        {details.includes(item.idProducto) ? 'Hide' : 'Show'}
                      </CButton>
                      <CButton
                        color="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => confirmDelete(item.idProducto)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                  {details.includes(item.idProducto) && (
                    <CTableRow>
                      <CTableDataCell colSpan={6}>
                        <CCollapse visible={details.includes(item.idProducto)}>
                          <div className="p-3">
                            <h4>{item.nombreProducto}</h4>
                            <p className="text-body-secondary">Código de Barras: {item.codigoBarra}</p>
                            <p className="text-body-secondary">SKU: {item.codigoSKU}</p>
                            <p className="text-body-secondary">Descripción: {item.descripcion}</p>
                            <p className="text-body-secondary">Marca: {item.marca}</p>
                            <p className="text-body-secondary">Material: {item.material}</p>
                            <p className="text-body-secondary">Proveedor: {item.proveedor?.nombre}</p>
                            <p className="text-body-secondary">Categoría: {item.categoria?.nombre}</p>
                            <p className="text-body-secondary">Subcategoría: {item.subcategoria?.nombre}</p>
                          </div>
                        </CCollapse>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </React.Fragment>
              ))}
            </CTableBody>
          </CTable>

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
              <CPagination className="mb-0">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: Math.ceil(sortedItems.length / itemsPerPage) }, (_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(sortedItems.length / itemsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
              <CFormSelect
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="ms-3"
                style={{ width: 'auto' }}
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={30}>30 por página</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      {/* Modal de Edición */}
      <CModal visible={showEditModal} onClose={handleCloseEditModal}>
        <CModalHeader>
          <CModalTitle>Editar Producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {currentProduct && (
            <CForm>
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.nombreProducto}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, nombreProducto: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Descripción</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.descripcion}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, descripcion: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Precio</CFormLabel>
              <CFormInput
                type="number"
                value={currentProduct.precio}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, precio: parseFloat(e.target.value) })
                }
              />

              <CFormLabel className="mt-3">Stock</CFormLabel>
              <CFormInput
                type="number"
                value={currentProduct.stock}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })
                }
              />

              <CFormLabel className="mt-3">Marca</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.marca}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, marca: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Material</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.material}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, material: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Código de Barras</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.codigoBarra}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, codigoBarra: e.target.value })
                }
              />

              <CFormLabel className="mt-3">SKU</CFormLabel>
              <CFormInput
                type="text"
                value={currentProduct.codigoSKU}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, codigoSKU: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Estado</CFormLabel>
              <CFormSelect
                value={currentProduct.estadoProducto}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, estadoProducto: e.target.value })
                }
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="BANEADO">Baneado</option>
              </CFormSelect>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>

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

      {/* Notificaciones (Toasts) */}
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} visible={true} color={toast.color} autohide={true} delay={3000}>
            <CToastHeader closeButton>
              <strong className="me-auto">Notificación</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  );
};

export default AdvancedTableExample;
