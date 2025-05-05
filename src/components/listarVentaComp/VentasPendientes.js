import React, { useState, useRef } from 'react';
import {
  CButton,
  CBadge,
  CPagination,
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
  CModalFooter
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
    totalItems: 0
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
    setAccionConfirmacion('confirmar');
    setModalConfirmacion(true);
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
      if (tablaRef.current) {
        tablaRef.current.focus();
      }
    }
  };

  const cancelarAccion = () => {
    setModalConfirmacion(false);
    setVentaParaAccion(null);
    setAccionConfirmacion(null);
    if (tablaRef.current) {
      tablaRef.current.focus();
    }
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
  const currentItems = ventas.slice(startIndex, endIndex);

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
                              disabled={confirmandoId === venta.idVenta || !idCaja}
                              title={!idCaja ? "Debe abrir una caja primero" : ""}
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
                <CPagination
                  activePage={pagination.currentPage}
                  pages={Math.ceil(ventas.length / pagination.itemsPerPage)}
                  onActivePageChange={onPageChange}
                  doubleArrows={false}
                  align="end"
                />
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal
        visible={modalConfirmacion}
        onClose={cancelarAccion}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Confirmar Acción</CModalTitle>
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

      <VentaDetalleModal
        venta={ventaSeleccionada}
        visible={modalDetalle}
        onClose={() => setModalDetalle(false)}
        showConfirmButton={true}
        confirmButtonText="Confirmar Venta"
        confirmButtonDisabled={!idCaja || confirmandoId === ventaSeleccionada?.idVenta}
        showDeleteButton={true}
        deleteButtonText="Eliminar Venta"
        deleteButtonDisabled={eliminandoId === ventaSeleccionada?.idVenta}
        onConfirm={() => {
          if (ventaSeleccionada) {
            handleConfirmarClick(ventaSeleccionada);
            setModalDetalle(false);
          }
        }}
        onDelete={() => {
          if (ventaSeleccionada) {
            handleEliminarClick(ventaSeleccionada);
            setModalDetalle(false);
          }
        }}
        isConfirming={confirmandoId === ventaSeleccionada?.idVenta}
        isDeleting={eliminandoId === ventaSeleccionada?.idVenta}
        idCaja={idCaja}
      />
    </>
  );
};

export default VentasPendientes;