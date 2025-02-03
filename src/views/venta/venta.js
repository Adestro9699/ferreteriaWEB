import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButton,
} from '@coreui/react';
import ModalProductos from './modalProductos'; // Importamos el modal

const DetalleVenta = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productosVendidos, setProductosVendidos] = useState([]);

  // Función para abrir el modal
  const handleAñadirProducto = () => {
    setModalVisible(true);
  };

  // Función para recibir los productos seleccionados desde el modal
  const handleProductosSeleccionados = (productosSeleccionados) => {
    setProductosVendidos(productosSeleccionados);
    setModalVisible(false);
  };

  return (
    <>
      {/* Modal para seleccionar productos */}
      <ModalProductos
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleProductosSeleccionados={handleProductosSeleccionados}
      />

      {/* Tabla de productos seleccionados */}
      <CCard>
        <CCardBody>
          {/* Botón para abrir el modal */}
          <div className="d-flex justify-content-center mb-3">
            <CButton color="primary" onClick={handleAñadirProducto}>
              Añadir Producto
            </CButton>
          </div>

          {/* Tabla de productos seleccionados */}
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Item</CTableHeaderCell>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Precio</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Unidad de Medida</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Cantidad</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Descuento</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {productosVendidos.map((producto, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="Producto seleccionado"
                      size="sm"
                      value={producto.nombre}
                      readOnly
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">${producto.precio.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{producto.unidadMedida}</CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="number"
                      placeholder="Cantidad"
                      size="sm"
                      value={producto.cantidad || 1}
                      readOnly
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="number"
                      placeholder="Descuento"
                      size="sm"
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="text"
                      placeholder="Subtotal"
                      size="sm"
                      value={(producto.precio * (producto.cantidad || 1)).toFixed(2)}
                      readOnly
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default DetalleVenta;