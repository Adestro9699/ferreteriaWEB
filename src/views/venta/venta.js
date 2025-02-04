import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
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

  const handleCantidadChange = (index, value) => {
    // Si el valor está vacío, actualizar el estado sin validaciones
    if (value === '') {
      setProductosVendidos((prevProductos) => {
        const nuevosProductos = [...prevProductos];
        nuevosProductos[index].cantidad = value; // Guardar como cadena vacía
        nuevosProductos[index].subtotal = ''; // Limpiar el subtotal
        return nuevosProductos;
      });
      return;
    }

    // Si el valor no está vacío, validar que sea un número válido
    const nuevaCantidad = parseFloat(value);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert('La cantidad debe ser un número positivo.');
      return; // Ignorar valores inválidos
    }

    // Obtener el stock del producto correspondiente
    const producto = productosVendidos[index];
    const stockDisponible = producto.stock;

    // Validar que la cantidad no exceda el stock disponible
    if (nuevaCantidad > stockDisponible) {
      alert(`La cantidad no puede exceder el stock disponible`);
      return;
    }

    // Actualizar el estado con la nueva cantidad
    setProductosVendidos((prevProductos) => {
      const nuevosProductos = [...prevProductos];
      nuevosProductos[index].cantidad = nuevaCantidad;

      // Recalcular el subtotal
      nuevosProductos[index].subtotal = (
        nuevosProductos[index].precio * nuevaCantidad
      ).toFixed(2);

      return nuevosProductos;
    });
  };

  // Función para abrir el modal
  const handleAñadirProducto = () => {
    setModalVisible(true);
  };

  // Función para recibir los productos seleccionados desde el modal
  const handleProductosSeleccionados = (productosSeleccionados) => {
    setProductosVendidos((prevProductos) => {
      // Filtrar los productos seleccionados para evitar duplicados
      const nuevosProductos = productosSeleccionados.filter(
        (nuevo) => !prevProductos.some((existente) => existente.idProducto === nuevo.idProducto)
      );
      // Combinar los productos existentes con los nuevos
      return [...prevProductos, ...nuevosProductos];
    });
    // Cerrar el modal
    setModalVisible(false);
  };

  // Función para eliminar un producto de la lista
  const eliminarProducto = (index) => {
    setProductosVendidos((prevProductos) =>
      prevProductos.filter((_, i) => i !== index)
    );
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
          <div className="d-flex justify-content-start mb-3">
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
                <CTableHeaderCell>Unidad de Medida</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Precio S/</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Cantidad</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Descuento</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
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
                      style={{ width: '290px' }} // Ajusta el ancho según tus necesidades
                    />
                  </CTableDataCell>
                  <CTableDataCell>{producto.unidadMedida}</CTableDataCell>
                  <CTableDataCell className="text-end">{producto.precio.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end" style={{ width: '80px', textAlign: 'center' }}>
                    <CFormInput
                      type="number"
                      placeholder="Cantidad"
                      size="sm"
                      value={producto.cantidad} // Sin valor por defecto
                      onChange={(e) => handleCantidadChange(index, e.target.value)}
                      style={{ width: '60px', textAlign: 'right' }}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="number"
                      placeholder="Descuento"
                      size="sm"
                      value={producto.descuento || 0}
                      readOnly
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
                  <CTableDataCell className="text-end">
                    <CButton color="danger" onClick={() => eliminarProducto(index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {/* Fila para el total general */}
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-end">
                  <strong>Total:</strong>
                </CTableDataCell>
                <CTableDataCell className="text-end d-flex align-items-center">
                  <span style={{ marginRight: '5px' }}>S/</span>
                  <CFormInput
                    type="text"
                    size="sm"
                    value={
                      productosVendidos
                        .reduce(
                          (total, p) => total + ((p.precio - (p.descuento || 0)) * (p.cantidad || 1)),
                          0
                        )
                        .toFixed(2)
                    }
                    readOnly
                    style={{ width: '100px', textAlign: 'right' }}
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default DetalleVenta;