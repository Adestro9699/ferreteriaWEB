import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilSearch, cilSave, cilChevronBottom } from '@coreui/icons';
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
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import ModalProductos from './modalProducto';
import CompletarVenta from './completarVenta';
import apiClient from '../../services/apiClient';
import { useLocation, useNavigate } from 'react-router-dom';

const DetalleVenta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCotizacion, setModoCotizacion] = useState(false);
  const [ventaId, setVentaId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [completarVentaModalVisible, setCompletarVentaModalVisible] = useState(false);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [datosComplementarios, setDatosComplementarios] = useState({
    tipoPagoId: null,
    empresaId: null,
    clienteId: null,
    tipoComprobanteId: null,
    trabajadorId: null,
    fecha: new Date().toISOString().slice(0, 19),
    moneda: 'SOLES'
  });
  const [reiniciarModalProductos, setReiniciarModalProductos] = useState(null);
  const [reiniciarModalDatosComplementarios, setReiniciarModalDatosComplementarios] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', color: 'danger' });
  const [codigoCotizacion, setCodigoCotizacion] = useState('');

  const monedas = {
    SOLES: { nombre: 'Soles', simbolo: 'S/' },
    DOLARES: { nombre: 'Dólares', simbolo: '$' },
    EUROS: { nombre: 'Euros', simbolo: '€' },
    LIBRA_ESTERLINA: { nombre: 'Libras Esterlinas', simbolo: '£' }
  };

  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  const registrarReinicioModalProductos = (reiniciarFn) => {
    setReiniciarModalProductos(() => reiniciarFn);
  };

  const registrarReinicioModalDatosComplementarios = (reiniciarFn) => {
    setReiniciarModalDatosComplementarios(() => reiniciarFn);
  };

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

      const precioConDescuento = nuevosProductos[index].precio * (1 - (nuevosProductos[index].descuento || 0) / 100);
      nuevosProductos[index].subtotal = (
        precioConDescuento * nuevaCantidad
      ).toFixed(2);

      return nuevosProductos;
    });
  };

  const handleDescuentoChange = (index, value) => {
    if (value === '') {
      setProductosVendidos((prevProductos) => {
        const nuevosProductos = [...prevProductos];
        nuevosProductos[index].descuento = 0;
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

      const precioConDescuento = nuevosProductos[index].precio * (1 - nuevoDescuento / 100);
      nuevosProductos[index].subtotal = (
        precioConDescuento * (nuevosProductos[index].cantidad || 1)
      ).toFixed(2);

      return nuevosProductos;
    });
  };

  const handleAñadirProducto = () => {
    setModalVisible(true);
  };

  const handleProductosSeleccionados = (productosSeleccionados) => {
    setProductosVendidos((prevProductos) => {
      const nuevosProductos = productosSeleccionados.filter(
        (nuevo) => !prevProductos.some((existente) => existente.idProducto === nuevo.idProducto)
      );
      return [...prevProductos, ...nuevosProductos];
    });
    setModalVisible(false);
  };

  const eliminarProducto = (index) => {
    setProductosVendidos((prevProductos) =>
      prevProductos.filter((_, i) => i !== index)
    );
  };

  const handleGuardarDatosComplementarios = (datos) => {
    setDatosComplementarios(prev => ({
      ...prev,
      tipoPagoId: datos.tipoPagoId,
      empresaId: datos.empresaId,
      clienteId: datos.clienteId,
      tipoComprobanteId: datos.tipoComprobanteId,
      trabajadorId: datos.trabajadorId,
      fecha: datos.fecha,
      moneda: datos.moneda || 'SOLES',
    }));
  };

  const handleGuardarVenta = async () => {
    if (productosVendidos.length === 0) {
      showToast('Debes agregar al menos un producto para guardar la venta.', 'danger');
      return;
    }

    const productosInvalidos = productosVendidos.some(
      (producto) => !producto.cantidad || isNaN(producto.cantidad) || producto.cantidad <= 0
    );

    if (productosInvalidos) {
      showToast('Por favor, ingresa una cantidad válida para todos los productos.', 'danger');
      return;
    }

    const datosComplementariosIncompletos = !datosComplementarios.tipoPagoId ||
      !datosComplementarios.empresaId ||
      !datosComplementarios.clienteId ||
      !datosComplementarios.tipoComprobanteId ||
      !datosComplementarios.trabajadorId;

    if (datosComplementariosIncompletos) {
      showToast('Falta agregar Datos Venta. Por favor, completa todos los campos requeridos.', 'danger');
      return;
    }

    const productosActuales = [...productosVendidos];
    const datosComplementariosActuales = { ...datosComplementarios };

    const ventaData = {
      fechaVenta: datosComplementarios.fecha,
      idTipoPago: datosComplementarios.tipoPagoId,
      idEmpresa: datosComplementarios.empresaId,
      idCliente: datosComplementarios.clienteId,
      idTipoComprobantePago: datosComplementarios.tipoComprobanteId,
      idTrabajador: datosComplementarios.trabajadorId,
      moneda: datosComplementarios.moneda,
      detalles: productosVendidos.map((producto) => ({
        idProducto: producto.idProducto,
        cantidad: producto.cantidad,
        precioUnitario: producto.precio,
        descuento: producto.descuento || 0,
      })),
    };

    try {
      let response;
      if (modoEdicion) {
        if (modoCotizacion) {
          // Si estamos editando una cotización
          response = await apiClient.put(`/cotizaciones/${ventaId}`, ventaData);
          showToast('Cotización actualizada correctamente.', 'success');
          navigate('/cotizacion');
        } else {
          // Si estamos editando una venta
          const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          };
          response = await apiClient.put(`/ventas/${ventaId}`, ventaData, config);
          showToast('Venta actualizada correctamente.', 'success');
          navigate('/listarVenta');
        }
      } else {
        response = await apiClient.post('/ventas', ventaData);
        showToast('Venta guardada correctamente.', 'success');
      }
      
      setProductosVendidos([]);
      setDatosComplementarios({
        tipoPagoId: null,
        empresaId: null,
        clienteId: null,
        tipoComprobanteId: null,
        trabajadorId: null,
        fecha: new Date().toISOString().slice(0, 19),
        moneda: 'SOLES'
      });

      if (reiniciarModalProductos) reiniciarModalProductos();
      if (reiniciarModalDatosComplementarios) reiniciarModalDatosComplementarios();

    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error al ${modoEdicion ? (modoCotizacion ? 'actualizar la cotización' : 'actualizar la venta') : 'guardar la venta'}: ${errorMessage}`, 'danger');
      
      if (modoEdicion) {
        setProductosVendidos(productosActuales);
        setDatosComplementarios(datosComplementariosActuales);
      }
    }
  };

  const handleCompletarVenta = () => {
    setCompletarVentaModalVisible(true);
  };

  const subtotalTotal = productosVendidos.reduce((total, producto) => {
    const subtotalProducto = producto.precio * (1 - (producto.descuento || 0) / 100) * (producto.cantidad || 1);
    return total + subtotalProducto;
  }, 0).toFixed(2);

  const totalGeneral = productosVendidos.reduce((total, producto) => {
    const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100);
    const subtotalProducto = precioConDescuento * (producto.cantidad || 1);
    return total + subtotalProducto;
  }, 0).toFixed(2);

  const tasaIGV = 0.18;
  const subtotalSinIGV = productosVendidos.reduce(
    (total, producto) => {
      const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100);
      const subtotalProducto = precioConDescuento * (producto.cantidad || 1);
      return total + subtotalProducto;
    },
    0
  );

  const subtotalSinIGVFinal = (subtotalTotal / (1 + tasaIGV)).toFixed(2);
  const igvAplicado = (subtotalTotal - subtotalSinIGVFinal).toFixed(2);

  const getSimboloMoneda = (moneda) => {
    return monedas[moneda]?.simbolo || 'S/';
  };

  useEffect(() => {
    console.log("Estado recibido:", location.state);
    if (location.state?.ventaParaEditar) {
      const venta = location.state.ventaParaEditar;
      console.log("Venta a editar:", venta);

      setModoEdicion(true);
      setVentaId(venta.idVenta);

      if (venta.detalles && Array.isArray(venta.detalles)) {
        const productosTransformados = venta.detalles.map(d => ({
          idProducto: d.idProducto,
          nombre: d.producto?.nombre || 'Producto sin nombre',
          precio: d.precioUnitario || 0,
          cantidad: d.cantidad || 1,
          descuento: d.descuento || 0,
          unidadMedida: d.producto?.unidadMedida?.nombre || 'UND',
          stock: d.producto?.stock || 0
        }));

        setProductosVendidos(productosTransformados);
      } else {
        console.error("La venta no tiene detalles o no están en formato esperado");
      }

      setDatosComplementarios(prev => ({
        ...prev,
        tipoPagoId: venta.idTipoPago || venta.tipoPago?.idTipoPago,
        empresaId: venta.idEmpresa || venta.empresa?.idEmpresa,
        clienteId: venta.idCliente || venta.cliente?.idCliente,
        tipoComprobanteId: venta.idTipoComprobantePago || venta.tipoComprobantePago?.idTipoComprobantePago,
        trabajadorId: venta.idTrabajador || venta.trabajador?.idTrabajador,
        fecha: venta.fechaVenta || new Date().toISOString(),
        moneda: venta.moneda || 'SOLES'
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const cargarVentaParaEditar = async () => {
      if (location.state?.ventaParaEditar) {
        try {
          setProductosVendidos([]);
          setDatosComplementarios({
            tipoPagoId: null,
            empresaId: null,
            clienteId: null,
            tipoComprobanteId: null,
            trabajadorId: null,
            fecha: new Date().toISOString().slice(0, 19),
            moneda: 'SOLES'
          });

          const venta = location.state.ventaParaEditar;
          setModoEdicion(true);
          setVentaId(venta.idVenta);

          const response = await apiClient.get(`/ventas/${venta.idVenta}`);
          const ventaCompleta = response.data;

          const productosCompletos = await Promise.all(
            ventaCompleta.detalles.map(async (detalle) => {
              try {
                const productoResponse = await apiClient.get(`/productos/${detalle.idProducto}`);
                return {
                  idProducto: detalle.idProducto,
                  nombre: productoResponse.data.nombreProducto,
                  precio: detalle.precioUnitario,
                  cantidad: detalle.cantidad,
                  descuento: detalle.descuento || 0,
                  unidadMedida: productoResponse.data.unidadMedida?.abreviatura || 'UND',
                  stock: productoResponse.data.stock
                };
              } catch (error) {
                console.error(`Error al cargar el producto ${detalle.idProducto}:`, error);
                return {
                  idProducto: detalle.idProducto,
                  nombre: 'Producto no encontrado',
                  precio: detalle.precioUnitario,
                  cantidad: detalle.cantidad,
                  descuento: detalle.descuento || 0,
                  unidadMedida: 'UND',
                  stock: 0
                };
              }
            })
          );

          setProductosVendidos(productosCompletos);

          setDatosComplementarios(prev => ({
            ...prev,
            tipoPagoId: ventaCompleta.idTipoPago,
            empresaId: ventaCompleta.idEmpresa,
            clienteId: ventaCompleta.idCliente,
            tipoComprobanteId: ventaCompleta.idTipoComprobantePago,
            trabajadorId: ventaCompleta.idTrabajador,
            fecha: ventaCompleta.fechaVenta,
            moneda: ventaCompleta.moneda || 'SOLES'
          }));

        } catch (error) {
          console.error("Error al cargar detalles de la venta:", error);
          showToast("Error al cargar los detalles de la venta", "danger");
        }
      } else {
        setModoEdicion(false);
        setVentaId(null);
        setProductosVendidos([]);
        setDatosComplementarios({
          tipoPagoId: null,
          empresaId: null,
          clienteId: null,
          tipoComprobanteId: null,
          trabajadorId: null,
          fecha: new Date().toISOString().slice(0, 19),
          moneda: 'SOLES'
        });
      }
    };

    cargarVentaParaEditar();
  }, [location.state]);

  useEffect(() => {
    console.log("Estado recibido:", location.state);
    if (location.state?.cotizacionParaEditar) {
      const datosCotizacion = location.state.cotizacionParaEditar;
      console.log("Cotización a editar:", datosCotizacion);

      // Establecer modo cotización y edición
      setModoEdicion(true);
      setModoCotizacion(true);
      setVentaId(location.state.idCotizacion);

      // Precargar los detalles de productos
      if (datosCotizacion.detalles && Array.isArray(datosCotizacion.detalles)) {
        const productosFormateados = datosCotizacion.detalles.map(detalle => ({
          idProducto: detalle.idProducto,
          nombre: detalle.nombreProducto || 'Producto sin nombre',
          precio: detalle.precioUnitario || 0,
          cantidad: detalle.cantidad || 1,
          descuento: detalle.descuento || 0,
          unidadMedida: detalle.unidadMedida || 'UND',
          stock: 999, // Valor por defecto, se actualizará después
          subtotal: detalle.subtotal || (detalle.precioUnitario * detalle.cantidad)
        }));

        setProductosVendidos(productosFormateados);

        // Actualizar el stock de cada producto
        const actualizarStockProductos = async () => {
          try {
            const productosActualizados = await Promise.all(
              productosFormateados.map(async (producto) => {
                try {
                  const productoResponse = await apiClient.get(`/productos/${producto.idProducto}`);
                  return {
                    ...producto,
                    stock: productoResponse.data.stock || 0,
                    nombre: productoResponse.data.nombreProducto || producto.nombre
                  };
                } catch (error) {
                  console.error(`Error al obtener detalles del producto ${producto.idProducto}:`, error);
                  return producto;
                }
              })
            );
            setProductosVendidos(productosActualizados);
          } catch (error) {
            console.error('Error al actualizar stock de productos:', error);
          }
        };

        actualizarStockProductos();
      }

      // Precargar datos complementarios
      setDatosComplementarios(prev => ({
        ...prev,
        tipoPagoId: datosCotizacion.idTipoPago || prev.tipoPagoId,
        empresaId: datosCotizacion.idEmpresa || prev.empresaId,
        clienteId: datosCotizacion.idCliente || prev.clienteId,
        tipoComprobanteId: datosCotizacion.idTipoComprobantePago || prev.tipoComprobanteId,
        trabajadorId: datosCotizacion.idTrabajador || prev.trabajadorId,
        fecha: datosCotizacion.fechaVenta || new Date().toISOString().slice(0, 19),
        moneda: datosCotizacion.moneda || 'SOLES'
      }));
    }
  }, [location.state]);

  const handleBuscarCotizacion = async () => {
    if (!codigoCotizacion) {
      showToast('Por favor ingrese un código de cotización', 'warning');
      return;
    }

    try {
      // Obtener datos de la cotización
      const response = await apiClient.get(`/ventas/precargar-venta/${codigoCotizacion}`);
      const datosCotizacion = response.data;

      // Precargar los detalles de productos
      if (datosCotizacion.detalles && Array.isArray(datosCotizacion.detalles)) {
        const productosFormateados = datosCotizacion.detalles.map(detalle => ({
          idProducto: detalle.idProducto,
          nombre: detalle.nombreProducto || 'Producto sin nombre',
          precio: detalle.precioUnitario || 0,
          cantidad: detalle.cantidad || 1,
          descuento: detalle.descuento || 0,
          unidadMedida: detalle.unidadMedida || 'UND',
          stock: 999, // Valor por defecto, se actualizará después
          subtotal: detalle.subtotal || (detalle.precioUnitario * detalle.cantidad)
        }));

        setProductosVendidos(productosFormateados);

        // Actualizar el stock de cada producto
        try {
          const productosActualizados = await Promise.all(
            productosFormateados.map(async (producto) => {
              try {
                const productoResponse = await apiClient.get(`/productos/${producto.idProducto}`);
                return {
                  ...producto,
                  stock: productoResponse.data.stock || 0,
                  nombre: productoResponse.data.nombreProducto || producto.nombre
                };
              } catch (error) {
                console.error(`Error al obtener detalles del producto ${producto.idProducto}:`, error);
                return producto;
              }
            })
          );
          setProductosVendidos(productosActualizados);
        } catch (error) {
          console.error('Error al actualizar stock de productos:', error);
        }
      }

      // Precargar datos complementarios
      setDatosComplementarios(prev => ({
        ...prev,
        tipoPagoId: datosCotizacion.idTipoPago || prev.tipoPagoId,
        empresaId: datosCotizacion.idEmpresa || prev.empresaId,
        clienteId: datosCotizacion.idCliente || prev.clienteId,
        tipoComprobanteId: datosCotizacion.idTipoComprobantePago || prev.tipoComprobanteId,
        trabajadorId: datosCotizacion.idTrabajador || prev.trabajadorId,
        fecha: datosCotizacion.fechaVenta || new Date().toISOString().slice(0, 19),
        moneda: datosCotizacion.moneda || 'SOLES'
      }));

      showToast('Cotización cargada exitosamente', 'success');
    } catch (error) {
      console.error('Error al cargar la cotización:', error);
      showToast('Error al cargar la cotización: ' + (error.response?.data?.message || error.message), 'danger');
    }
  };

  const handleGuardarComoCotizacion = async () => {
    if (productosVendidos.length === 0) {
      showToast('Debes agregar al menos un producto para guardar la cotización.', 'danger');
      return;
    }

    const productosInvalidos = productosVendidos.some(
      (producto) => !producto.cantidad || isNaN(producto.cantidad) || producto.cantidad <= 0
    );

    if (productosInvalidos) {
      showToast('Por favor, ingresa una cantidad válida para todos los productos.', 'danger');
      return;
    }

    const datosComplementariosIncompletos = !datosComplementarios.tipoPagoId ||
      !datosComplementarios.empresaId ||
      !datosComplementarios.clienteId ||
      !datosComplementarios.trabajadorId;

    if (datosComplementariosIncompletos) {
      showToast('Falta agregar Datos Venta. Por favor, completa todos los campos requeridos.', 'danger');
      return;
    }

    const totalVenta = productosVendidos.reduce((total, producto) => {
      const subtotal = (producto.precio * (1 - (producto.descuento || 0) / 100)) * producto.cantidad;
      return total + subtotal;
    }, 0);

    const ventaData = {
      idVenta: null,
      serieComprobante: "",
      numeroComprobante: "",
      fechaVenta: datosComplementarios.fecha,
      estadoVenta: "PENDIENTE",
      totalVenta: Number(totalVenta.toFixed(2)),
      fechaModificacion: null,
      moneda: "SOLES",
      observaciones: null,
      idCaja: null,
      idEmpresa: datosComplementarios.empresaId,
      idTipoComprobantePago: datosComplementarios.tipoComprobanteId,
      idTrabajador: datosComplementarios.trabajadorId,
      idCliente: datosComplementarios.clienteId,
      idTipoPago: datosComplementarios.tipoPagoId,
      detalles: productosVendidos.map((producto) => {
        const subtotal = (producto.precio * (1 - (producto.descuento || 0) / 100)) * producto.cantidad;
        const subtotalSinIGV = subtotal / 1.18;
        const igvAplicado = subtotal - subtotalSinIGV;

        return {
          idDetalleVenta: null,
          idVenta: null,
          idProducto: producto.idProducto,
          nombreProducto: null,
          unidadMedida: null,
          cantidad: Number(producto.cantidad.toFixed(2)),
          precioUnitario: Number(producto.precio.toFixed(2)),
          descuento: Number((producto.descuento || 0).toFixed(2)),
          subtotal: Number(subtotal.toFixed(2)),
          subtotalSinIGV: Number(subtotalSinIGV.toFixed(2)),
          igvAplicado: Number(igvAplicado.toFixed(2))
        };
      })
    };

    try {
      const response = await apiClient.post('/cotizaciones/convertir-venta', ventaData);
      showToast('Cotización guardada correctamente.', 'success');
      
      setProductosVendidos([]);
      setDatosComplementarios({
        tipoPagoId: null,
        empresaId: null,
        clienteId: null,
        tipoComprobanteId: null,
        trabajadorId: null,
        fecha: new Date().toISOString().slice(0, 19),
        moneda: 'SOLES'
      });

      if (reiniciarModalProductos) reiniciarModalProductos();
      if (reiniciarModalDatosComplementarios) reiniciarModalDatosComplementarios();
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error al guardar la cotización: ${errorMessage}`, 'danger');
    }
  };

  return (
    <CContainer fluid className="px-4" style={{ 
      marginLeft: 'var(--cui-sidebar-width-collapsed, 56px)',
      maxWidth: 'calc(100vw - var(--cui-sidebar-width-collapsed, 56px) - 6rem)',
      margin: '0 auto',
      paddingLeft: '3rem',
      paddingRight: '3rem'
    }}>
      <CRow className="mb-3 justify-content-center">
        <ModalProductos
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleProductosSeleccionados={handleProductosSeleccionados}
          registrarReinicio={registrarReinicioModalProductos}
        />

        <CompletarVenta
          visible={completarVentaModalVisible}
          onClose={() => setCompletarVentaModalVisible(false)}
          onSave={handleGuardarDatosComplementarios}
          registrarReinicio={registrarReinicioModalDatosComplementarios}
          initialData={datosComplementarios}
        />

        <CCard>
          <CCardBody>
            <div className="d-flex justify-content-between mb-3">
              <div>
                <CButton color="primary" onClick={handleAñadirProducto} className="me-2">
                  Añadir Producto
                </CButton>
                <CButton color="warning" onClick={handleCompletarVenta}>
                  Datos Venta
                </CButton>
              </div>
              <div className="d-flex align-items-center">
                <CInputGroup size="sm" className="me-2" style={{ width: '150px' }}>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Código cotización"
                    value={codigoCotizacion}
                    onChange={(e) => setCodigoCotizacion(e.target.value)}
                  />
                  <CButton
                    color="primary"
                    onClick={handleBuscarCotizacion}
                  >
                    Buscar
                  </CButton>
                </CInputGroup>
                <CRow className="mt-3">
                  <CCol className="d-flex justify-content-end">
                    {modoEdicion ? (
                      <CButton
                        color="success"
                        onClick={handleGuardarVenta}
                        className="me-2"
                      >
                        <CIcon icon={cilSave} className="me-2" />
                        {modoCotizacion ? 'Actualizar Cotización' : 'Actualizar Venta'}
                      </CButton>
                    ) : (
                      <CDropdown>
                        <CDropdownToggle color="success" className="me-2">
                          <CIcon icon={cilSave} className="me-2" />
                          Guardar Venta
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={handleGuardarVenta} style={{ cursor: 'pointer' }}>
                            Guardar como Venta
                          </CDropdownItem>
                          <CDropdownItem onClick={handleGuardarComoCotizacion} style={{ cursor: 'pointer' }}>
                            Guardar como Cotización
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    )}
                  </CCol>
                </CRow>
              </div>
            </div>

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
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-end">
                    <strong>Total:</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-end d-flex align-items-center">
                    <span style={{ marginRight: '5px' }}>
                      {getSimboloMoneda(datosComplementarios.moneda)}
                    </span>
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
      </CRow>
    </CContainer>
  );
};

export default DetalleVenta;