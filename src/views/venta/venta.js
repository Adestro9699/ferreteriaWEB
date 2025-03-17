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
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import ModalProductos from './modalProducto'; // Importamos el modal
import CompletarVenta from './completarVenta'; // Importamos el modal
import apiClient from '../../services/apiClient'; // Importamos el cliente de API

const DetalleVenta = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [completarVentaModalVisible, setCompletarVentaModalVisible] = useState(false);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [datosComplementarios, setDatosComplementarios] = useState({
    tipoPagoId: null, // Cambiar a tipoPagoId
    empresaId: null, // Cambiar a empresaId
    clienteId: null, // Cambiar a clienteId
    tipoComprobanteId: null, // Cambiar a tipoComprobanteId
    trabajadorId: null, // Cambiar a trabajadorId
    fecha: new Date().toISOString().slice(0, 19), // Fecha en formato LocalDateTime
  });
  const [reiniciarModalProductos, setReiniciarModalProductos] = useState(null);
  const [reiniciarModalDatosComplementarios, setReiniciarModalDatosComplementarios] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', color: 'danger' });

  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  // Esta función se pasará al componente modalProducto
  const registrarReinicioModalProductos = (reiniciarFn) => {
    setReiniciarModalProductos(() => reiniciarFn);
  };

  // Esta función se pasará al componente completarVenta
  const registrarReinicioModalDatosComplementarios = (reiniciarFn) => {
    setReiniciarModalDatosComplementarios(() => reiniciarFn);
  };
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
      showToast('La cantidad debe ser un número positivo.', 'danger');
      return;
    }

    const producto = productosVendidos[index];
    const stockDisponible = producto.stock;

    if (nuevaCantidad > stockDisponible) {
      showToast('La cantidad no puede exceder el stock disponible', 'danger');
      return;
    }

    setProductosVendidos((prevProductos) => {
      const nuevosProductos = [...prevProductos];
      nuevosProductos[index].cantidad = nuevaCantidad;

      // Calcular el subtotal con el descuento como porcentaje
      const precioConDescuento = nuevosProductos[index].precio * (1 - (nuevosProductos[index].descuento || 0) / 100);
      nuevosProductos[index].subtotal = (
        precioConDescuento * nuevaCantidad
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
    if (isNaN(nuevoDescuento) || nuevoDescuento < 0 || nuevoDescuento > 100) {
      showToast('El descuento debe ser un porcentaje válido entre 0 y 100.', 'danger');
      return;
    }

    setProductosVendidos((prevProductos) => {
      const nuevosProductos = [...prevProductos];
      nuevosProductos[index].descuento = nuevoDescuento;

      // Calcular el subtotal con el descuento como porcentaje
      const precioConDescuento = nuevosProductos[index].precio * (1 - nuevoDescuento / 100);
      nuevosProductos[index].subtotal = (
        precioConDescuento * (nuevosProductos[index].cantidad || 1)
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
    // Validar que se hayan agregado productos
    if (productosVendidos.length === 0) {
      showToast('Debes agregar al menos un producto para guardar la venta.', 'danger');
      return;
    }

    // Validar que las cantidades de los productos sean válidas
    const productosInvalidos = productosVendidos.some(
      (producto) => !producto.cantidad || isNaN(producto.cantidad) || producto.cantidad <= 0
    );

    if (productosInvalidos) {
      showToast('Por favor, ingresa una cantidad válida para todos los productos.', 'danger');
      return;
    }

    // Validar que los datos complementarios estén completos
    const datosComplementariosIncompletos = !datosComplementarios.tipoPagoId || 
                                            !datosComplementarios.empresaId || 
                                            !datosComplementarios.clienteId || 
                                            !datosComplementarios.tipoComprobanteId || 
                                            !datosComplementarios.trabajadorId;

    if (datosComplementariosIncompletos) {
      showToast('Falta agregar Datos Venta. Por favor, completa todos los campos requeridos.', 'danger');
      return;
    }

    // Preparar los datos para enviar al backend
    const ventaData = {
      fechaVenta: datosComplementarios.fecha,
      idTipoPago: datosComplementarios.tipoPagoId,
      idEmpresa: datosComplementarios.empresaId,
      idCliente: datosComplementarios.clienteId,
      idTipoComprobantePago: datosComplementarios.tipoComprobanteId,
      idTrabajador: datosComplementarios.trabajadorId,
      detalles: productosVendidos.map((producto) => ({
        idProducto: producto.idProducto,
        cantidad: producto.cantidad,
        precioUnitario: producto.precio,
        descuento: producto.descuento || 0,
      })),
    };

    // Imprimir los datos que se enviarán al backend
    console.log('Datos enviados al backend:', JSON.stringify(ventaData, null, 2));

    try {
      // Enviar la venta al backend
      const response = await apiClient.post('/fs/ventas', ventaData);
      console.log('Venta guardada:', response.data);
      showToast('Venta guardada correctamente.', 'success');

      // Limpiar el estado después de guardar
      setProductosVendidos([]);
      setDatosComplementarios({
        tipoPagoId: null,
        empresaId: null,
        clienteId: null,
        tipoComprobanteId: null,
        trabajadorId: null,
        fecha: new Date().toISOString().slice(0, 19),
      });

      // Reiniciar los estados de los modales
      reiniciarModalProductos();
      reiniciarModalDatosComplementarios();
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      showToast('Error al guardar la venta. Inténtalo de nuevo.', 'danger');
    }
  };

  // Función para abrir el modal de completar venta
  const handleCompletarVenta = () => {
    setCompletarVentaModalVisible(true);
  };

  // Calcular el subtotal total de todos los productos
  const subtotalTotal = productosVendidos.reduce((total, producto) => {
    // Calcular el subtotal de cada producto
    const subtotalProducto = producto.precio * (1 - (producto.descuento || 0) / 100) * (producto.cantidad || 1);

    // Sumar al total
    return total + subtotalProducto;
  }, 0).toFixed(2); // Formatear con 2 decimales

  // Calcular el total general
const totalGeneral = productosVendidos.reduce((total, producto) => {
  // Aplicar el descuento como porcentaje al precio
  const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100);

  // Calcular el subtotal del producto (precio con descuento * cantidad)
  const subtotalProducto = precioConDescuento * (producto.cantidad || 1);

  // Sumar al total general
  return total + subtotalProducto;
}, 0).toFixed(2); // Formatear con 2 decimales

  const tasaIGV = 0.18;
  // Calcular el subtotal sin IGV
  const subtotalSinIGV = productosVendidos.reduce(
    (total, producto) => {
      // Aplicar el descuento al precio
      const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100);
      // Calcular el subtotal para este producto
      const subtotalProducto = precioConDescuento * (producto.cantidad || 1);
      // Sumar al total
      return total + subtotalProducto;
    },
    0
  );

  // Calcular el subtotal sin IGV dividiendo por (1 + tasaIGV)
  const subtotalSinIGVFinal = (subtotalTotal / (1 + tasaIGV)).toFixed(2);

  // Calcular el IGV aplicado (18% del subtotal sin IGV)
  const igvAplicado = (subtotalTotal - subtotalSinIGVFinal).toFixed(2);

  return (
    <>
      {/* Modal para seleccionar productos */}
      <ModalProductos
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleProductosSeleccionados={handleProductosSeleccionados}
        registrarReinicio={registrarReinicioModalProductos} // Pasar la función de reinicio
      />

      {/* Modal para completar venta */}
      <CompletarVenta
        visible={completarVentaModalVisible}
        onClose={() => setCompletarVentaModalVisible(false)}
        onSave={handleGuardarDatosComplementarios}
        registrarReinicio={registrarReinicioModalDatosComplementarios} // Pasar la función de reinicio
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
                Datos Venta
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
                <CTableHeaderCell className="text-end">Descuento %</CTableHeaderCell>
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
                        (producto.precio * (1 - (producto.descuento || 0) / 100)) *
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
              {/* Fila para el subtotal sin IGV */}
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-end">
                  <strong>Subtotal sin IGV:</strong>
                </CTableDataCell>
                <CTableDataCell className="text-end d-flex align-items-center">
                  <span style={{ marginRight: '5px' }}>S/</span>
                  <CFormInput
                    type="text"
                    size="sm"
                    value={subtotalSinIGVFinal}
                    readOnly
                    style={{ width: '100px', textAlign: 'right' }}
                  />
                </CTableDataCell>
                {/* Fila para el IGV aplicado */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-end">
                  <strong>IGV aplicado:</strong>
                </CTableDataCell>
                <CTableDataCell className="text-end d-flex align-items-center">
                  <span style={{ marginRight: '5px' }}>S/</span>
                  <CFormInput
                    type="text"
                    size="sm"
                    value={igvAplicado}
                    readOnly
                    style={{ width: '100px', textAlign: 'right' }}
                  />
                </CTableDataCell>
              </CTableRow>
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
      <CToaster placement="top-center">
        {toast.visible && (
          <CToast autohide={true} visible={toast.visible} color={toast.color}>            <CToastHeader closeButton>
            <strong className="me-auto">Aviso</strong>
          </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </>
  );
};

export default DetalleVenta;