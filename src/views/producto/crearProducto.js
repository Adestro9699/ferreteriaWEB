import React, { useState } from 'react';
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
} from '@coreui/react';

const CrearProducto = ({ show, onClose, onSave, categorias, proveedores, subcategorias }) => {
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
    idCategoria: '', // Cambiado de id_categoria a idCategoria
    idProveedor: '', // Cambiado de id_proveedor a idProveedor
    idSubcategoria: '', // Cambiado de id_subcategoria a idSubcategoria
    fechaModificacion: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSave = () => {
    // Validar que los IDs no sean 0
    if (
      Number(newProduct.idCategoria) === 0 ||
      Number(newProduct.idProveedor) === 0 ||
      Number(newProduct.idSubcategoria) === 0
    ) {
      alert("Por favor, seleccione una categoría, proveedor y subcategoría válidos.");
      return;
    }
  
    // Construir el objeto con los objetos completos
    const productWithDate = {
      ...newProduct,
      categoria: { idCategoria: Number(newProduct.idCategoria) }, // Enviar objeto completo
      proveedor: { idProveedor: Number(newProduct.idProveedor) }, // Enviar objeto completo
      subcategoria: { idSubcategoria: Number(newProduct.idSubcategoria) }, // Enviar objeto completo
      fechaModificacion: new Date().toISOString(), // Fecha actual en formato ISO
    };
  
    // Enviar el nuevo producto al componente padre
    onSave(productWithDate);
  
    // Cerrar el modal
    onClose();
  
    // Limpiar el estado después de guardar
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
      idCategoria: '', // Cambiado de id_categoria a idCategoria
      idProveedor: '', // Cambiado de id_proveedor a idProveedor
      idSubcategoria: '', // Cambiado de id_subcategoria a idSubcategoria
      fechaModificacion: '',
    });
  };

  return (
    <CModal visible={show} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Crear Nuevo Producto</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            type="text"
            name="nombreProducto"
            value={newProduct.nombreProducto}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
          />

          <CFormLabel className="mt-3">Descripción</CFormLabel>
          <CFormInput
            type="text"
            name="descripcion"
            value={newProduct.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción del producto"
          />

          <CFormLabel className="mt-3">Precio</CFormLabel>
          <CFormInput
            type="number"
            name="precio"
            value={newProduct.precio}
            onChange={handleInputChange}
            placeholder="Precio del producto"
          />

          <CFormLabel className="mt-3">Stock</CFormLabel>
          <CFormInput
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock disponible"
          />

          <CFormLabel className="mt-3">Marca</CFormLabel>
          <CFormInput
            type="text"
            name="marca"
            value={newProduct.marca}
            onChange={handleInputChange}
            placeholder="Marca del producto"
          />

          <CFormLabel className="mt-3">Material</CFormLabel>
          <CFormInput
            type="text"
            name="material"
            value={newProduct.material}
            onChange={handleInputChange}
            placeholder="Material del producto"
          />

          <CFormLabel className="mt-3">Código de Barras</CFormLabel>
          <CFormInput
            type="text"
            name="codigoBarra"
            value={newProduct.codigoBarra}
            onChange={handleInputChange}
            placeholder="Código de barras"
          />

          <CFormLabel className="mt-3">SKU</CFormLabel>
          <CFormInput
            type="text"
            name="codigoSKU"
            value={newProduct.codigoSKU}
            onChange={handleInputChange}
            placeholder="Código SKU"
          />

          <CFormLabel className="mt-3">Estado</CFormLabel>
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

          {/* Campos para categoría, proveedor y subcategoría */}
          <CFormLabel className="mt-3">Categoría</CFormLabel>
          <CFormSelect
            name="idCategoria" // Cambiado de id_categoria a idCategoria
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

          <CFormLabel className="mt-3">Proveedor</CFormLabel>
          <CFormSelect
            name="idProveedor" // Cambiado de id_proveedor a idProveedor
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

          <CFormLabel className="mt-3">Subcategoría</CFormLabel>
          <CFormSelect
            name="idSubcategoria" // Cambiado de id_subcategoria a idSubcategoria
            value={newProduct.idSubcategoria}
            onChange={handleInputChange}
          >
            <option value="">Seleccione una subcategoría</option>
            {subcategorias.map((subcategoria) => (
              <option key={subcategoria.idSubcategoria} value={subcategoria.idSubcategoria}>
                {subcategoria.nombre}
              </option>
            ))}
          </CFormSelect>
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
