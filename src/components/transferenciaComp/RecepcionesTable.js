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
import { cilCheck, cilPencil, cilTrash, cilInfo } from '@coreui/icons';

const RecepcionesTable = () => {
  const [recepciones, setRecepciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    color: 'danger',
  });

  // Datos de ejemplo para recepciones
  const datosEjemplo = [
    {
      id: 1,
      codigo: 'REC-001',
      fecha: '2024-01-15',
      almacenOrigen: { nombre: 'Almacén Sucursal Norte' },
      almacenDestino: { nombre: 'Almacén Principal' },
      estado: 'PENDIENTE',
      responsable: { nombre: 'Ana Martínez' }
    },
    {
      id: 2,
      codigo: 'REC-002',
      fecha: '2024-01-16',
      almacenOrigen: { nombre: 'Almacén Sucursal Sur' },
      almacenDestino: { nombre: 'Almacén Principal' },
      estado: 'COMPLETADA',
      responsable: { nombre: 'Luis Rodríguez' }
    },
    {
      id: 3,
      codigo: 'REC-003',
      fecha: '2024-01-17',
      almacenOrigen: { nombre: 'Almacén Sucursal Este' },
      almacenDestino: { nombre: 'Almacén Principal' },
      estado: 'PENDIENTE',
      responsable: { nombre: 'Carmen Silva' }
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
        
        setRecepciones(datosEjemplo);
      } catch (err) {
        console.error('Error al cargar recepciones:', err);
        setError('Error al cargar las recepciones');
        setRecepciones([]);
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
      case 'RECIBIDA': return 'primary';
      default: return 'secondary';
    }
  };

  const handleRecibirTransferencia = (id) => {
    showToast(`Función de recibir transferencia ${id} en desarrollo`, 'info');
  };

  const handleEditarRecepcion = (id) => {
    showToast(`Función de editar recepción ${id} en desarrollo`, 'info');
  };

  const handleVerRecepcion = (id) => {
    showToast(`Función de ver recepción ${id} en desarrollo`, 'info');
  };

  const handleEliminarRecepcion = (id) => {
    showToast(`Función de eliminar recepción ${id} en desarrollo`, 'info');
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
            <h5 className="mb-0">Recepciones</h5>
            <small className="text-muted">Transferencias recibidas de otros almacenes</small>
          </div>
        </CCardHeader>
        <CCardBody>
          {(!Array.isArray(recepciones) || recepciones.length === 0) ? (
            <CAlert color="info">
              No hay recepciones registradas. Las transferencias entrantes aparecerán aquí.
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
                {recepciones.map((recepcion, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{recepcion.codigo || `REC-${recepcion.id}`}</CTableDataCell>
                    <CTableDataCell>{formatDate(recepcion.fecha)}</CTableDataCell>
                    <CTableDataCell>{recepcion.almacenOrigen?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{recepcion.almacenDestino?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge bg-${getEstadoBadge(recepcion.estado)}`}>
                        {recepcion.estado || 'N/A'}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{recepcion.responsable?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleVerRecepcion(recepcion.id)}
                        className="me-1"
                      >
                        <CIcon icon={cilInfo} />
                      </CButton>
                      {recepcion.estado?.toUpperCase() === 'PENDIENTE' && (
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() => handleRecibirTransferencia(recepcion.id)}
                          className="me-1"
                        >
                          <CIcon icon={cilCheck} />
                        </CButton>
                      )}
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() => handleEditarRecepcion(recepcion.id)}
                        className="me-1"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarRecepcion(recepcion.id)}
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

export default RecepcionesTable;
