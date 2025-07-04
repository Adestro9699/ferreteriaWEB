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

const SucursalesTable = () => {
  const [sucursales, setSucursales] = useState([]);
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
        const response = await apiClient.get('/sucursales');
        setSucursales(response.data);
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
        setError('Error al cargar las sucursales');
        setSucursales([]);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  const getEstadoBadge = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'danger';
      case 'MANTENIMIENTO': return 'warning';
      default: return 'secondary';
    }
  };

  const handleNuevaSucursal = () => {
    showToast('Función de nueva sucursal en desarrollo', 'info');
  };
  const handleEditarSucursal = async (id) => {
    try {
      // Aquí deberías abrir un modal o formulario para editar, pero por ahora solo simula el PUT
      await apiClient.put(`/sucursales/${id}`, { /* datos a actualizar */ });
      showToast(`Sucursal ${id} actualizada correctamente`, 'success');
    } catch (error) {
      showToast(`Error al actualizar sucursal ${id}`, 'danger');
    }
  };
  const handleEliminarSucursal = async (id) => {
    try {
      await apiClient.delete(`/sucursales/${id}`);
      showToast(`Sucursal ${id} eliminada correctamente`, 'success');
      // Opcional: recargar la lista
      setSucursales((prev) => prev.filter((s) => s.idSucursal !== id));
    } catch (error) {
      showToast(`Error al eliminar sucursal ${id}`, 'danger');
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
            <h5 className="mb-0">Lista de Sucursales</h5>
            <small className="text-muted">Gestionar sucursales de la empresa</small>
          </div>
          <CButton color="primary" onClick={handleNuevaSucursal}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Sucursal
          </CButton>
        </CCardHeader>
        <CCardBody>
          {(!Array.isArray(sucursales) || sucursales.length === 0) ? (
            <CAlert color="info">
              No hay sucursales registradas. Haga clic en "Nueva Sucursal" para comenzar.
            </CAlert>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Dirección</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Fecha de Creación</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {sucursales.map((sucursal) => (
                  <CTableRow key={sucursal.idSucursal}>
                    <CTableDataCell>{sucursal.nombre}</CTableDataCell>
                    <CTableDataCell>{sucursal.direccion}</CTableDataCell>
                    <CTableDataCell>{sucursal.telefono}</CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge bg-${getEstadoBadge(sucursal.estadoSucursal)}`}>
                        {sucursal.estadoSucursal}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{sucursal.fechaCreacion}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() => handleEditarSucursal(sucursal.idSucursal)}
                        className="me-1"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarSucursal(sucursal.idSucursal)}
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

export default SucursalesTable; 