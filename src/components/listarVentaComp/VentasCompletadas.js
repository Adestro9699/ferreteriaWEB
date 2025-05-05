import React, { useState } from 'react';
import {
  CBadge,
  CPagination,
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
  CSpinner
} from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import VentaDetalleModal from './DetalleVentaPage';

const VentasCompletadas = ({ 
  ventas = [], 
  pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }, 
  onPageChange, 
  onItemsPerPageChange,
  loading = false,
  error = null
}) => {
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
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

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const currentItems = ventas.slice(startIndex, endIndex);

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
                        <CTooltip content="Ver detalles">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleVerDetalle(venta)}
                          >
                            <CIcon icon={cilSearch} />
                          </CButton>
                        </CTooltip>
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