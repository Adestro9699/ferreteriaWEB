<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> a11dc689cf1b3a637eca9adc4d1bf0ddec54f878
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

const DetalleVenta = () => {
  // Array vacío para los productos vendidos
  const productosVendidos = [];

  // Función para manejar el clic en "Añadir Producto"
  const handleAñadirProducto = () => {
    // Aquí puedes agregar la lógica para añadir un producto
    console.log('Añadir Producto');
  };

  return (
    <CCard>
      <CCardBody>
        {/* Tabla de detalle de la venta */}
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
            {productosVendidos.map((producto) => (
              <CTableRow key={producto.item}>
                <CTableDataCell>{producto.item}</CTableDataCell>
                <CTableDataCell>
                  {/* Campo vacío para mostrar el producto seleccionado */}
                  <CFormInput
                    type="text"
                    placeholder="Producto seleccionado"
                    size="sm"
                    value={producto.producto || ''}
                    readOnly
                  />
                </CTableDataCell>
                <CTableDataCell className="text-end">
                  ${producto.precio.toFixed(2)}
                  {/* Campo reducido debajo de Precio */}
                  <CFormInput
                    type="text"
                    placeholder="Precio"
                    size="sm"
                    className="mt-1 text-end"
                  />
                </CTableDataCell>
                <CTableDataCell className="text-end">{producto.unidadMedida}</CTableDataCell>
                <CTableDataCell className="text-end">{producto.cantidad}</CTableDataCell>
                <CTableDataCell className="text-end">${producto.descuento.toFixed(2)}</CTableDataCell>
                <CTableDataCell className="text-end">${producto.subtotal.toFixed(2)}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Botón "Añadir Producto" */}
        <div className="d-flex justify-content-end mt-3">
          <CButton color="primary" onClick={handleAñadirProducto}>
            Añadir Producto
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default DetalleVenta;