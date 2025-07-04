import React, { useState } from 'react';
import {
  CBadge,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CAlert,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CTooltip,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from '@coreui/react';
import { cilSearch, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import VentaDetalleModal from './DetalleVentaPage';
import apiClient from '../../services/apiClient';

const VentasCompletadas = ({ 
  ventas = [], 
  pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  }, 
  onPageChange, 
  onItemsPerPageChange,
  loading = false,
  error = null
}) => {
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [modalAnulacion, setModalAnulacion] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', color: 'danger' });
  const navigate = useNavigate();

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

  // Función para mostrar el código de comprobante en formato "serie - número"
const getCodigoComprobante = (venta) => {
  if (!venta.serieComprobante && !venta.numeroComprobante) return '-';
  return `${venta.serieComprobante || ''} - ${venta.numeroComprobante || ''}`.trim();
};

  const getBadge = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'COMPLETADA': return 'success';
      case 'ANULADA': return 'danger';
      default: return 'primary';
    }
  };

  const handleVerDetalle = (venta) => {
    navigate(`/venta/detalle/${venta.idVenta}`);
  };

  const handleObservar = (venta) => {
    setVentaSeleccionada(venta);
    setModalDetalle(true);
  };

  const handleAnularVenta = async () => {
    try {
      const response = await apiClient.post(`/ventas/${ventaSeleccionada.idVenta}/anular`);

      if (response.status === 200) {
        setToast({
          visible: true,
          message: 'Venta anulada exitosamente',
          color: 'success'
        });
        // Recargar la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al anular la venta:', error);
      setToast({
        visible: true,
        message: 'Error al anular la venta',
        color: 'danger'
      });
    } finally {
      setModalAnulacion(false);
    }
  };

  const handleAnularClick = (venta) => {
    setVentaSeleccionada(venta);
    setModalAnulacion(true);
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const currentItems = ventas;

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <CSpinner color="primary" />
        <span className="ms-2">Cargando ventas completadas...</span>
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
            <CAlert color="info">No hay ventas completadas o anuladas</CAlert>
          ) : (
            <>
              <CTable hover striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Código</CTableHeaderCell>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Empresa</CTableHeaderCell>
                    <CTableHeaderCell>Comprobante</CTableHeaderCell>
                    <CTableHeaderCell>Tipo de Pago</CTableHeaderCell>
                    <CTableHeaderCell>Total S/</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentItems.map((venta) => (
                    <CTableRow key={venta.idVenta} style={{ cursor: 'pointer' }}>
                      <CTableDataCell>{getCodigoComprobante(venta)}</CTableDataCell>
                      <CTableDataCell>{getNombreCliente(venta)}</CTableDataCell>
                      <CTableDataCell>{venta.razonSocialEmpresa || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{venta.tipoComprobante || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{venta.tipoPago || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{venta.totalVenta?.toFixed(2) || '0.00'}</CTableDataCell>
                      <CTableDataCell>{formatFecha(venta.fechaVenta)}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getBadge(venta.estadoVenta)}>
                          {venta.estadoVenta}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CTooltip content="Ver detalles">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => handleVerDetalle(venta)}
                            >
                              <CIcon icon={cilSearch} />
                            </CButton>
                          </CTooltip>
                          {venta.estadoVenta === 'COMPLETADA' && (
                            <CTooltip content="Anular venta">
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleAnularClick(venta)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
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

      {/* Modal de Anulación */}
      <CModal visible={modalAnulacion} onClose={() => setModalAnulacion(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Anulación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea anular esta venta?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalAnulacion(false)}>
            Cancelar
          </CButton>
          <CButton 
            color="danger" 
            onClick={handleAnularVenta}
          >
            Anular
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast para mensajes */}
      <CToaster placement="top-center">
        {toast.visible && (
          <CToast autohide={true} visible={toast.visible} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">Aviso</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <VentaDetalleModal
        venta={ventaSeleccionada}
        visible={modalDetalle}
        onClose={() => setModalDetalle(false)}
        showPrintButton={true}
      />
    </>
  );
};

export default VentasCompletadas;