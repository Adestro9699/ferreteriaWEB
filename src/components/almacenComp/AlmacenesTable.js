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
import apiClient from '../../services/apiClient';

const AlmacenesTable = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    color: 'danger',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/almacenes');
        setAlmacenes(response.data);
      } catch (err) {
        console.error('Error al cargar almacenes:', err);
        setError('Error al cargar los almacenes');
        setAlmacenes([]);
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

  // Función para obtener el color del badge según estado
  const getEstadoBadge = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'danger';
      case 'MANTENIMIENTO': return 'warning';
      default: return 'secondary';
    }
  };

  // Función para obtener el color del badge según tipo
  const getTipoBadge = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'PRINCIPAL': return 'primary';
      case 'SECUNDARIO': return 'info';
      case 'ESPECIALIZADO': return 'warning';
      default: return 'secondary';
    }
  };

  const handleNuevoAlmacen = () => {
    showToast('Función de nuevo almacén en desarrollo', 'info');
  };

  const handleEditarAlmacen = async (id) => {
    try {
      await apiClient.put(`/almacenes/${id}`, { /* datos a actualizar */ });
      showToast(`Almacén ${id} actualizado correctamente`, 'success');
    } catch (error) {
      showToast(`Error al actualizar almacén ${id}`, 'danger');
    }
  };

  const handleEliminarAlmacen = async (id) => {
    try {
      await apiClient.delete(`/almacenes/${id}`);
      showToast(`Almacén ${id} eliminado correctamente`, 'success');
      setAlmacenes((prev) => prev.filter((a) => a.idAlmacen !== id));
    } catch (error) {
      showToast(`Error al eliminar almacén ${id}`, 'danger');
    }
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
            <h5 className="mb-0">Lista de Almacenes</h5>
            <small className="text-muted">Gestionar almacenes de la empresa</small>
          </div>
          <CButton color="primary" onClick={handleNuevoAlmacen}>
            <CIcon icon={cilPlus} className="me-2" />
            Nuevo Almacén
          </CButton>
        </CCardHeader>
        <CCardBody>
          {(!Array.isArray(almacenes) || almacenes.length === 0) ? (
            <CAlert color="info">
              No hay almacenes registrados. Haga clic en "Nuevo Almacén" para comenzar.
            </CAlert>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Ubicación</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Fecha de Creación</CTableHeaderCell>
                  <CTableHeaderCell>Observaciones</CTableHeaderCell>
                  <CTableHeaderCell>Sucursal</CTableHeaderCell>
                  <CTableHeaderCell>Dirección Sucursal</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {almacenes.map((almacen) => (
                  <CTableRow key={almacen.idAlmacen}>
                    <CTableDataCell>{almacen.nombre}</CTableDataCell>
                    <CTableDataCell>{almacen.ubicacion}</CTableDataCell>
                    <CTableDataCell>{almacen.telefono}</CTableDataCell>
                    <CTableDataCell>{almacen.esPrincipal ? 'Principal' : 'Secundario'}</CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge bg-${getEstadoBadge(almacen.estadoAlmacen)}`}>
                        {almacen.estadoAlmacen}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{almacen.fechaCreacion}</CTableDataCell>
                    <CTableDataCell>{almacen.observaciones}</CTableDataCell>
                    <CTableDataCell>{almacen.nombreSucursal}</CTableDataCell>
                    <CTableDataCell>{almacen.direccionSucursal}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() => handleEditarAlmacen(almacen.idAlmacen)}
                        className="me-1"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarAlmacen(almacen.idAlmacen)}
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

export default AlmacenesTable;
