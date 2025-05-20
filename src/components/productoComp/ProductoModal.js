import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormText,
  CAlert,
  CSpinner,
  CImage,
  CBadge,
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
  cilX,
  cilTrash,
  cilPencil
} from '@coreui/icons';
import apiClient from '../../services/apiClient';

//COMPONENTE PARA ACTUALIZAR UN PRODUCTO

const ProductoModal = ({
  show,
  onClose,
  currentProduct,
  setCurrentProduct,
  handleSaveChanges,
  categorias = [],
  proveedores = [],
  subcategorias = [],
  unidadesMedida = [],
}) => {
  const [filteredSubcategorias, setFilteredSubcategorias] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (currentProduct?.subcategoria?.categoria?.idCategoria) {
      const subcategoriasFiltradas = subcategorias.filter(
        (subcategoria) => subcategoria.categoria.idCategoria === currentProduct.subcategoria.categoria.idCategoria
      );
      setFilteredSubcategorias(subcategoriasFiltradas);
    } else {
      setFilteredSubcategorias([]);
    }
  }, [currentProduct?.subcategoria?.categoria?.idCategoria, subcategorias]);

  useEffect(() => {
    const loadImage = async () => {
      if (currentProduct?.imagenURL) {
        const url = await getImageUrl(currentProduct.imagenURL);
        setImageUrl(url);
      }
    };
    loadImage();

    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [currentProduct?.imagenURL]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!currentProduct.nombreProducto) newErrors.nombreProducto = 'El nombre es obligatorio';
    if (!currentProduct.descripcion) newErrors.descripcion = 'La descripción es obligatoria';
    if (!currentProduct.precio) newErrors.precio = 'El precio es obligatorio';
    if (currentProduct.precio && parseFloat(currentProduct.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!currentProduct.stock) newErrors.stock = 'El stock es obligatorio';
    if (currentProduct.stock && parseInt(currentProduct.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!currentProduct.subcategoria?.categoria?.idCategoria) newErrors.idCategoria = 'La categoría es obligatoria';
    if (!currentProduct.proveedor?.idProveedor) newErrors.idProveedor = 'El proveedor es obligatorio';
    if (!currentProduct.subcategoria?.idSubcategoria) newErrors.idSubcategoria = 'La subcategoría es obligatoria';
    if (!currentProduct.unidadMedida?.idUnidadMedida) newErrors.idUnidadMedida = 'La unidad de medida es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, imagen: 'El archivo debe ser una imagen' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, imagen: 'La imagen no debe superar los 5MB' });
        return;
      }

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
          setNewImage(response.data);
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

  const handleDeleteOldImage = async () => {
    if (currentProduct.imagenURL) {
      try {
        setLoading(true);
        const fileName = currentProduct.imagenURL.split(/[\\/]/).pop();
        const response = await apiClient.delete(`/productos/imagen/${fileName}`);
        setCurrentProduct({ ...currentProduct, imagenURL: '' });
        setPreviewImage(null);
      } catch (error) {
        console.error('Error al eliminar la imagen anterior:', error);
        setErrors({ ...errors, imagen: 'Error al eliminar la imagen anterior' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (newImage) {
        await handleDeleteOldImage();
        const updatedProduct = { ...currentProduct, imagenURL: newImage };
        handleSaveChanges(updatedProduct);
      } else {
        handleSaveChanges(currentProduct);
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      setErrors({ ...errors, general: 'Error al guardar los cambios' });
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (status) => {
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

  // Función para obtener la URL de imagen del servidor
  const getImageUrl = async (path) => {
    if (!path) return null;
    // Extraer solo el nombre del archivo si es una ruta completa
    const justFileName = path.split(/[\\\/]/).pop();
    if (!justFileName) return null;

    try {
      const response = await apiClient.get(`/productos/imagen/${justFileName}`, {
        responseType: 'blob',
        withCredentials: true
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      return null;
    }
  };

  return (
    <CModal visible={show} onClose={onClose} size="lg" backdrop="static" fullscreen={isMobile}>
      <CModalHeader closeButton className="bg-body-secondary text-body-emphasis">
        <CModalTitle className="fw-bold">Editar Producto</CModalTitle>
      </CModalHeader>
      <CModalBody className="bg-body" style={isMobile ? { minHeight: '100vh', paddingBottom: 0 } : {}}>
        {errors.general && (
          <CAlert color="danger" className="mb-3">
            {errors.general}
          </CAlert>
        )}
        {currentProduct && (
          <CForm>
            <CRow>
              <CCol md={8}>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Nombre <span className="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="nombreProducto"
                        value={currentProduct.nombreProducto}
                        onChange={handleInputChange}
                        invalid={!!errors.nombreProducto}
                      />
                    </CInputGroup>
                    {errors.nombreProducto && (
                      <CFormText className="text-danger">{errors.nombreProducto}</CFormText>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Descripción <span className="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilPencil} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="descripcion"
                        value={currentProduct.descripcion}
                        onChange={handleInputChange}
                        invalid={!!errors.descripcion}
                      />
                    </CInputGroup>
                    {errors.descripcion && (
                      <CFormText className="text-danger">{errors.descripcion}</CFormText>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Precio <span className="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilDollar} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        name="precio"
                        value={currentProduct.precio}
                        onChange={handleInputChange}
                        invalid={!!errors.precio}
                      />
                    </CInputGroup>
                    {errors.precio && (
                      <CFormText className="text-danger">{errors.precio}</CFormText>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Stock <span className="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilPuzzle} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        name="stock"
                        value={currentProduct.stock}
                        onChange={handleInputChange}
                        invalid={!!errors.stock}
                      />
                    </CInputGroup>
                    {errors.stock && (
                      <CFormText className="text-danger">{errors.stock}</CFormText>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Marca</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilBrowser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="marca"
                        value={currentProduct.marca || ''}
                        onChange={handleInputChange}
                        placeholder="Marca del producto"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Material</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilPuzzle} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="material"
                        value={currentProduct.material || ''}
                        onChange={handleInputChange}
                        placeholder="Material del producto"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Código de Barras</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="codigoBarra"
                        value={currentProduct.codigoBarra || ''}
                        onChange={handleInputChange}
                        placeholder="Código de barras"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">SKU</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilBrowser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="codigoSKU"
                        value={currentProduct.codigoSKU || ''}
                        onChange={handleInputChange}
                        placeholder="Código SKU"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Categoría <span className="text-danger">*</span></CFormLabel>
                    <CFormSelect
                      name="idCategoria"
                      value={currentProduct.subcategoria?.categoria?.idCategoria || ''}
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
                    <CFormLabel className="text-body-emphasis">Subcategoría <span className="text-danger">*</span></CFormLabel>
                    <CFormSelect
                      name="idSubcategoria"
                      value={currentProduct.subcategoria?.idSubcategoria || ''}
                      onChange={handleInputChange}
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

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel className="text-body-emphasis">Proveedor <span className="text-danger">*</span></CFormLabel>
                    <CFormSelect
                      name="idProveedor"
                      value={currentProduct.proveedor?.idProveedor || ''}
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
                    <CFormLabel className="text-body-emphasis">Unidad de Medida <span className="text-danger">*</span></CFormLabel>
                    <CFormSelect
                      name="idUnidadMedida"
                      value={currentProduct.unidadMedida?.idUnidadMedida || ''}
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

              <CCol md={4}>
                <CFormLabel className="text-body-emphasis">Imagen del Producto</CFormLabel>
                <div className="mb-3">
                  {previewImage || imageUrl ? (
                    <div className="position-relative">
                      <CImage
                        src={previewImage || imageUrl}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px' }}
                      />
                      <CButton
                        color="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={handleDeleteOldImage}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  ) : (
                    <div className="border rounded p-3 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                      <CIcon icon={cilImage} size="xl" className="mb-2" />
                      <p className="mt-2 mb-0">No hay imagen seleccionada</p>
                    </div>
                  )}
                </div>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {errors.imagen && (
                  <CFormText className="text-danger">{errors.imagen}</CFormText>
                )}
              </CCol>
            </CRow>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter className="bg-body-secondary">
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          <CIcon icon={cilX} className="me-2" />
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilSave} className="me-2" />}
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProductoModal;