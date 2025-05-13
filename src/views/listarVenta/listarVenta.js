import React, { useState, useEffect } from 'react';
import {
  CContainer, CCard, CCardHeader, CCardBody, CTabs, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CSpinner, CAlert, CButton, CFormInput, CRow, CCol,
  CToaster, CToast, CToastHeader, CToastBody
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import VentasPendientes from '../../components/listarVentaComp/VentasPendientes';
import VentasCompletadas from '../../components/listarVentaComp/VentasCompletadas';

const ListarVenta = () => {
  // Estados principales
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState('pendientes');
  const [toast, setToast] = useState({ visible: false, message: '', color: 'success' });
  
  const showToast = (message, color = 'success') => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ visible: false, message: '', color }), 3000);
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  const [eliminandoId, setEliminandoId] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const idCaja = localStorage.getItem('idCaja');

  // Función para formatear la fecha
  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el nombre del cliente
  const getNombreCliente = (venta) => {
    if (venta.razonSocialCliente) return venta.razonSocialCliente;
    if (venta.nombresCliente && venta.apellidosCliente) {
      return `${venta.nombresCliente} ${venta.apellidosCliente}`;
    }
    return 'Cliente no especificado';
  };

  // Función optimizada que usa el endpoint de resumen
  const fetchVentasResumen = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/ventas/resumen');
      
      // Transformamos los datos para un mejor manejo
      const ventasTransformadas = response.data.map(venta => ({
        ...venta,
        fechaFormateada: formatFecha(venta.fechaVenta),
        nombreCliente: getNombreCliente(venta),
        comprobanteCompleto: `${venta.serieComprobante || ''}${venta.numeroComprobante || ''}`.trim()
      }));
      
      setVentas(ventasTransformadas);
      setPagination(prev => ({
        ...prev,
        totalItems: ventasTransformadas.length
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar las ventas');
      showToast('Error al cargar las ventas', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores
  const handleConfirmarVenta = async (idVenta) => {
    if (!idCaja) {
      showToast('Debe abrir una caja primero', 'danger');
      return;
    }

    try {
      setConfirmandoId(idVenta);
      await apiClient.post(`/ventas/${idVenta}/completar`, { idCaja });
      await fetchVentasResumen();
      showToast('Venta confirmada correctamente', 'success');
    } catch (err) {
      showToast(`Error al confirmar: ${err.response?.data?.message || err.message}`, 'danger');
    } finally {
      setConfirmandoId(null);
    }
  };

  const handleEliminarVenta = async (idVenta) => {
    try {
      setEliminandoId(idVenta);
      await apiClient.delete(`/ventas/${idVenta}`);
      await fetchVentasResumen();
      showToast('Venta eliminada correctamente', 'success');
    } catch (err) {
      showToast(`Error: ${err.response?.data?.message || err.message}`, 'danger');
    } finally {
      setEliminandoId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination({
      ...pagination,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    });
  };

  // Efecto inicial
  useEffect(() => {
    fetchVentasResumen();
  }, []);

  // Filtrado y búsqueda optimizado para el JSON recibido
  const filtrarVentas = (ventas) => {
    if (!searchTerm) return ventas;
    
    const searchLower = searchTerm.toLowerCase();
    return ventas.filter(venta => {
      return (
        venta.comprobanteCompleto.toLowerCase().includes(searchLower) ||
        venta.nombreCliente.toLowerCase().includes(searchLower) ||
        venta.tipoComprobante.toLowerCase().includes(searchLower) ||
        venta.tipoPago.toLowerCase().includes(searchLower) ||
        venta.totalVenta.toString().includes(searchTerm)
      );
    });
  };

  const ventasPendientes = filtrarVentas(ventas.filter(v => v.estadoVenta === 'PENDIENTE'));
  const ventasCompletadas = filtrarVentas(ventas.filter(v => ['COMPLETADA', 'ANULADA'].includes(v.estadoVenta)));

  if (loading) return (
    <CContainer className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <CSpinner color="primary" />
      <span className="ms-2">Cargando ventas...</span>
    </CContainer>
  );

  if (error) return (
    <CContainer>
      <CAlert color="danger">{error}</CAlert>
      <CButton color="primary" onClick={fetchVentasResumen}>
        Reintentar
      </CButton>
    </CContainer>
  );

  return (
    <CContainer fluid className="px-4" style={{ 
      marginLeft: 'var(--cui-sidebar-width-collapsed, 56px)',
      maxWidth: 'calc(100vw - var(--cui-sidebar-width-collapsed, 56px) - 6rem)',
      margin: '0 auto',
      paddingLeft: '3rem',
      paddingRight: '3rem'
    }}>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol md={8}>
              <h4>LISTA DE VENTAS</h4>
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                placeholder="Buscar por cliente, comprobante o monto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
                className="float-end"
                style={{ width: '250px' }}
              />
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <CTabs activeKey={activeKey} onActiveKeyChange={(key) => setActiveKey(key)}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink
                  active={activeKey === 'pendientes'}
                  onClick={() => setActiveKey('pendientes')}
                  style={{ cursor: 'pointer' }}
                >
                  PENDIENTES ({ventasPendientes.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeKey === 'completadas'}
                  onClick={() => setActiveKey('completadas')}
                  style={{ cursor: 'pointer' }}
                >
                  COMPLETADAS/ANULADAS ({ventasCompletadas.length})
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane visible={activeKey === 'pendientes'}>
                <VentasPendientes
                  ventas={ventasPendientes}
                  pagination={{
                    currentPage: pagination.currentPage,
                    itemsPerPage: pagination.itemsPerPage,
                    totalItems: ventasPendientes.length
                  }}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  onConfirmarVenta={handleConfirmarVenta}
                  onEliminarVenta={handleEliminarVenta}
                  idCaja={idCaja}
                  loading={loading}
                  error={error}
                  confirmandoId={confirmandoId}
                  eliminandoId={eliminandoId}
                />
              </CTabPane>
              <CTabPane visible={activeKey === 'completadas'}>
                <VentasCompletadas
                  ventas={ventasCompletadas}
                  pagination={{
                    currentPage: pagination.currentPage,
                    itemsPerPage: pagination.itemsPerPage,
                    totalItems: ventasCompletadas.length
                  }}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>

      <CToaster placement="top-center">
        {toast.visible && (
          <CToast autohide={true} visible={toast.visible} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">Notificación</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </CContainer>
  );
};

export default ListarVenta;