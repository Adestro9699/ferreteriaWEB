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
} from '@coreui/react';
import apiClient from '../../services/apiClient'; // Importa tu apiClient

//COMPONENTE PARA ACTUALIZAR UN PRODUCTO

const ProductoModal = ({
  show,
  onClose,
  currentProduct,
  setCurrentProduct,
  handleSaveChanges,
  categorias = [], // Valor por defecto
  proveedores = [], // Valor por defecto
  subcategorias = [], // Valor por defecto
  unidadesMedida = [], // Valor por defecto
}) => {
  const [filteredSubcategorias, setFilteredSubcategorias] = useState([]);
  const [newImage, setNewImage] = useState(null); // Estado para la nueva imagen
  

  // Efecto para filtrar las subcategorías cuando cambia la categoría seleccionada
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

  // Función para manejar cambios en la categoría
  const handleCategoriaChange = (e) => {
    const idCategoria = e.target.value;
    setCurrentProduct({
      ...currentProduct,
      subcategoria: {
        ...currentProduct.subcategoria,
        categoria: {
          ...currentProduct.subcategoria.categoria,
          idCategoria: Number(idCategoria), // Convertir a número
        },
        idSubcategoria: '', // Reiniciar la subcategoría al cambiar la categoría
      },
    });
  };

  // Función para manejar la selección de archivos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Subiendo nueva imagen...');
        const response = await apiClient.post('/productos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          console.log('Imagen subida correctamente:', response.data);
          setNewImage(response.data); // Guardar la URL de la nueva imagen
        } else {
          console.error('Error al subir la imagen:', response.statusText);
          alert('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir la imagen');
      }
    }
  };

  // Función para manejar la eliminación de la imagen anterior
  const handleDeleteOldImage = async () => {
    if (currentProduct.imagenURL) {
      try {
        const fileName = currentProduct.imagenURL.split(/[\\/]/).pop();
        console.log('Eliminando imagen anterior:', fileName);
        const response = await apiClient.delete(`/productos/imagen/${fileName}`);
        console.log('Respuesta del servidor:', response.data);
        setCurrentProduct({ ...currentProduct, imagenURL: '' }); // Limpiar la URL de la imagen anterior
      } catch (error) {
        console.error('Error al eliminar la imagen anterior:', error);
      }
    }
  };

  // Función para guardar los cambios, incluyendo la nueva imagen
  const handleSave = async () => {
    console.log('Iniciando proceso de guardado...');
    
    // Si hay una nueva imagen, eliminar la anterior y actualizar la URL
    if (newImage) {
      console.log('Nueva imagen detectada:', newImage);
      await handleDeleteOldImage(); // Eliminar la imagen anterior si existe
      
      // Crear un nuevo objeto con la URL de la nueva imagen
      const updatedProduct = { ...currentProduct, imagenURL: newImage };
      setCurrentProduct(updatedProduct); // Actualizar el estado local
      console.log('Imagen anterior eliminada. Actualizando estado con nueva imagen...');
      
      // Llamar a handleSaveChanges con el objeto actualizado
      handleSaveChanges(updatedProduct);
    } else {
      // Si no hay una nueva imagen, simplemente guardar los cambios actuales
      handleSaveChanges(currentProduct);
    }
  };

  return (
    <CModal visible={show} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Editar Producto</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {currentProduct && (
          <CForm>
            {/* Primera fila: Nombre y Descripción */}
            <CRow>
              <CCol md={6}>
                <CFormLabel>Nombre</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.nombreProducto}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, nombreProducto: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Descripción</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.descripcion}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, descripcion: e.target.value })
                  }
                />
              </CCol>
            </CRow>

            {/* Segunda fila: Precio y Stock */}
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Precio</CFormLabel>
                <CFormInput
                  type="number"
                  value={currentProduct.precio}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, precio: parseFloat(e.target.value) })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Stock</CFormLabel>
                <CFormInput
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })
                  }
                />
              </CCol>
            </CRow>

            {/* Tercera fila: Marca y Material */}
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Marca</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.marca}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, marca: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Material</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.material}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, material: e.target.value })
                  }
                />
              </CCol>
            </CRow>

            {/* Cuarta fila: Código de Barras y SKU */}
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Código de Barras</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.codigoBarra}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, codigoBarra: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>SKU</CFormLabel>
                <CFormInput
                  type="text"
                  value={currentProduct.codigoSKU}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, codigoSKU: e.target.value })
                  }
                />
              </CCol>
            </CRow>

            {/* Quinta fila: Estado y Proveedor */}
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Estado</CFormLabel>
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
              </CCol>
              <CCol md={6}>
                <CFormLabel>Proveedor</CFormLabel>
                <CFormSelect
                  value={String(currentProduct.proveedor?.idProveedor || '')} // Convertir a cadena
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      proveedor: {
                        ...currentProduct.proveedor,
                        idProveedor: Number(e.target.value), // Convertir a número
                      },
                    })
                  }
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.idProveedor} value={String(proveedor.idProveedor)}> {/* Convertir a cadena */}
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
                  value={String(currentProduct.unidadMedida?.idUnidadMedida || '')} // Convertir a cadena
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      unidadMedida: {
                        ...currentProduct.unidadMedida,
                        idUnidadMedida: Number(e.target.value), // Convertir a número
                      },
                    })
                  }
                >
                  <option value="">Seleccione unidad</option>
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad.idUnidadMedida} value={String(unidad.idUnidadMedida)}> {/* Convertir a cadena */}
                      {unidad.nombreUnidad} ({unidad.abreviatura})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormLabel>Categoría</CFormLabel>
                <CFormSelect
                  value={String(currentProduct.subcategoria?.categoria?.idCategoria || '')} // Convertir a cadena
                  onChange={handleCategoriaChange}
                >
                  <option value="">Seleccione categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idCategoria} value={String(categoria.idCategoria)}> {/* Convertir a cadena */}
                      {categoria.nombre}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormLabel>Subcategoría</CFormLabel>
                <CFormSelect
                  value={String(currentProduct.subcategoria?.idSubcategoria || '')} // Convertir a cadena
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      subcategoria: {
                        ...currentProduct.subcategoria,
                        idSubcategoria: Number(e.target.value), // Convertir a número
                      },
                    })
                  }
                >
                  <option value="">Seleccione subcategoría</option>
                  {filteredSubcategorias.map((subcategoria) => (
                    <option key={subcategoria.idSubcategoria} value={String(subcategoria.idSubcategoria)}> {/* Convertir a cadena */}
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
                  onChange={(e) => handleFileChange(e)}
                />
              </CCol>
            </CRow>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          Guardar Cambios
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProductoModal;