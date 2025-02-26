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
import ModalProductos from './modalProducto'; // Importamos el modal
import CompletarVenta from './completarVenta'; // Importamos el modal

const DetalleVenta = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [completarVentaModalVisible, setCompletarVentaModalVisible] = useState(false);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [datosComplementarios, setDatosComplementarios] = useState({
    tipoPago: '',
    empresa: '',
    cliente: '',
    tipoComprobante: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha actual fija
  });

  // Función para manejar cambios en la cantidad
  const handleCantidadChange = (index, value) => {
    if (value === '') {
      setProductosVendidos((prevProductos) => {
        const nuevosProductos = [...prevProductos];
        nuevosProductos[index].cantidad = value;
        nuevosProductos[index].subtotal = '';
        return nuevosProductos;
      });
      return;
    }

    const nuevaCantidad = parseFloat(value);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert('La cantidad debe ser un número positivo.');
      return;
    }

    const producto = productosVendidos[index];
    const stockDisponible = producto.stock;

    if (nuevaCantidad > stockDisponible) {
      alert(`La cantidad no puede exceder el stock disponible`);
      return;
    }

    setProductosVendidos((prevProductos) => {
      const nuevosProductos = [...prevProductos];
      nuevosProductos[index].cantidad = nuevaCantidad;
      nuevosProductos[index].subtotal = (
        (nuevosProductos[index].precio - (nuevosProductos[index].descuento || 0)) *
        nuevaCantidad
      ).toFixed(2);
      return nuevosProductos;
    });
  };

  // Función para manejar cambios en el descuento
  const handleDescuentoChange = (index, value) => {
    if (value === '') {
      setProductosVendidos((prevProductos) => {
        const nuevosProductos = [...prevProductos];
        nuevosProductos[index].descuento = 0; // Establecer descuento en 0 si el campo está vacío
        nuevosProductos[index].subtotal = (
          nuevosProductos[index].precio * (nuevosProductos[index].cantidad || 1)
        ).toFixed(2);
        return nuevosProductos;
      });
      return;
    }

    const nuevoDescuento = parseFloat(value);
    if (isNaN(nuevoDescuento) || nuevoDescuento < 0) {
      alert('El descuento debe ser un número positivo.');
      return;
    }

    setProductosVendidos((prevProductos) => {
      const nuevosProductos = [...prevProductos];
      nuevosProductos[index].descuento = nuevoDescuento;
      nuevosProductos[index].subtotal = (
        (nuevosProductos[index].precio - nuevoDescuento) *
        (nuevosProductos[index].cantidad || 1)
      ).toFixed(2);
      return nuevosProductos;
    });
  };

  // Función para abrir el modal de productos
  const handleAñadirProducto = () => {
    setModalVisible(true);
  };

  // Función para recibir los productos seleccionados desde el modal
  const handleProductosSeleccionados = (productosSeleccionados) => {
    setProductosVendidos((prevProductos) => {
      const nuevosProductos = productosSeleccionados.filter(
        (nuevo) => !prevProductos.some((existente) => existente.idProducto === nuevo.idProducto)
      );
      return [...prevProductos, ...nuevosProductos];
    });
    setModalVisible(false);
  };

  // Función para eliminar un producto de la lista
  const eliminarProducto = (index) => {
    setProductosVendidos((prevProductos) =>
      prevProductos.filter((_, i) => i !== index)
    );
  };

  // Función para guardar los datos complementarios desde el modal
  const handleGuardarDatosComplementarios = (datos) => {
    setDatosComplementarios(datos);
  };

  // Función para guardar la venta completa en el backend
  const handleGuardarVenta = async () => {
    if (productosVendidos.length === 0) {
      alert('Debes agregar al menos un producto para guardar la venta.');
      return;
    }

    const productosInvalidos = productosVendidos.some(
      (producto) => !producto.cantidad || isNaN(producto.cantidad) || producto.cantidad <= 0
    );

    if (productosInvalidos) {
      alert('Por favor, ingresa una cantidad válida para todos los productos.');
      return;
    }

    // Preparar los datos para enviar al backend
    const ventaData = {
      productos: productosVendidos.map((producto) => ({
        idProducto: producto.idProducto,
        cantidad: producto.cantidad,
        descuento: producto.descuento || 0, // Enviar el descuento (0 si no se ingresó)
      })),
      ...datosComplementarios, // Incluir los datos complementarios
    };

    try {
      // Enviar la venta al backend
      const response = await apiClient.post('/fs/ventas', ventaData);
      console.log('Venta guardada:', response.data);
      alert('Venta guardada correctamente.');
      setProductosVendidos([]); // Limpiar la lista de productos vendidos
      setDatosComplementarios({ // Reiniciar los datos complementarios
        tipoPago: '',
        empresa: '',
        cliente: '',
        tipoComprobante: '',
        fecha: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      alert('Error al guardar la venta. Inténtalo de nuevo.');
    }
  };

  // Función para abrir el modal de completar venta
  const handleCompletarVenta = () => {
    setCompletarVentaModalVisible(true);
  };

  // Calcular el total general
  const totalGeneral = productosVendidos.reduce(
    (total, producto) =>
      total + ((producto.precio - (producto.descuento || 0)) * (producto.cantidad || 1)),
    0
  ).toFixed(2);

  return (
    <>
      {/* Modal para seleccionar productos */}
      <ModalProductos
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleProductosSeleccionados={handleProductosSeleccionados}
      />

      {/* Modal para completar venta */}
      <CompletarVenta
        visible={completarVentaModalVisible}
        onClose={() => setCompletarVentaModalVisible(false)}
        onSave={handleGuardarDatosComplementarios}
      />

      {/* Tabla de productos seleccionados */}
      <CCard>
        <CCardBody>
          {/* Botones para añadir producto, completar venta y guardar venta */}
          <div className="d-flex justify-content-between mb-3">
            <div>
              <CButton color="primary" onClick={handleAñadirProducto} className="me-2">
                Añadir Producto
              </CButton>
              <CButton color="warning" onClick={handleCompletarVenta}>
                Completar Venta
              </CButton>
            </div>
            <CButton color="success" onClick={handleGuardarVenta}>
              Guardar Venta
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
                      style={{ width: '290px' }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{producto.unidadMedida}</CTableDataCell>
                  <CTableDataCell className="text-end">{producto.precio.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end" style={{ width: '80px', textAlign: 'center' }}>
                    <CFormInput
                      type="number"
                      placeholder="Cantidad"
                      size="sm"
                      value={producto.cantidad}
                      onChange={(e) => handleCantidadChange(index, e.target.value)}
                      style={{ width: '60px', textAlign: 'right' }}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="number"
                      placeholder="%"
                      size="sm"
                      value={producto.descuento || ''}
                      onChange={(e) => handleDescuentoChange(index, e.target.value)}
                      style={{ width: '80px', textAlign: 'right' }}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CFormInput
                      type="text"
                      placeholder="Subtotal"
                      size="sm"
                      value={(
                        (producto.precio - (producto.descuento || 0)) *
                        (producto.cantidad || 1)
                      ).toFixed(2)}
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
                    value={totalGeneral}
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