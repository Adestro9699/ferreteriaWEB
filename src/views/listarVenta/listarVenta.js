import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CContainer, CCard, CCardHeader, CCardBody, CTabs, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CSpinner, CAlert, CButton, CFormInput, CRow, CCol,
  CToaster, CToast, CToastHeader, CToastBody
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import VentasPendientes from '../../components/listarVentaComp/VentasPendientes';
import VentasCompletadas from '../../components/listarVentaComp/VentasCompletadas';

const ListarVenta = () => {
  const navigate = useNavigate();
  // Estados principales
  const [ventasPendientes, setVentasPendientes] = useState([]);
  const [ventasCompletadas, setVentasCompletadas] = useState([]);
  const [loadingPendientes, setLoadingPendientes] = useState(true);
  const [loadingCompletadas, setLoadingCompletadas] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState('pendientes');
  const [toast, setToast] = useState({ visible: false, message: '', color: 'success' });
  
  const showToast = (message, color = 'success') => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ visible: false, message: '', color }), 3000);
  };

  const [paginationPendientes, setPaginationPendientes] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [paginationCompletadas, setPaginationCompletadas] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [eliminandoId, setEliminandoId] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [idCaja, setIdCaja] = useState(localStorage.getItem('idCaja'));

  // Efecto para mantener sincronizado el idCaja con localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIdCaja(localStorage.getItem('idCaja'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  // Función para obtener ventas pendientes
  const fetchVentasPendientes = async () => {
    try {
      setLoadingPendientes(true);
      const response = await apiClient.get('/ventas/pendientes', {
        params: {
          pagina: paginationPendientes.currentPage - 1,
          size: paginationPendientes.itemsPerPage
        }
      });
      
      const ventasTransformadas = response.data.content.map(venta => ({
        ...venta,
        fechaFormateada: formatFecha(venta.fechaVenta),
        nombreCliente: getNombreCliente(venta),
        comprobanteCompleto: `${venta.serieComprobante || ''}${venta.numeroComprobante || ''}`.trim()
      }));
      
      setVentasPendientes(ventasTransformadas);
      setPaginationPendientes(prev => ({
        ...prev,
        totalItems: response.data.totalElements,
        totalPages: response.data.totalPages,
        currentPage: response.data.number + 1
      }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingPendientes(false);
    }
  };

  // Función para obtener ventas completadas y anuladas
  const fetchVentasCompletadas = async () => {
    try {
      setLoadingCompletadas(true);
      const response = await apiClient.get('/ventas/completadas-anuladas', {
        params: {
          pagina: paginationCompletadas.currentPage - 1,
          size: paginationCompletadas.itemsPerPage
        }
      });
      
      const ventasTransformadas = response.data.content.map(venta => ({
        ...venta,
        fechaFormateada: formatFecha(venta.fechaVenta),
        nombreCliente: getNombreCliente(venta),
        comprobanteCompleto: `${venta.serieComprobante || ''}${venta.numeroComprobante || ''}`.trim()
      }));
      
      setVentasCompletadas(ventasTransformadas);
      setPaginationCompletadas(prev => ({
        ...prev,
        totalItems: response.data.totalElements,
        totalPages: response.data.totalPages,
        currentPage: response.data.number + 1
      }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingCompletadas(false);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        navigate('/login');
        return;
      } else if (err.response.status === 403) {
        navigate('/acceso-denegado');
        return;
      }
    }
    setError(err.message || 'Error al cargar las ventas');
    showToast('Error al cargar las ventas', 'danger');
  };

  // Manejadores
  const handleConfirmarVenta = async (idVenta) => {
    if (!idCaja) {
      showToast('Debe abrir una caja primero', 'danger');
      return;
    }

    setConfirmandoId(idVenta);
    try {
      await apiClient.post(`/ventas/${idVenta}/completar`, { idCaja });
      await fetchVentasPendientes();
      await fetchVentasCompletadas();
      showToast('Venta confirmada correctamente', 'success');
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 409: // CONFLICT - Stock insuficiente
            showToast(err.response.data, 'warning');
            break;
          case 503: // SERVICE_UNAVAILABLE - No hay conexión a internet
            showToast('No hay conexión a Internet. No se puede completar la venta.', 'warning');
            break;
          case 404: // NOT_FOUND
            showToast('La venta no fue encontrada', 'danger');
            break;
          case 400: // BAD_REQUEST
            showToast(err.response.data, 'danger');
            break;
          default:
            showToast(err.response.data || 'Error al confirmar la venta', 'danger');
        }
      } else if (err.request) {
        // Error de red (sin respuesta del servidor)
        showToast('No hay conexión a Internet. No se puede completar la venta.', 'warning');
      } else {
        showToast('Error al confirmar la venta', 'danger');
      }
    } finally {
      setConfirmandoId(null);
    }
  };

  const handleEliminarVenta = async (idVenta) => {
    if (!idVenta) {
      showToast('ID de venta no válido', 'danger');
      return;
    }

    try {
      setEliminandoId(idVenta);
      await apiClient.delete(`/ventas/${idVenta}`);
      await fetchVentasPendientes();
      showToast('Venta eliminada correctamente', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (errorMessage.includes('ID de venta no proporcionado')) {
        showToast('Error: ID de venta no válido', 'danger');
      } else {
        showToast(`Error: ${errorMessage}`, 'danger');
      }
    } finally {
      setEliminandoId(null);
    }
  };

  const handlePageChangePendientes = (newPage) => {
    setPaginationPendientes(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageChangeCompletadas = (newPage) => {
    setPaginationCompletadas(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChangePendientes = (newItemsPerPage) => {
    setPaginationPendientes(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
  };

  const handleItemsPerPageChangeCompletadas = (newItemsPerPage) => {
    setPaginationCompletadas(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
  };

  // Efectos para cargar las ventas
  useEffect(() => {
    fetchVentasPendientes();
  }, [paginationPendientes.currentPage, paginationPendientes.itemsPerPage]);

  useEffect(() => {
    fetchVentasCompletadas();
  }, [paginationCompletadas.currentPage, paginationCompletadas.itemsPerPage]);

  // Filtrado y búsqueda
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

  const ventasPendientesFiltradas = filtrarVentas(ventasPendientes);
  const ventasCompletadasFiltradas = filtrarVentas(ventasCompletadas);

  if (loadingPendientes && loadingCompletadas) return (
    <CContainer className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <CSpinner color="primary" />
      <span className="ms-2">Cargando ventas...</span>
    </CContainer>
  );

  if (error) return (
    <CContainer>
      <CAlert color="danger">{error}</CAlert>
      <CButton color="primary" onClick={() => {
        fetchVentasPendientes();
        fetchVentasCompletadas();
      }}>
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
                  PENDIENTES ({ventasPendientesFiltradas.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeKey === 'completadas'}
                  onClick={() => setActiveKey('completadas')}
                  style={{ cursor: 'pointer' }}
                >
                  COMPLETADAS/ANULADAS ({ventasCompletadasFiltradas.length})
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane visible={activeKey === 'pendientes'}>
                <VentasPendientes
                  ventas={ventasPendientesFiltradas}
                  pagination={paginationPendientes}
                  onPageChange={handlePageChangePendientes}
                  onItemsPerPageChange={handleItemsPerPageChangePendientes}
                  onConfirmarVenta={handleConfirmarVenta}
                  onEliminarVenta={handleEliminarVenta}
                  idCaja={idCaja}
                  loading={loadingPendientes}
                  error={error}
                  confirmandoId={confirmandoId}
                  eliminandoId={eliminandoId}
                />
              </CTabPane>
              <CTabPane visible={activeKey === 'completadas'}>
                <VentasCompletadas
                  ventas={ventasCompletadasFiltradas}
                  pagination={paginationCompletadas}
                  onPageChange={handlePageChangeCompletadas}
                  onItemsPerPageChange={handleItemsPerPageChangeCompletadas}
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