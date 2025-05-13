import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react';
import apiClient from '../../services/apiClient'; // Importa tu apiClient

//COMPONENTE PARA CREAR UN PRODUCTO

const CrearProducto = ({ show, onClose, onSave, categorias, proveedores, subcategorias, unidadesMedida }) => {
  const [newProduct, setNewProduct] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    material: '',
    codigoBarra: '',
    codigoSKU: '',
    estadoProducto: 'ACTIVO',
    idCategoria: '',
    idProveedor: '',
    idSubcategoria: '',
    idUnidadMedida: '',
    fechaModificacion: '',
  });

  const [imagenURL, setImagenURL] = useState(''); // Estado para almacenar la URL de la imagen
  const [filteredSubcategorias, setFilteredSubcategorias] = useState([]);

  // Filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (newProduct.idCategoria) {
      const subcategoriasFiltradas = subcategorias.filter(
        (subcategoria) => subcategoria.categoria.idCategoria === Number(newProduct.idCategoria)
      );
      setFilteredSubcategorias(subcategoriasFiltradas);
    } else {
      setFilteredSubcategorias([]);
    }
  }, [newProduct.idCategoria, subcategorias]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Manejar la selección de archivos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/productos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          setImagenURL(response.data); // Guardar la URL de la imagen
        } else {
          alert('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir la imagen');
      }
    }
  };

  // Guardar el producto
  const handleSave = async () => {
    // Validar campos obligatorios
    if (
      !newProduct.nombreProducto ||
      !newProduct.descripcion ||
      !newProduct.precio ||
      !newProduct.stock ||
      !newProduct.idCategoria ||
      !newProduct.idProveedor ||
      !newProduct.idSubcategoria ||
      !newProduct.idUnidadMedida
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
  
    // Crear el objeto con la estructura esperada por el backend
    const productWithDate = {
      ...newProduct,
      imagenURL: imagenURL, // Incluir la URL de la imagen
      categoria: { idCategoria: Number(newProduct.idCategoria) },
      proveedor: { idProveedor: Number(newProduct.idProveedor) },
      subcategoria: { idSubcategoria: Number(newProduct.idSubcategoria) },
      unidadMedida: { idUnidadMedida: Number(newProduct.idUnidadMedida) },
      fechaModificacion: new Date().toISOString(),
    };
  
    console.log('Datos enviados desde CrearProducto:', productWithDate); // Log para depuración
  
    try {
      const response = await apiClient.post('/productos', productWithDate); // Enviar el producto al backend
      console.log('Respuesta del backend:', response.data); // Log para depuración
  
      if (response.status === 201) {
        onSave(response.data); // Pasar el producto creado al componente padre
        onClose(); // Cerrar el modal
      } else {
        alert('Error al crear el producto');
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al guardar el producto');
    }
  
    // Reiniciar el formulario después de notificar al padre
    setNewProduct({
      nombreProducto: '',
      descripcion: '',
      precio: '',
      stock: '',
      marca: '',
      material: '',
      codigoBarra: '',
      codigoSKU: '',
      estadoProducto: 'ACTIVO',
      idCategoria: '',
      idProveedor: '',
      idSubcategoria: '',
      idUnidadMedida: '',
      fechaModificacion: '',
    });
    setImagenURL(''); // Limpiar la URL de la imagen
  };

  return (
    <CModal visible={show} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Crear Nuevo Producto</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Primera fila: Nombre y Descripción */}
          <CRow>
            <CCol md={6}>
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                name="nombreProducto"
                value={newProduct.nombreProducto}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Descripción</CFormLabel>
              <CFormInput
                type="text"
                name="descripcion"
                value={newProduct.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del producto"
              />
            </CCol>
          </CRow>

          {/* Segunda fila: Precio y Stock */}
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel>Precio</CFormLabel>
              <CFormInput
                type="number"
                name="precio"
                value={newProduct.precio}
                onChange={handleInputChange}
                placeholder="Precio del producto"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Stock</CFormLabel>
              <CFormInput
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="Stock disponible"
              />
            </CCol>
          </CRow>

          {/* Tercera fila: Marca y Material */}
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel>Marca</CFormLabel>
              <CFormInput
                type="text"
                name="marca"
                value={newProduct.marca}
                onChange={handleInputChange}
                placeholder="Marca del producto"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Material</CFormLabel>
              <CFormInput
                type="text"
                name="material"
                value={newProduct.material}
                onChange={handleInputChange}
                placeholder="Material del producto"
              />
            </CCol>
          </CRow>

          {/* Cuarta fila: Código de Barras y SKU */}
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel>Código de Barras</CFormLabel>
              <CFormInput
                type="text"
                name="codigoBarra"
                value={newProduct.codigoBarra}
                onChange={handleInputChange}
                placeholder="Código de barras"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>SKU</CFormLabel>
              <CFormInput
                type="text"
                name="codigoSKU"
                value={newProduct.codigoSKU}
                onChange={handleInputChange}
                placeholder="Código SKU"
              />
            </CCol>
          </CRow>

          {/* Quinta fila: Estado y Proveedor */}
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                name="estadoProducto"
                value={newProduct.estadoProducto}
                onChange={handleInputChange}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="BANEADO">Baneado</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Proveedor</CFormLabel>
              <CFormSelect
                name="idProveedor"
                value={newProduct.idProveedor}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.nombre}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Sexta fila: Unidad Medida, Categoría y Subcategoría */}
          <CRow className="mt-3">
            <CCol md={4}>
              <CFormLabel>Unidad de Medida</CFormLabel>
              <CFormSelect
                name="idUnidadMedida"
                value={newProduct.idUnidadMedida}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una unidad de medida</option>
                {unidadesMedida.map((unidad) => (
                  <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                    {unidad.nombreUnidad} ({unidad.abreviatura})
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Categoría</CFormLabel>
              <CFormSelect
                name="idCategoria"
                value={newProduct.idCategoria}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Subcategoría</CFormLabel>
              <CFormSelect
                name="idSubcategoria"
                value={newProduct.idSubcategoria}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una subcategoría</option>
                {filteredSubcategorias.map((subcategoria) => (
                  <option key={subcategoria.idSubcategoria} value={subcategoria.idSubcategoria}>
                    {subcategoria.nombre}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Séptima fila: Imagen */}
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel>Imagen</CFormLabel>
              <CFormInput
                type="file"
                name="imagen"
                onChange={(e) => handleFileChange(e)}
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CrearProducto;