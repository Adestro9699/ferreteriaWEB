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
  CInputGroup,
  CInputGroupText,
  CFormText,
  CAlert,
  CSpinner,
  CImage,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilDescription,
  cilDollar,
  cilPuzzle,
  cilBrowser,
  cilImage,
  cilSave,
  cilX
} from '@coreui/icons';
import apiClient from '../../services/apiClient';

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

  const [imagenURL, setImagenURL] = useState('');
  const [filteredSubcategorias, setFilteredSubcategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.nombreProducto) newErrors.nombreProducto = 'El nombre es obligatorio';
    if (!newProduct.descripcion) newErrors.descripcion = 'La descripción es obligatoria';
    if (!newProduct.precio) newErrors.precio = 'El precio es obligatorio';
    if (newProduct.precio && parseFloat(newProduct.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!newProduct.stock) newErrors.stock = 'El stock es obligatorio';
    if (newProduct.stock && parseInt(newProduct.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!newProduct.idCategoria) newErrors.idCategoria = 'La categoría es obligatoria';
    if (!newProduct.idProveedor) newErrors.idProveedor = 'El proveedor es obligatorio';
    if (!newProduct.idSubcategoria) newErrors.idSubcategoria = 'La subcategoría es obligatoria';
    if (!newProduct.idUnidadMedida) newErrors.idUnidadMedida = 'La unidad de medida es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, imagen: 'El archivo debe ser una imagen' });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, imagen: 'La imagen no debe superar los 5MB' });
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        setLoading(true);
        const response = await apiClient.post('/productos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          setImagenURL(response.data);
          setErrors({ ...errors, imagen: null });
        } else {
          setErrors({ ...errors, imagen: 'Error al subir la imagen' });
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ ...errors, imagen: 'Error al subir la imagen' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productWithDate = {
        ...newProduct,
        imagenURL: imagenURL,
        categoria: { idCategoria: Number(newProduct.idCategoria) },
        proveedor: { idProveedor: Number(newProduct.idProveedor) },
        subcategoria: { idSubcategoria: Number(newProduct.idSubcategoria) },
        unidadMedida: { idUnidadMedida: Number(newProduct.idUnidadMedida) },
        fechaModificacion: new Date().toISOString(),
      };

      const response = await apiClient.post('/productos', productWithDate);

      if (response.status === 201) {
        onSave(response.data);
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrors({ ...errors, general: 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setImagenURL('');
    setPreviewImage(null);
    setErrors({});
  };

  // Función para obtener la URL de imagen del servidor
  const getImageUrl = (path) => {
    if (!path) return null;
    // Extraer solo el nombre del archivo si es una ruta completa
    const justFileName = path.split(/[\\\/]/).pop();
    // Usar la URL relativa al servidor
    return `${apiClient.defaults.baseURL}/productos/imagen/${justFileName}`;
  };

  return (
    <CModal visible={show} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Crear Nuevo Producto</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errors.general && (
          <CAlert color="danger" className="mb-3">
            {errors.general}
          </CAlert>
        )}
        <CForm>
          <CRow>
            <CCol md={8}>
              {/* Primera fila: Nombre y Descripción */}
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Nombre <span className="text-danger">*</span></CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="nombreProducto"
                      value={newProduct.nombreProducto}
                      onChange={handleInputChange}
                      placeholder="Nombre del producto"
                      invalid={!!errors.nombreProducto}
                    />
                  </CInputGroup>
                  {errors.nombreProducto && (
                    <CFormText className="text-danger">{errors.nombreProducto}</CFormText>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Descripción <span className="text-danger">*</span></CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="descripcion"
                      value={newProduct.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción del producto"
                      invalid={!!errors.descripcion}
                    />
                  </CInputGroup>
                  {errors.descripcion && (
                    <CFormText className="text-danger">{errors.descripcion}</CFormText>
                  )}
                </CCol>
              </CRow>

              {/* Segunda fila: Precio y Stock */}
              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Precio <span className="text-danger">*</span></CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilDollar} />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      name="precio"
                      value={newProduct.precio}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      invalid={!!errors.precio}
                    />
                  </CInputGroup>
                  {errors.precio && (
                    <CFormText className="text-danger">{errors.precio}</CFormText>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Stock <span className="text-danger">*</span></CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPuzzle} />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      invalid={!!errors.stock}
                    />
                  </CInputGroup>
                  {errors.stock && (
                    <CFormText className="text-danger">{errors.stock}</CFormText>
                  )}
                </CCol>
              </CRow>

              {/* Tercera fila: Marca y Material */}
              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Marca</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilBrowser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="marca"
                      value={newProduct.marca}
                      onChange={handleInputChange}
                      placeholder="Marca del producto"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Material</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPuzzle} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="material"
                      value={newProduct.material}
                      onChange={handleInputChange}
                      placeholder="Material del producto"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* Cuarta fila: Código de Barras y SKU */}
              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Código de Barras</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="codigoBarra"
                      value={newProduct.codigoBarra}
                      onChange={handleInputChange}
                      placeholder="Código de barras"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>SKU</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilBrowser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="codigoSKU"
                      value={newProduct.codigoSKU}
                      onChange={handleInputChange}
                      placeholder="Código SKU"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* Quinta fila: Categoría y Subcategoría */}
              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Categoría <span className="text-danger">*</span></CFormLabel>
                  <CFormSelect
                    name="idCategoria"
                    value={newProduct.idCategoria}
                    onChange={handleInputChange}
                    invalid={!!errors.idCategoria}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.idCategoria} value={categoria.idCategoria}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.idCategoria && (
                    <CFormText className="text-danger">{errors.idCategoria}</CFormText>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Subcategoría <span className="text-danger">*</span></CFormLabel>
                  <CFormSelect
                    name="idSubcategoria"
                    value={newProduct.idSubcategoria}
                    onChange={handleInputChange}
                    disabled={!newProduct.idCategoria}
                    invalid={!!errors.idSubcategoria}
                  >
                    <option value="">Seleccione una subcategoría</option>
                    {filteredSubcategorias.map((subcategoria) => (
                      <option key={subcategoria.idSubcategoria} value={subcategoria.idSubcategoria}>
                        {subcategoria.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.idSubcategoria && (
                    <CFormText className="text-danger">{errors.idSubcategoria}</CFormText>
                  )}
                </CCol>
              </CRow>

              {/* Sexta fila: Proveedor y Unidad de Medida */}
              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Proveedor <span className="text-danger">*</span></CFormLabel>
                  <CFormSelect
                    name="idProveedor"
                    value={newProduct.idProveedor}
                    onChange={handleInputChange}
                    invalid={!!errors.idProveedor}
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.idProveedor && (
                    <CFormText className="text-danger">{errors.idProveedor}</CFormText>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Unidad de Medida <span className="text-danger">*</span></CFormLabel>
                  <CFormSelect
                    name="idUnidadMedida"
                    value={newProduct.idUnidadMedida}
                    onChange={handleInputChange}
                    invalid={!!errors.idUnidadMedida}
                  >
                    <option value="">Seleccione una unidad</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                        {unidad.nombreUnidad}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.idUnidadMedida && (
                    <CFormText className="text-danger">{errors.idUnidadMedida}</CFormText>
                  )}
                </CCol>
              </CRow>
            </CCol>

            {/* Columna de imagen */}
            <CCol md={4}>
              <div className="d-flex flex-column align-items-center">
                <CFormLabel>Imagen del Producto</CFormLabel>
                <div className="border rounded p-3 mb-3 text-center" style={{ width: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {previewImage ? (
                    <CImage
                      src={previewImage}
                      alt="Preview"
                      className="img-fluid mb-2"
                      style={{ maxHeight: '200px' }}
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                      <CIcon icon={cilImage} size="3xl" className="text-muted mb-2" />
                      <small className="text-muted">No hay imagen seleccionada</small>
                    </div>
                  )}
                </div>
                <CInputGroup>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </CInputGroup>
                {errors.imagen && (
                  <CFormText className="text-danger mt-2">{errors.imagen}</CFormText>
                )}
                <CFormText className="mt-2">
                  Formatos permitidos: JPG, PNG, GIF. Máximo 5MB
                </CFormText>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          <CIcon icon={cilX} className="me-2" />
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            <>
              <CIcon icon={cilSave} className="me-2" />
              Guardar Producto
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CrearProducto;