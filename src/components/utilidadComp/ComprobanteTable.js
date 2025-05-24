import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const ComprobanteTable = ({ onEdit, onToast }) => {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComprobantes();
  }, []);

  const fetchComprobantes = async () => {
    try {
      const response = await apiClient.get('/tipo-comprobantes-pago');
      setComprobantes(response.data);
    } catch (error) {
      console.error('Error al cargar comprobantes:', error);
      onToast('Error al cargar los comprobantes', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este comprobante?')) {
      try {
        const response = await apiClient.delete(`/tipo-comprobantes-pago/${id}`);
        if (response.status === 204) {
          onToast('Comprobante eliminado exitosamente');
          fetchComprobantes();
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        if (error.response?.status === 404) {
          onToast('El comprobante no fue encontrado', 'warning');
        } else {
          onToast('Error al eliminar el comprobante', 'danger');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Nombre</CTableHeaderCell>
          <CTableHeaderCell>Descripción</CTableHeaderCell>
          <CTableHeaderCell>Código Nubefact</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {comprobantes.map((comprobante) => (
          <CTableRow key={comprobante.idTipoComprobantePago}>
            <CTableDataCell>{comprobante.nombre}</CTableDataCell>
            <CTableDataCell>{comprobante.descripcion}</CTableDataCell>
            <CTableDataCell>{comprobante.codigoNubefact}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={comprobante.estado === 'ACTIVO' ? 'success' : 'danger'}>
                {comprobante.estado}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(comprobante)}
              >
                Editar
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDelete(comprobante.idTipoComprobantePago)}
              >
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default ComprobanteTable; 