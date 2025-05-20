import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CSpinner,
  CAlert,
  CProgress,
  CProgressBar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCallout,
} from '@coreui/react';
import { 
  cilCart, 
  cilMoney, 
  cilBasket, 
  cilWarning,
  cilChartLine, 
  cilPeople,
  cilArrowRight,
  cilOptions,
  cilCalendar,
  cilSettings,
  cilBarChart,
  cilNotes,
  cilSpeedometer,
  cilBell,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import MainChart from './MainChart';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalVentas: 0,
    ventasHoy: 0,
    totalInventario: 0,
    productosAgotados: 0,
    totalClientes: 0,
    ventasPendientes: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('Mensual');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would fetch this data from your API
      // For now, let's simulate some data
      
      // Fetch metrics data (simulated)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // This would be replaced with real API calls in production
      const mockMetrics = {
        totalVentas: 58750.40,
        ventasHoy: 2360.25,
        totalInventario: 342,
        productosAgotados: 12,
        totalClientes: 183,
        ventasPendientes: 5
      };
      
      setMetrics(mockMetrics);
      
      // Recent transactions (simulated)
      const mockTransactions = [
        { id: 1, cliente: 'Juan Perez', monto: 1250.80, fecha: '2023-07-15T14:30:00', estado: 'COMPLETADA', items: 8 },
        { id: 2, cliente: 'María López', monto: 450.30, fecha: '2023-07-15T11:20:00', estado: 'COMPLETADA', items: 3 },
        { id: 3, cliente: 'Construcciones ABC', monto: 3840.50, fecha: '2023-07-14T16:45:00', estado: 'PENDIENTE', items: 24 },
        { id: 4, cliente: 'Carlos Rodriguez', monto: 680.75, fecha: '2023-07-14T09:15:00', estado: 'COMPLETADA', items: 5 },
        { id: 5, cliente: 'Inmobiliaria Sunset', monto: 1875.20, fecha: '2023-07-13T13:40:00', estado: 'COMPLETADA', items: 12 }
      ];
      
      setRecentTransactions(mockTransactions);
      
      // Low stock products (simulated)
      const mockLowStock = [
        { id: 101, nombre: 'Tornillo Hexagonal 5/16"', stock: 8, minimo: 10, categoria: 'Tornillería' },
        { id: 233, nombre: 'Pintura Látex Interior Blanco', stock: 3, minimo: 5, categoria: 'Pinturas' },
        { id: 189, nombre: 'Cable Eléctrico #14 (m)', stock: 42, minimo: 50, categoria: 'Eléctricos' },
        { id: 308, nombre: 'Cerradura Puerta Principal', stock: 2, minimo: 5, categoria: 'Cerrajería' }
      ];
      
      setLowStockProducts(mockLowStock);
      
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format dates
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-PE', options);
  };

  // Get badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'ANULADA': return 'danger';
      default: return 'primary';
    }
  };

  // Determine stock status color
  const getStockStatusColor = (current, min) => {
    if (current === 0) return 'danger';
    if (current < min) return 'warning';
    return 'success';
  };

  // Get current date
  const getCurrentDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-PE', options);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <CSpinner color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <CAlert color="danger">
          {error}
        </CAlert>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4 fade-in-up d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h2 className="dashboard-title mb-0">Dashboard</h2>
          <p className="dashboard-subtitle text-medium-emphasis">Panel de control y métricas de Ferretería SemGar</p>
        </div>
        <div className="d-flex align-items-center mt-2 mt-md-0">
          <small className="text-medium-emphasis me-3 d-none d-md-block">{getCurrentDate()}</small>
          <CDropdown>
            <CDropdownToggle color="light" size="sm">
              <CIcon icon={cilCalendar} className="me-1" /> {period}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setPeriod('Semanal')}>Semanal</CDropdownItem>
              <CDropdownItem onClick={() => setPeriod('Mensual')}>Mensual</CDropdownItem>
              <CDropdownItem onClick={() => setPeriod('Trimestral')}>Trimestral</CDropdownItem>
              <CDropdownItem onClick={() => setPeriod('Anual')}>Anual</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CButton color="light" size="sm" className="ms-2">
            <CIcon icon={cilSettings} />
          </CButton>
        </div>
      </div>

      {/* Callout para Notificaciones */}
      <CCallout color="info" className="bg-white fade-in-up mb-4" style={{ animationDelay: '0.05s' }}>
        <div className="d-flex align-items-center flex-wrap">
          <CIcon icon={cilBell} className="flex-shrink-0 me-3 mb-2 mb-md-0" width={24} />
          <div className="mb-2 mb-md-0">
            <div className="fw-bold">Actualización Importante</div>
            <div>Hay {metrics.productosAgotados} productos con stock bajo que requieren su atención y {metrics.ventasPendientes} ventas pendientes por procesar.</div>
          </div>
          <div className="ms-auto mt-2 mt-md-0">
            <CButton color="info" variant="ghost" size="sm">Ver Todos</CButton>
          </div>
        </div>
      </CCallout>

      {/* Widgets de métricas principales */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3} className="mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CWidgetStatsF
            className="dashboard-card metric-card"
            icon={<CIcon icon={cilMoney} height={24} />}
            title="Ventas Totales"
            value={formatCurrency(metrics.totalVentas)}
            color="primary"
            footer={
              <div className="fw-semibold">
                <span className="text-success small fw-semibold me-1">
                  <i className="fas fa-arrow-up"></i> 12.7%
                </span>
                <span className="small">vs. mes anterior</span>
              </div>
            }
          />
        </CCol>

        <CCol sm={6} lg={3} className="mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CWidgetStatsF
            className="dashboard-card metric-card"
            icon={<CIcon icon={cilCart} height={24} />}
            title="Ventas de Hoy"
            value={formatCurrency(metrics.ventasHoy)}
            color="info"
            footer={
              <Link className="fw-semibold text-decoration-none" to="/venta">
                Nueva venta <CIcon icon={cilArrowRight} className="ms-1" size="sm" />
              </Link>
            }
          />
        </CCol>

        <CCol sm={6} lg={3} className="mb-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CWidgetStatsF
            className="dashboard-card metric-card"
            icon={<CIcon icon={cilBasket} height={24} />}
            title="Total Productos"
            value={metrics.totalInventario.toString()}
            color="success"
            footer={
              <div className="fw-semibold">
                <span className="text-danger small fw-semibold me-1">
                  {metrics.productosAgotados} agotados
                </span>
                <span className="small">requieren atención</span>
              </div>
            }
          />
        </CCol>

        <CCol sm={6} lg={3} className="mb-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CWidgetStatsF
            className="dashboard-card metric-card"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Total Clientes"
            value={metrics.totalClientes.toString()}
            color="warning"
            footer={
              <Link className="fw-semibold text-decoration-none" to="/cliente">
                Ver clientes <CIcon icon={cilArrowRight} className="ms-1" size="sm" />
              </Link>
            }
          />
        </CCol>
      </CRow>

      {/* Gráfico principal */}
      <CCard className="mb-4 dashboard-card hover-card fade-in-up" style={{ animationDelay: '0.5s', overflow: 'visible' }}>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="mb-2 mb-md-0">
            <h4 className="mb-0">Ventas y Compras</h4>
            <small className="text-medium-emphasis">Datos de los últimos 6 meses</small>
          </div>
          <div>
            <CDropdown className="me-2 d-inline-block">
              <CDropdownToggle color="light" size="sm">
                <CIcon icon={cilOptions} /> Opciones
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Ver Detalles</CDropdownItem>
                <CDropdownItem>Actualizar Datos</CDropdownItem>
                <CDropdownItem>Cambiar Vista</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CButton color="light" className="btn-sm">
              Exportar
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', overflow: 'visible' }}>
          <div className="chart-container" style={{ marginBottom: '0.5rem' }}>
            <MainChart />
          </div>
        </CCardBody>
      </CCard>

      <CRow>
        {/* Transacciones recientes */}
        <CCol xl={7} className="mb-4 fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CCard className="h-100 dashboard-card">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">Transacciones Recientes</h4>
                <small className="text-medium-emphasis">Ventas de los últimos días</small>
              </div>
              <CButton color="light" size="sm">
                <CIcon icon={cilBarChart} className="me-1" /> Análisis
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive small className="dashboard-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Monto</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentTransactions.map(transaction => (
                    <CTableRow key={transaction.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{transaction.cliente}</div>
                        <div className="small text-medium-emphasis">
                          {transaction.items} {transaction.items > 1 ? 'items' : 'item'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(transaction.fecha)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{formatCurrency(transaction.monto)}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getBadgeColor(transaction.estado)} className="status-badge">
                          {transaction.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton 
                          color="light" 
                          size="sm"
                          onClick={() => navigate(`/venta/detalle/${transaction.id}`)}
                        >
                          Ver detalle
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="text-center mt-3">
                <CButton color="link" onClick={() => navigate('/listar-venta')}>
                  Ver todas las transacciones
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Productos con stock bajo */}
        <CCol xl={5} className="mb-4 fade-in-up" style={{ animationDelay: '0.7s' }}>
          <CCard className="h-100 dashboard-card">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <CIcon icon={cilWarning} className="me-2 text-warning" /> Productos con Stock Bajo
                </h4>
                <small className="text-medium-emphasis">Requieren reposición pronto</small>
              </div>
              <CButton color="light" size="sm">
                <CIcon icon={cilNotes} className="me-1" /> Reporte
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive small className="dashboard-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Producto</CTableHeaderCell>
                    <CTableHeaderCell>Categoría</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Stock</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lowStockProducts.map(product => (
                    <CTableRow key={product.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{product.nombre}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {product.categoria}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{product.stock} / {product.minimo}</div>
                        <CProgress thin className="mt-1 thin-progress">
                          <CProgressBar 
                            color={getStockStatusColor(product.stock, product.minimo)} 
                            value={Math.min((product.stock / product.minimo) * 100, 100)} 
                          />
                        </CProgress>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getStockStatusColor(product.stock, product.minimo)} className="status-badge">
                          {product.stock === 0 ? 'Agotado' : (product.stock < product.minimo ? 'Bajo' : 'OK')}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
                <CButton color="primary" onClick={() => navigate('/compra')}>
                  Registrar Compra
                </CButton>
                <CButton color="light" onClick={() => navigate('/producto')}>
                  Ver Inventario
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Accesos rápidos y Estadísticas */}
      <CRow>
        <CCol lg={8} className="mb-4 fade-in-up" style={{ animationDelay: '0.8s' }}>
          <CCard className="dashboard-card">
            <CCardHeader>
              <h4 className="mb-0">Accesos Rápidos</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="text-center">
                <CCol md={3} sm={6} className="mb-3">
                  <Link to="/venta" className="text-decoration-none">
                    <CCard className="p-3 shadow-sm hover-card quick-access-card">
                      <div className="quick-access-icon bg-primary text-white">
                        <CIcon icon={cilCart} height={24} />
                      </div>
                      <h5 className="quick-access-title">Nueva Venta</h5>
                    </CCard>
                  </Link>
                </CCol>
                <CCol md={3} sm={6} className="mb-3">
                  <Link to="/compra" className="text-decoration-none">
                    <CCard className="p-3 shadow-sm hover-card quick-access-card">
                      <div className="quick-access-icon bg-success text-white">
                        <CIcon icon={cilBasket} height={24} />
                      </div>
                      <h5 className="quick-access-title">Nueva Compra</h5>
                    </CCard>
                  </Link>
                </CCol>
                <CCol md={3} sm={6} className="mb-3">
                  <Link to="/producto" className="text-decoration-none">
                    <CCard className="p-3 shadow-sm hover-card quick-access-card">
                      <div className="quick-access-icon bg-info text-white">
                        <CIcon icon={cilWarning} height={24} />
                      </div>
                      <h5 className="quick-access-title">Gestión de Stock</h5>
                    </CCard>
                  </Link>
                </CCol>
                <CCol md={3} sm={6} className="mb-3">
                  <Link to="/listar-venta" className="text-decoration-none">
                    <CCard className="p-3 shadow-sm hover-card quick-access-card">
                      <div className="quick-access-icon bg-warning text-white">
                        <CIcon icon={cilChartLine} height={24} />
                      </div>
                      <h5 className="quick-access-title">Reportes</h5>
                    </CCard>
                  </Link>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Resumen de Rendimiento */}
        <CCol lg={4} className="mb-4 fade-in-up" style={{ animationDelay: '0.9s' }}>
          <CCard className="dashboard-card h-100">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <CIcon icon={cilSpeedometer} className="me-2 text-primary" /> Rendimiento
                </h4>
                <CDropdown>
                  <CDropdownToggle color="transparent" size="sm" caret={false}>
                    <CIcon icon={cilOptions} />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Actualizar</CDropdownItem>
                    <CDropdownItem>Detalles</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <div>Productos más vendidos</div>
                  <div className="fw-bold">76%</div>
                </div>
                <CProgress className="thin-progress">
                  <CProgressBar color="success" value={76} />
                </CProgress>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <div>Satisfacción de clientes</div>
                  <div className="fw-bold">92%</div>
                </div>
                <CProgress className="thin-progress">
                  <CProgressBar color="info" value={92} />
                </CProgress>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <div>Eficiencia de inventario</div>
                  <div className="fw-bold">68%</div>
                </div>
                <CProgress className="thin-progress">
                  <CProgressBar color="warning" value={68} />
                </CProgress>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <div>Objetivo de ventas mensual</div>
                  <div className="fw-bold">84%</div>
                </div>
                <CProgress className="thin-progress">
                  <CProgressBar color="primary" value={84} />
                </CProgress>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;