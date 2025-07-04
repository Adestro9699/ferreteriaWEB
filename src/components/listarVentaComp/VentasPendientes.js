import React, { useState, useRef } from 'react';
import {
  CButton,
  CBadge,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CAlert,
  CTable,
  CFormSelect,
  CSpinner,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilCheckCircle, cilTrash, cilSearch } from '@coreui/icons';
import VentaDetalleModal from './DetalleVentaPage';
import { useNavigate } from 'react-router-dom';

const VentasPendientes = ({
  ventas = [],
  pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  },
  onPageChange,
  onItemsPerPageChange,
  onConfirmarVenta,
  onEliminarVenta,
  idCaja,
  loading = false,
  error = null,
  confirmandoId = null,
  eliminandoId = null
}) => {
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [accionConfirmacion, setAccionConfirmacion] = useState(null);
  const [ventaParaAccion, setVentaParaAccion] = useState(null);
  const [modalCobranza, setModalCobranza] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const navigate = useNavigate();
  const tablaRef = useRef(null);

  // Función para obtener el nombre del cliente según la estructura de datos
  const getNombreCliente = (venta) => {
    if (venta.razonSocialCliente) return venta.razonSocialCliente;
    if (venta.nombresCliente && venta.apellidosCliente) {
      return `${venta.nombresCliente} ${venta.apellidosCliente}`;
    }
    return 'Cliente no especificado';
  };

  // Función para formatear la fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-PE');
  };

  // Función para mostrar el código de comprobante
  const getCodigoComprobante = (venta) => {
    if (!venta.serieComprobante && !venta.numeroComprobante) return '-';
    return `${venta.serieComprobante || ''}${venta.numeroComprobante || ''}`;
  };

  const handleConfirmarClick = (venta) => {
    setVentaParaAccion(venta);
    setModalCobranza(true);
  };

  const handleCobranzaConfirmar = async () => {
    // Si es efectivo, validar el monto recibido
    if (ventaParaAccion.tipoPago?.toUpperCase() === 'EFECTIVO') {
      if (!montoRecibido || parseFloat(montoRecibido) < ventaParaAccion.totalVenta) {
        alert('El monto recibido debe ser mayor o igual al total de la venta');
        return;
      }
    }

    try {
      await onConfirmarVenta(ventaParaAccion.idVenta);
      setModalCobranza(false);
      setMontoRecibido('');
      setVuelto(0);
      setVentaParaAccion(null);
    } catch (error) {
      console.error('Error al confirmar la venta:', error);
    }
  };

  const handleCobranzaCancelar = () => {
    setModalCobranza(false);
    setMontoRecibido('');
    setVuelto(0);
    setVentaParaAccion(null);
  };

  const calcularVuelto = (monto) => {
    if (!monto || !ventaParaAccion || ventaParaAccion.tipoPago?.toUpperCase() !== 'EFECTIVO') return 0;
    const montoNum = parseFloat(monto);
    const total = ventaParaAccion.totalVenta;
    return montoNum >= total ? montoNum - total : 0;
  };

  const handleMontoRecibidoChange = (e) => {
    const valor = e.target.value;
    setMontoRecibido(valor);
    if (ventaParaAccion?.tipoPago?.toUpperCase() === 'EFECTIVO') {
      setVuelto(calcularVuelto(valor));
    }
  };

  const handleEliminarClick = (venta) => {
    setVentaParaAccion(venta);
    setAccionConfirmacion('eliminar');
    setModalConfirmacion(true);
  };

  const confirmarAccion = async () => {
    try {
      if (accionConfirmacion === 'confirmar') {
        await onConfirmarVenta(ventaParaAccion.idVenta);
      } else if (accionConfirmacion === 'eliminar') {
        await onEliminarVenta(ventaParaAccion.idVenta);
      }
    } finally {
      setModalConfirmacion(false);
      setVentaParaAccion(null);
      setAccionConfirmacion(null);
    }
  };

  const cancelarAccion = () => {
    setModalConfirmacion(false);
    setVentaParaAccion(null);
    setAccionConfirmacion(null);
  };

  const handleObservar = (venta) => {
    setVentaSeleccionada(venta);
    setModalDetalle(true);
  };

  const handleEditar = (venta) => {
    navigate('/venta', {
      state: {
        ventaParaEditar: venta,
        modoEdicion: true
      }
    });
  };

  const handleVerDetalle = (venta) => {
    navigate(`/venta/detalle/${venta.idVenta}`);
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const currentItems = ventas;

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <CSpinner color="primary" />
        <span className="ms-2">Cargando ventas pendientes...</span>
      </div>
    );
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>;
  }

  return (
    <>
      <CCard>
        <CCardBody>
          {ventas.length === 0 ? (
            <CAlert color="info">No hay ventas pendientes</CAlert>
          ) : (
            <>
              <CTable
                hover
                striped
                responsive
                ref={tablaRef}
                tabIndex={0}
              >
                <thead>
                  <tr className="small">
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Empresa</th>
                    <th>Comprobante</th>
                    <th>Tipo de Pago</th>
                    <th>Total S/</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(venta => (
                    <tr key={venta.idVenta} className="cursor-pointer">
                      <td>{getCodigoComprobante(venta)}</td>
                      <td>{getNombreCliente(venta)}</td>
                      <td>{venta.razonSocialEmpresa || 'N/A'}</td>
                      <td>{venta.tipoComprobante || 'N/A'}</td>
                      <td>{venta.tipoPago || "N/A"}</td>
                      <td>{venta.totalVenta?.toFixed(2) || '0.00'}</td>
                      <td>{formatFecha(venta.fechaVenta)}</td>
                      <td className="text-center">
                        <CBadge color="warning">PENDIENTE</CBadge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <CTooltip content="Ver detalles">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => handleVerDetalle(venta)}
                            >
                              <CIcon icon={cilSearch} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Editar venta">
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => handleEditar(venta)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Confirmar venta">
                            <CButton
                              color="success"
                              size="sm"
                              onClick={() => handleConfirmarClick(venta)}
                              disabled={confirmandoId === venta.idVenta}
                            >
                              {confirmandoId === venta.idVenta ?
                                <><CSpinner size="sm" /> Confirmando...</> :
                                <CIcon icon={cilCheckCircle} />
                              }
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Eliminar venta">
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminarClick(venta)}
                              disabled={eliminandoId === venta.idVenta}
                            >
                              {eliminandoId === venta.idVenta ?
                                <><CSpinner size="sm" /> Eliminando...</> :
                                <CIcon icon={cilTrash} />
                              }
                            </CButton>
                          </CTooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CTable>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <CFormSelect
                  value={pagination.itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  style={{ width: '80px' }}
                >
                  {[5, 10, 20, 50, 100].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </CFormSelect>
                <CPagination align="end">
                  <CPaginationItem 
                    disabled={pagination.currentPage === 1}
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                  >
                    Anterior
                  </CPaginationItem>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={pagination.currentPage === index + 1}
                      onClick={() => onPageChange(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                  >
                    Siguiente
                  </CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <VentaDetalleModal
        venta={ventaSeleccionada}
        visible={modalDetalle}
        onClose={() => setModalDetalle(false)}
        showPrintButton={true}
        showConfirmButton={false}
        showDeleteButton={false}
      />

      <CModal
        visible={modalConfirmacion}
        onClose={cancelarAccion}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            {accionConfirmacion === 'confirmar' ? 'Confirmar Venta' : 'Eliminar Venta'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea {accionConfirmacion === 'confirmar' ? 'confirmar' : 'eliminar'} esta venta?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={cancelarAccion}>
            Cancelar
          </CButton>
          <CButton
            color={accionConfirmacion === 'confirmar' ? 'success' : 'danger'}
            onClick={confirmarAccion}
          >
            {accionConfirmacion === 'confirmar' ? 'Confirmar' : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Cobranza */}
      <CModal visible={modalCobranza} onClose={handleCobranzaCancelar} size="sm">
        <CModalHeader>
          <CModalTitle>Modal de Cobranza</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {ventaParaAccion && (
            <div>
              <div className="mb-4">
                <h5>Detalles de la Venta</h5>
                <p><strong>Cliente:</strong> {getNombreCliente(ventaParaAccion)}</p>
                <p><strong>Total a Pagar:</strong> S/ {ventaParaAccion.totalVenta?.toFixed(2)}</p>
                <p><strong>Tipo de Pago:</strong> {ventaParaAccion.tipoPago || 'N/A'}</p>
                <p><strong>Fecha:</strong> {formatFecha(ventaParaAccion.fechaVenta)}</p>
              </div>
              
              {ventaParaAccion.tipoPago?.toUpperCase() === 'EFECTIVO' && (
                <>
                  <div className="mb-3">
                    <CFormLabel htmlFor="montoRecibido">Monto Recibido (S/)</CFormLabel>
                    <CFormInput
                      id="montoRecibido"
                      type="number"
                      step="0.01"
                      min={ventaParaAccion.totalVenta}
                      value={montoRecibido}
                      onChange={handleMontoRecibidoChange}
                      placeholder="Ingrese el monto recibido"
                      className="mb-2"
                    />
                  </div>
                  
                  <div className="alert alert-info">
                    <strong>Vuelto a Entregar:</strong> S/ {vuelto.toFixed(2)}
                  </div>
                  
                  {parseFloat(montoRecibido) < ventaParaAccion.totalVenta && montoRecibido && (
                    <div className="alert alert-warning">
                      El monto recibido es menor al total de la venta
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCobranzaCancelar}>
            Cancelar
          </CButton>
          <CButton 
            color="success" 
            onClick={handleCobranzaConfirmar}
            disabled={ventaParaAccion?.tipoPago?.toUpperCase() === 'EFECTIVO' && (!montoRecibido || parseFloat(montoRecibido) < (ventaParaAccion?.totalVenta || 0))}
          >
            Confirmar Venta
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default VentasPendientes;