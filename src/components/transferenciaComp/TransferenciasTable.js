import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilInfo } from '@coreui/icons';

const TransferenciasTable = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    color: 'danger',
  });

  // Datos de ejemplo para transferencias salientes
  const datosEjemplo = [
    {
      id: 1,
      codigo: 'TRF-001',
      fecha: '2024-01-15',
      almacenOrigen: { nombre: 'Almacén Principal' },
      almacenDestino: { nombre: 'Almacén Sucursal Norte' },
      estado: 'COMPLETADA',
      responsable: { nombre: 'Juan Pérez' }
    },
    {
      id: 2,
      codigo: 'TRF-002',
      fecha: '2024-01-16',
      almacenOrigen: { nombre: 'Almacén Principal' },
      almacenDestino: { nombre: 'Almacén Sucursal Sur' },
      estado: 'PENDIENTE',
      responsable: { nombre: 'María García' }
    },
    {
      id: 3,
      codigo: 'TRF-003',
      fecha: '2024-01-17',
      almacenOrigen: { nombre: 'Almacén Principal' },
      almacenDestino: { nombre: 'Almacén Sucursal Este' },
      estado: 'EN_TRANSITO',
      responsable: { nombre: 'Carlos López' }
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTransferencias(datosEjemplo);
      } catch (err) {
        console.error('Error al cargar transferencias:', err);
        setError('Error al cargar las transferencias');
        setTransferencias([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para mostrar toast
  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  // Función para obtener el color del badge según estado
  const getEstadoBadge = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'warning';
      case 'COMPLETADA': return 'success';
      case 'ANULADA': return 'danger';
      case 'EN_TRANSITO': return 'info';
      default: return 'primary';
    }
  };

  const handleNuevaTransferencia = () => {
    showToast('Función de nueva transferencia en desarrollo', 'info');
  };

  const handleEditarTransferencia = (id) => {
    showToast(`Función de editar transferencia ${id} en desarrollo`, 'info');
  };

  const handleVerTransferencia = (id) => {
    showToast(`Función de ver transferencia ${id} en desarrollo`, 'info');
  };

  const handleEliminarTransferencia = (id) => {
    showToast(`Función de eliminar transferencia ${id} en desarrollo`, 'info');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-3">
        {error}
      </CAlert>
    );
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Transferencias Salientes</h5>
            <small className="text-muted">Transferencias enviadas a otros almacenes</small>
          </div>
          <CButton color="primary" onClick={handleNuevaTransferencia}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Transferencia
          </CButton>
        </CCardHeader>
        <CCardBody>
          {(!Array.isArray(transferencias) || transferencias.length === 0) ? (
            <CAlert color="info">
              No hay transferencias salientes registradas. Haga clic en "Nueva Transferencia" para comenzar.
            </CAlert>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Almacén Origen</CTableHeaderCell>
                  <CTableHeaderCell>Almacén Destino</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Responsable</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transferencias.map((transferencia, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{transferencia.codigo || `TRF-${transferencia.id}`}</CTableDataCell>
                    <CTableDataCell>{formatDate(transferencia.fecha)}</CTableDataCell>
                    <CTableDataCell>{transferencia.almacenOrigen?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{transferencia.almacenDestino?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge bg-${getEstadoBadge(transferencia.estado)}`}>
                        {transferencia.estado || 'N/A'}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{transferencia.responsable?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleVerTransferencia(transferencia.id)}
                        className="me-1"
                      >
                        <CIcon icon={cilInfo} />
                      </CButton>
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() => handleEditarTransferencia(transferencia.id)}
                        className="me-1"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarTransferencia(transferencia.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Toast */}
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
    </>
  );
};

export default TransferenciasTable; 